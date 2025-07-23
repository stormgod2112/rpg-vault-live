import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertRpgItemSchema, insertReviewSchema, insertForumThreadSchema, insertForumPostSchema, insertAdventurePhotoSchema, insertAdventureCommentSchema, insertCommentVoteSchema } from "../shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // RPG Items routes
  app.get("/api/rpgs", async (req, res) => {
    try {
      const { genre, type, system, search, limit, offset, featured } = req.query;
      const rpgs = await storage.getRpgItems({
        genre: genre as string,
        type: type as string,
        system: system as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      });
      res.json(rpgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RPGs" });
    }
  });

  app.get("/api/rpgs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rpg = await storage.getRpgItem(id);
      if (!rpg) {
        return res.status(404).json({ error: "RPG not found" });
      }
      res.json(rpg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RPG" });
    }
  });

  app.post("/api/rpgs", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const validatedData = insertRpgItemSchema.parse(req.body);
      const rpg = await storage.createRpgItem(validatedData);
      res.status(201).json(rpg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      // Check for duplicate constraint violation
      if (error instanceof Error && error.message.includes('unique_adventure')) {
        return res.status(409).json({ 
          error: "Duplicate adventure detected", 
          message: `An adventure with the title "${req.body.title}" by ${req.body.publisher} (${req.body.yearPublished}) for ${req.body.system} already exists. Please check existing entries before adding new ones.`
        });
      }
      console.error("Failed to create RPG:", error);
      res.status(500).json({ error: "Failed to create RPG" });
    }
  });

  app.put("/api/rpgs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertRpgItemSchema.partial().parse(req.body);
      const rpg = await storage.updateRpgItem(id, validatedData);
      
      if (!rpg) {
        return res.status(404).json({ error: "RPG not found" });
      }
      
      res.json(rpg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      // Check for duplicate constraint violation
      if (error instanceof Error && error.message.includes('unique_adventure')) {
        return res.status(409).json({ 
          error: "Duplicate adventure detected", 
          message: `An adventure with the title "${req.body.title}" by ${req.body.publisher} (${req.body.yearPublished}) for ${req.body.system} already exists. Please check existing entries before adding new ones.`
        });
      }
      console.error("Failed to update RPG:", error);
      res.status(500).json({ error: "Failed to update RPG" });
    }
  });

  // Toggle featured status (Admin only)
  app.patch("/api/rpgs/:id/featured", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { isFeatured } = req.body;
      
      if (typeof isFeatured !== 'boolean') {
        return res.status(400).json({ error: "isFeatured must be a boolean" });
      }

      const rpg = await storage.toggleFeatured(id, isFeatured);
      
      if (!rpg) {
        return res.status(404).json({ error: "RPG not found" });
      }
      
      res.json(rpg);
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
      res.status(500).json({ error: "Failed to toggle featured status" });
    }
  });

  // Reviews routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { rpgId } = req.query;
      const reviews = await storage.getReviews(rpgId ? parseInt(rpgId as string) : undefined);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log("Review submission data:", req.body);
      console.log("User ID:", req.user!.id);

      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      console.log("Validated data:", validatedData);
      
      const review = await storage.createReview(validatedData);
      
      // Update the RPG item's rating after creating the review
      if (validatedData.rpgItemId) {
        await storage.updateRpgItemRating(validatedData.rpgItemId);
      }
      
      // Return the review with numeric rating
      res.status(201).json({
        ...review,
        rating: parseFloat(review.rating)
      });
    } catch (error) {
      console.error("Review creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Rankings routes


  // Forum routes
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum categories" });
    }
  });

  app.get("/api/forum/threads", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const threads = await storage.getForumThreads(
        categoryId ? parseInt(categoryId as string) : undefined
      );
      res.json(threads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum threads" });
    }
  });

  app.get("/api/forum/threads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const thread = await storage.getForumThread(id);
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  app.post("/api/forum/threads", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertForumThreadSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const thread = await storage.createForumThread(validatedData);
      res.status(201).json(thread);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create thread" });
    }
  });

  app.get("/api/forum/posts/:threadId", async (req, res) => {
    try {
      const threadId = parseInt(req.params.threadId);
      const posts = await storage.getForumPosts(threadId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Rankings routes
  app.get("/api/rankings/overall", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const topRated = await storage.getTopRatedRpgs(undefined, limit, offset);
      const totalCount = await storage.getTopRatedRpgsCount();
      
      res.json({
        items: topRated,
        totalCount,
        hasMore: offset + limit < totalCount
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  });

  // Genre-specific rankings with category mapping  
  app.get("/api/rankings/:genre", async (req, res) => {
    try {
      const { genre } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Map category to actual genres in our database
      let mappedGenre: string | undefined;
      if (genre !== 'overall') {
        const genreMap: Record<string, string> = {
          'fantasy': 'fantasy',
          'science-fiction': 'sci-fi',
          'sci-fi': 'sci-fi',
          'horror': 'horror',
          'historical': 'historical', 
          'steampunk-dieselpunk': 'sci-fi',
          'science-fantasy': 'sci-fi',
          'wuxia-eastern': 'fantasy',
          'mythological': 'fantasy',
          'comedy-satirical': 'fantasy',
          'anthropomorphic': 'fantasy',
          'children-family-friendly': 'fantasy',
          'superhero': 'superhero',
          'modern-urban': 'modern',
          'modern': 'modern',
          'mystery-investigation': 'horror',
          'anime-manga': 'fantasy'
        };
        mappedGenre = genreMap[genre] || genre;
      }
      
      if (genre === 'overall') {
        const topRated = await storage.getTopRatedRpgs(undefined, limit, offset);
        const totalCount = await storage.getTopRatedRpgsCount();
        
        res.json({
          items: topRated,
          totalCount,
          hasMore: offset + limit < totalCount
        });
      } else {
        const topRated = await storage.getTopRatedRpgs(mappedGenre, limit, offset);
        const totalCount = await storage.getTopRatedRpgsCount(mappedGenre);
        
        res.json({
          items: topRated,
          totalCount,
          hasMore: offset + limit < totalCount
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  });

  // Admin route to recalculate Bayesian ratings
  app.post("/api/admin/recalculate-ratings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      await storage.updateGlobalRatingAverage();
      res.json({ message: "Bayesian ratings recalculated successfully" });
    } catch (error) {
      console.error("Error recalculating ratings:", error);
      res.status(500).json({ error: "Failed to recalculate ratings" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }

      if (!type || type === 'rpgs') {
        const rpgs = await storage.getRpgItems({ search: q as string, limit: 20 });
        res.json({ rpgs });
      } else {
        res.json({ rpgs: [] });
      }
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Adventure Photos routes
  app.get("/api/adventure-photos/:rpgId", async (req, res) => {
    try {
      const rpgId = parseInt(req.params.rpgId);
      const photos = await storage.getAdventurePhotos(rpgId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adventure photos" });
    }
  });

  app.post("/api/adventure-photos", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertAdventurePhotoSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const photo = await storage.createAdventurePhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });

  app.delete("/api/adventure-photos/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deleteAdventurePhoto(id);
      
      if (success) {
        res.json({ message: "Photo deleted successfully" });
      } else {
        res.status(404).json({ error: "Photo not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  app.patch("/api/adventure-photos/:id/approve", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.approveAdventurePhoto(id);
      
      if (success) {
        res.json({ message: "Photo approved successfully" });
      } else {
        res.status(404).json({ error: "Photo not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to approve photo" });
    }
  });

  app.get("/api/admin/pending-photos", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const pendingPhotos = await storage.getPendingAdventurePhotos();
      res.json(pendingPhotos);
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      res.status(500).json({ error: "Failed to fetch pending photos" });
    }
  });

  // Adventure Comments routes
  app.get("/api/adventure-comments/:rpgId", async (req, res) => {
    try {
      const rpgId = parseInt(req.params.rpgId);
      const comments = await storage.getAdventureComments(rpgId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adventure comments" });
    }
  });

  app.post("/api/adventure-comments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertAdventureCommentSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const comment = await storage.createAdventureComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.delete("/api/adventure-comments/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deleteAdventureComment(id);
      
      if (success) {
        res.json({ message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  app.post("/api/adventure-comments/:id/vote", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const commentId = parseInt(req.params.id);
      const { voteType } = req.body;

      if (voteType !== 'up' && voteType !== 'down') {
        return res.status(400).json({ error: "Invalid vote type. Must be 'up' or 'down'" });
      }

      const success = await storage.voteOnComment(commentId, req.user!.id, voteType);
      
      if (success) {
        res.json({ message: "Vote recorded successfully" });
      } else {
        res.status(500).json({ error: "Failed to record vote" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to vote on comment" });
    }
  });

  // Adventure submission route
  app.post("/api/submit-adventure", async (req, res) => {
    try {
      const {
        title,
        description,
        system,
        genre,
        publisher,
        yearPublished,
        theme,
        adventureType,
        submitterName,
        submitterEmail,
        additionalNotes
      } = req.body;

      // Create email content for logging
      const submissionData = {
        title,
        description,
        system,
        genre,
        publisher,
        yearPublished,
        theme,
        adventureType,
        submitterName,
        submitterEmail,
        additionalNotes: additionalNotes || 'None',
        submittedAt: new Date().toISOString()
      };

      // Log the submission to console for now (admin can see in logs)
      console.log('=== NEW RPG ADVENTURE SUBMISSION ===');
      console.log(JSON.stringify(submissionData, null, 2));
      console.log('=== END SUBMISSION ===');

      // Try to send email if credentials are available
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const emailContent = `
New RPG Adventure Submission

Adventure Details:
- Title: ${title}
- Description: ${description}
- RPG System: ${system}
- Genre: ${genre}
- Publisher: ${publisher}
- Year Published: ${yearPublished}
- Theme: ${theme}
- Adventure Type: ${adventureType}
- Additional Notes: ${additionalNotes || 'None'}

Submitter Information:
- Name: ${submitterName}
- Email: ${submitterEmail}

Please review this submission and decide whether to add it to the RPG Vault database.
          `;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'tbiafore@gmail.com',
            subject: `New RPG Adventure Submission: ${title}`,
            text: emailContent,
            replyTo: submitterEmail
          });

          console.log('Email sent successfully to tbiafore@gmail.com');
        } catch (emailError) {
          console.error('Failed to send email, but submission logged:', emailError instanceof Error ? emailError.message : emailError);
        }
      } else {
        console.log('Email credentials not configured. Submission logged to console.');
      }

      res.json({ 
        message: "Adventure submission received! It has been logged for admin review." +
        (process.env.EMAIL_USER ? " An email has been sent to the admin." : " Please check the server logs.")
      });
    } catch (error) {
      console.error('Error processing adventure submission:', error);
      res.status(500).json({ error: "Failed to process adventure submission" });
    }
  });

  // Stats API endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const [rpgCount, reviewCount, userCount, forumPostCount] = await Promise.all([
        storage.getRpgCount(),
        storage.getReviewCount(), 
        storage.getUserCount(),
        storage.getForumPostCount()
      ]);

      res.json({
        rpgCount,
        reviewCount,
        userCount,
        forumPostCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
