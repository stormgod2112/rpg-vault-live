import { db } from "./db";
import { forumCategories } from "../shared/schema";
import { sql } from "drizzle-orm";

async function seedForumCategories() {
  console.log("Seeding forum categories...");

  const categories = [
    {
      name: "General Discussion",
      description: "Talk about anything RPG-related",
      type: "general" as const,
    },
    {
      name: "Game Reviews & Recommendations",
      description: "Share your thoughts on RPGs and recommend games to others",
      type: "reviews" as const,
    },
    {
      name: "Rules Questions & Interpretations",
      description: "Get help with game rules and mechanics",
      type: "rules-discussion" as const,
    },
    {
      name: "Play Reports & Campaign Stories",
      description: "Share stories from your gaming sessions and campaigns",
      type: "play-reports" as const,
    },
    {
      name: "Homebrew & House Rules",
      description: "Share and discuss custom content and house rules",
      type: "homebrew" as const,
    },
  ];

  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(forumCategories);
    if (existingCategories.length > 0) {
      console.log("Forum categories already exist. Skipping seed.");
      return;
    }

    // Insert categories
    for (const category of categories) {
      await db.insert(forumCategories).values(category);
    }

    console.log(`Successfully seeded ${categories.length} forum categories`);
  } catch (error) {
    console.error("Error seeding forum categories:", error);
    throw error;
  }
}

// Allow this script to be run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedForumCategories()
    .then(() => {
      console.log("Forum categories seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Forum categories seeding failed:", error);
      process.exit(1);
    });
}

export { seedForumCategories };