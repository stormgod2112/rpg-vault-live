import { storage } from "./storage";
import { db } from "./db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function setupAdmin() {
  console.log("Setting up user accounts...");
  
  const adminPassword = "admin123"; // Simple test password
  const userPassword = "password123"; // Simple user password
  
  const hashedAdminPassword = await hashPassword(adminPassword);
  const hashedUserPassword = await hashPassword(userPassword);
  
  try {
    // Update existing ThorB admin account
    const existingAdmin = await storage.getUserByUsername("ThorB");
    if (existingAdmin) {
      await storage.updateUserPassword(existingAdmin.id, hashedAdminPassword);
      console.log("✅ Updated admin password for user 'ThorB'");
      console.log("  Username: ThorB");
      console.log("  Password: admin123");
    }

    // Update existing Stormgod user account  
    const existingUser = await storage.getUserByUsername("Stormgod");
    if (existingUser) {
      await storage.updateUserPassword(existingUser.id, hashedUserPassword);
      console.log("✅ Updated password for user 'Stormgod'");
      console.log("  Username: Stormgod");
      console.log("  Email: tbiafore@hotmail.com");
      console.log("  Password: password123");
    }

    if (!existingAdmin && !existingUser) {
      // Create new admin user if none exists
      const [adminUser] = await db
        .insert(users)
        .values({
          username: "admin",
          email: "admin@rpgvault.dev",
          password: hashedAdminPassword,
          isAdmin: true
        })
        .returning();
      console.log("✅ Created new admin user");
      console.log("  Username: admin");
      console.log("  Password: admin123");
    }
  } catch (error) {
    console.error("❌ Error setting up accounts:", error);
  }
}

// Run the setup when this file is executed directly
setupAdmin().then(() => {
  console.log("Admin setup complete!");
  process.exit(0);
}).catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});