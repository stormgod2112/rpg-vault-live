import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "../shared/schema";
import { sendPasswordResetEmail } from "./email-service";
import { sendPasswordResetEmailWithGmail } from "./nodemailer-service";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "rpgvault-secret-key-development-only",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      // Validate required fields
      if (!username || !password || !email) {
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Username, password, and email are required" 
        });
      }

      // Check if user already exists (username or email)
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          error: "Username already exists", 
          details: "Please choose a different username" 
        });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          error: "Email already exists", 
          details: "An account with this email already exists" 
        });
      }

      // Create new user
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return next(err);
        }
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: "Failed to create account" 
      });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Password reset routes
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          error: "Email required", 
          details: "Please provide your email address" 
        });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security reasons
        return res.status(200).json({ 
          message: "If an account with that email exists, we've sent a password reset link." 
        });
      }

      // Generate secure token
      const resetToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      // Store token in database
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt
      });

      // Send email - try SendGrid first, then Gmail as fallback
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      let emailSent = await sendPasswordResetEmail(user.email, resetToken, baseUrl);

      // If SendGrid fails, try Gmail fallback
      if (!emailSent) {
        console.log('SendGrid failed, trying Gmail fallback...');
        emailSent = await sendPasswordResetEmailWithGmail(
          user.email, 
          resetToken, 
          baseUrl,
          process.env.GMAIL_USER,
          process.env.GMAIL_PASSWORD
        );
      }

      if (!emailSent) {
        // In development, show the reset link in console for testing
        if (process.env.NODE_ENV === 'development') {
          const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
          console.log('\n=== DEVELOPMENT MODE - PASSWORD RESET LINK ===');
          console.log('Email sending failed, but here is your reset link:');
          console.log(resetLink);
          console.log('Copy and paste this URL in your browser to reset your password.');
          console.log('===============================================\n');
          
          // Return success in development for testing
          return res.status(200).json({ 
            message: "Password reset link generated. Check server console for the link (development mode)." 
          });
        }
        
        return res.status(500).json({ 
          error: "Email sending failed", 
          details: "Could not send password reset email" 
        });
      }

      // Clean up expired tokens
      await storage.cleanupExpiredTokens();

      res.status(200).json({ 
        message: "If an account with that email exists, we've sent a password reset link." 
      });

    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: "Failed to process password reset request" 
      });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ 
          error: "Missing required fields", 
          details: "Token and new password are required" 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: "Password too short", 
          details: "Password must be at least 6 characters long" 
        });
      }

      // Get valid token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ 
          error: "Invalid or expired token", 
          details: "The reset link is invalid or has expired" 
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      const updatedUser = await storage.updateUserPassword(resetToken.userId, hashedPassword);
      if (!updatedUser) {
        return res.status(404).json({ 
          error: "User not found", 
          details: "Associated user account not found" 
        });
      }

      // Mark token as used
      await storage.markPasswordResetTokenAsUsed(resetToken.id);

      res.status(200).json({ 
        message: "Password successfully reset. You can now log in with your new password." 
      });

    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: "Failed to reset password" 
      });
    }
  });

  // Validate reset token (for frontend to check if token is valid)
  app.get("/api/validate-reset-token/:token", async (req, res) => {
    try {
      const { token } = req.params;

      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ 
          valid: false, 
          message: "Invalid or expired token" 
        });
      }

      res.status(200).json({ 
        valid: true, 
        message: "Token is valid" 
      });

    } catch (error) {
      console.error("Validate token error:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Error validating token" 
      });
    }
  });
}

export { hashPassword, comparePasswords };
