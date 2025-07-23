var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adventureComments: () => adventureComments,
  adventureCommentsRelations: () => adventureCommentsRelations,
  adventurePhotos: () => adventurePhotos,
  adventurePhotosRelations: () => adventurePhotosRelations,
  adventureTypeEnum: () => adventureTypeEnum,
  commentVotes: () => commentVotes,
  commentVotesRelations: () => commentVotesRelations,
  forumCategories: () => forumCategories,
  forumCategoriesRelations: () => forumCategoriesRelations,
  forumCategoryTypeEnum: () => forumCategoryTypeEnum,
  forumPosts: () => forumPosts,
  forumPostsRelations: () => forumPostsRelations,
  forumThreads: () => forumThreads,
  forumThreadsRelations: () => forumThreadsRelations,
  insertAdventureCommentSchema: () => insertAdventureCommentSchema,
  insertAdventurePhotoSchema: () => insertAdventurePhotoSchema,
  insertCommentVoteSchema: () => insertCommentVoteSchema,
  insertForumCategorySchema: () => insertForumCategorySchema,
  insertForumPostSchema: () => insertForumPostSchema,
  insertForumThreadSchema: () => insertForumThreadSchema,
  insertPasswordResetTokenSchema: () => insertPasswordResetTokenSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertRpgItemSchema: () => insertRpgItemSchema,
  insertUserSchema: () => insertUserSchema,
  passwordResetTokens: () => passwordResetTokens,
  passwordResetTokensRelations: () => passwordResetTokensRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  rpgGenreEnum: () => rpgGenreEnum,
  rpgItems: () => rpgItems,
  rpgItemsRelations: () => rpgItemsRelations,
  rpgTypeEnum: () => rpgTypeEnum,
  themeEnum: () => themeEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var rpgGenreEnum = pgEnum("rpg_genre", ["fantasy", "sci-fi", "horror", "modern", "historical", "superhero", "other"]);
var rpgTypeEnum = pgEnum("rpg_type", ["core-rules", "adventure", "setting", "supplement", "dice", "accessory"]);
var forumCategoryTypeEnum = pgEnum("forum_category_type", ["general", "reviews", "rules-discussion", "play-reports", "homebrew"]);
var adventureTypeEnum = pgEnum("adventure_type", ["one-shot", "campaign", "module", "anthology", "setting-book"]);
var themeEnum = pgEnum("theme", ["horror", "sci-fi", "fantasy", "mystery", "comedy", "drama", "action", "romance", "thriller"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var rpgItems = pgTable("rpg_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  summary: text("summary"),
  // Short description for adventures
  genre: rpgGenreEnum("genre").notNull(),
  type: rpgTypeEnum("type").notNull(),
  system: varchar("system", { length: 100 }),
  // e.g., "D&D 5e", "Pathfinder", etc.
  publisher: varchar("publisher", { length: 100 }),
  yearPublished: integer("year_published"),
  releaseDate: timestamp("release_date"),
  imageUrl: text("image_url"),
  averageRating: decimal("average_rating", { precision: 4, scale: 2 }).default("0"),
  bayesianRating: decimal("bayesian_rating", { precision: 4, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  rankPosition: integer("rank_position"),
  // Current ranking position
  isFeatured: boolean("is_featured").default(false),
  // Admin can toggle featured status
  // Adventure-specific fields
  adventureType: adventureTypeEnum("adventure_type"),
  theme: themeEnum("theme"),
  createdAt: timestamp("created_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  rating: decimal("rating", { precision: 4, scale: 1 }).notNull(),
  // 1.0-10.0 scale with 1 decimal place
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").defaultNow()
});
var forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: forumCategoryTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  replyCount: integer("reply_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var adventurePhotos = pgTable("adventure_photos", {
  id: serial("id").primaryKey(),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var adventureComments = pgTable("adventure_comments", {
  id: serial("id").primaryKey(),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  userId: integer("user_id").references(() => users.id),
  parentId: integer("parent_id"),
  // for nested replies
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isReported: boolean("is_reported").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var commentVotes = pgTable("comment_votes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => adventureComments.id),
  userId: integer("user_id").references(() => users.id),
  voteType: varchar("vote_type", { length: 10 }).notNull(),
  // 'up' or 'down'
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  forumThreads: many(forumThreads),
  forumPosts: many(forumPosts),
  adventurePhotos: many(adventurePhotos),
  adventureComments: many(adventureComments),
  commentVotes: many(commentVotes),
  passwordResetTokens: many(passwordResetTokens)
}));
var passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id]
  })
}));
var rpgItemsRelations = relations(rpgItems, ({ many }) => ({
  reviews: many(reviews),
  adventurePhotos: many(adventurePhotos),
  adventureComments: many(adventureComments)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  rpgItem: one(rpgItems, {
    fields: [reviews.rpgItemId],
    references: [rpgItems.id]
  })
}));
var forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads)
}));
var forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id]
  }),
  user: one(users, {
    fields: [forumThreads.userId],
    references: [users.id]
  }),
  posts: many(forumPosts)
}));
var forumPostsRelations = relations(forumPosts, ({ one }) => ({
  thread: one(forumThreads, {
    fields: [forumPosts.threadId],
    references: [forumThreads.id]
  }),
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id]
  })
}));
var adventurePhotosRelations = relations(adventurePhotos, ({ one }) => ({
  rpgItem: one(rpgItems, {
    fields: [adventurePhotos.rpgItemId],
    references: [rpgItems.id]
  }),
  user: one(users, {
    fields: [adventurePhotos.userId],
    references: [users.id]
  })
}));
var adventureCommentsRelations = relations(adventureComments, ({ one, many }) => ({
  rpgItem: one(rpgItems, {
    fields: [adventureComments.rpgItemId],
    references: [rpgItems.id]
  }),
  user: one(users, {
    fields: [adventureComments.userId],
    references: [users.id]
  }),
  parent: one(adventureComments, {
    fields: [adventureComments.parentId],
    references: [adventureComments.id],
    relationName: "CommentReplies"
  }),
  replies: many(adventureComments, {
    relationName: "CommentReplies"
  }),
  votes: many(commentVotes)
}));
var commentVotesRelations = relations(commentVotes, ({ one }) => ({
  comment: one(adventureComments, {
    fields: [commentVotes.commentId],
    references: [adventureComments.id]
  }),
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  createdAt: true
});
var insertRpgItemSchema = createInsertSchema(rpgItems).omit({
  id: true,
  averageRating: true,
  reviewCount: true,
  isFeatured: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
}).extend({
  rating: z.number().min(1).max(10)
});
var insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true
});
var insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  isPinned: true,
  isLocked: true,
  replyCount: true,
  lastActivityAt: true,
  createdAt: true
});
var insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true
});
var insertAdventurePhotoSchema = createInsertSchema(adventurePhotos).omit({
  id: true,
  isApproved: true,
  createdAt: true
});
var insertAdventureCommentSchema = createInsertSchema(adventureComments).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isReported: true,
  createdAt: true
});
var insertCommentVoteSchema = createInsertSchema(commentVotes).omit({
  id: true,
  createdAt: true
});
var insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  used: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

// server/bayesian-rating.ts
function calculateBayesianRating(itemRatingCount, itemAverageRating, config) {
  const { globalAverageRating: C, minimumRatingsThreshold: m } = config;
  const v = itemRatingCount;
  const R = itemAverageRating;
  if (v === 0) return C;
  const trueRating = v / (v + m) * R + m / (v + m) * C;
  return Math.round(trueRating * 100) / 100;
}
function getBayesianConfig() {
  return {
    globalAverageRating: 7,
    // Starting assumption - can be calculated dynamically later
    minimumRatingsThreshold: 10
    // Small community starting point
  };
}
async function calculateGlobalAverageRating(getAllReviews) {
  const allReviews = await getAllReviews();
  if (allReviews.length === 0) {
    return 7;
  }
  const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / allReviews.length;
  return Math.round(average * 100) / 100;
}

// server/storage.ts
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserPassword(id, hashedPassword) {
    const [user] = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  async getRpgItems(filters) {
    let query = db.select().from(rpgItems);
    const conditions = [];
    if (filters?.genre) {
      conditions.push(eq(rpgItems.genre, filters.genre));
    }
    if (filters?.type) {
      conditions.push(eq(rpgItems.type, filters.type));
    }
    if (filters?.system) {
      conditions.push(eq(rpgItems.system, filters.system));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(rpgItems.title, `%${filters.search}%`),
          ilike(rpgItems.description, `%${filters.search}%`)
        )
      );
    }
    if (filters?.featured !== void 0) {
      conditions.push(eq(rpgItems.isFeatured, filters.featured));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.orderBy(desc(rpgItems.averageRating));
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  }
  async getRpgItem(id) {
    const [item] = await db.select().from(rpgItems).where(eq(rpgItems.id, id));
    return item || void 0;
  }
  async createRpgItem(item) {
    const [created] = await db.insert(rpgItems).values(item).returning();
    return created;
  }
  async updateRpgItem(id, item) {
    const [updated] = await db.update(rpgItems).set(item).where(eq(rpgItems.id, id)).returning();
    return updated || void 0;
  }
  async deleteRpgItem(id) {
    const result = await db.delete(rpgItems).where(eq(rpgItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async toggleFeatured(id, isFeatured) {
    const [updated] = await db.update(rpgItems).set({ isFeatured }).where(eq(rpgItems.id, id)).returning();
    return updated || void 0;
  }
  async getReviews(rpgItemId) {
    let baseQuery = db.select().from(reviews).innerJoin(users, eq(reviews.userId, users.id)).innerJoin(rpgItems, eq(reviews.rpgItemId, rpgItems.id));
    if (rpgItemId) {
      baseQuery = baseQuery.where(eq(reviews.rpgItemId, rpgItemId));
    }
    const results = await baseQuery.orderBy(desc(reviews.createdAt));
    return results.map((result) => ({
      ...result.reviews,
      rating: parseFloat(result.reviews.rating),
      // Convert string rating back to number
      user: result.users,
      rpgItem: result.rpg_items
    }));
  }
  async createReview(review) {
    const [created] = await db.insert(reviews).values({
      ...review,
      rating: review.rating.toString()
    }).returning();
    return created;
  }
  async updateRpgItemRating(rpgItemId) {
    const result = await db.select({
      averageRating: sql`AVG(${reviews.rating})`,
      count: sql`COUNT(*)`
    }).from(reviews).where(eq(reviews.rpgItemId, rpgItemId));
    const { averageRating, count } = result[0];
    const rawAverage = averageRating ? Number(averageRating) : 0;
    const reviewCount = Number(count);
    const config = getBayesianConfig();
    const bayesianRating = calculateBayesianRating(reviewCount, rawAverage, config);
    console.log(`Updating RPG ${rpgItemId} with avg rating: ${rawAverage.toFixed(2)}, count: ${reviewCount}`);
    await db.update(rpgItems).set({
      averageRating: rawAverage.toFixed(2),
      bayesianRating: bayesianRating.toString(),
      reviewCount
    }).where(eq(rpgItems.id, rpgItemId));
  }
  async getForumCategories() {
    return await db.select().from(forumCategories).orderBy(forumCategories.name);
  }
  async getForumThreads(categoryId) {
    let baseQuery = db.select().from(forumThreads).innerJoin(users, eq(forumThreads.userId, users.id)).innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id));
    if (categoryId) {
      baseQuery = baseQuery.where(eq(forumThreads.categoryId, categoryId));
    }
    const results = await baseQuery.orderBy(desc(forumThreads.lastActivityAt));
    return results.map((result) => ({
      ...result.forum_threads,
      user: result.users,
      category: result.forum_categories
    }));
  }
  async getForumThread(id) {
    const results = await db.select().from(forumThreads).innerJoin(users, eq(forumThreads.userId, users.id)).innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id)).where(eq(forumThreads.id, id));
    const result = results[0];
    if (!result) return void 0;
    return {
      ...result.forum_threads,
      user: result.users,
      category: result.forum_categories
    };
  }
  async createForumThread(thread) {
    const [created] = await db.insert(forumThreads).values(thread).returning();
    return created;
  }
  async getForumPosts(threadId) {
    const results = await db.select().from(forumPosts).innerJoin(users, eq(forumPosts.userId, users.id)).where(eq(forumPosts.threadId, threadId)).orderBy(forumPosts.createdAt);
    return results.map((result) => ({
      ...result.forum_posts,
      user: result.users
    }));
  }
  async createForumPost(post) {
    const [created] = await db.insert(forumPosts).values(post).returning();
    await db.update(forumThreads).set({
      replyCount: sql`${forumThreads.replyCount} + 1`,
      lastActivityAt: /* @__PURE__ */ new Date()
    }).where(eq(forumThreads.id, post.threadId));
    return created;
  }
  async getTopRatedRpgs(genre, limit = 10, offset = 0) {
    let query = db.select().from(rpgItems);
    if (genre) {
      query = query.where(eq(rpgItems.genre, genre));
    }
    return await query.orderBy(desc(rpgItems.bayesianRating)).limit(limit).offset(offset);
  }
  async getTopRatedRpgsCount(genre) {
    let query = db.select({ count: sql`COUNT(*)` }).from(rpgItems);
    if (genre) {
      query = query.where(eq(rpgItems.genre, genre));
    }
    const result = await query;
    return Number(result[0].count);
  }
  async updateGlobalRatingAverage() {
    const getAllReviews = async () => {
      return await db.select({ rating: reviews.rating }).from(reviews);
    };
    const globalAverage = await calculateGlobalAverageRating(getAllReviews);
    console.log(`Updated global average rating: ${globalAverage}`);
    const allItems = await db.select().from(rpgItems);
    for (const item of allItems) {
      await this.updateRpgItemRating(item.id);
    }
  }
  // Adventure Photo methods
  async getAdventurePhotos(rpgItemId) {
    const results = await db.select().from(adventurePhotos).innerJoin(users, eq(adventurePhotos.userId, users.id)).where(and(
      eq(adventurePhotos.rpgItemId, rpgItemId),
      eq(adventurePhotos.isApproved, true)
    )).orderBy(desc(adventurePhotos.createdAt));
    return results.map((result) => ({
      ...result.adventure_photos,
      user: result.users
    }));
  }
  async createAdventurePhoto(photo) {
    const [created] = await db.insert(adventurePhotos).values(photo).returning();
    return created;
  }
  async deleteAdventurePhoto(id) {
    const result = await db.delete(adventurePhotos).where(eq(adventurePhotos.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async approveAdventurePhoto(id) {
    const result = await db.update(adventurePhotos).set({ isApproved: true }).where(eq(adventurePhotos.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getPendingAdventurePhotos() {
    const result = await db.select({
      id: adventurePhotos.id,
      rpgItemId: adventurePhotos.rpgItemId,
      userId: adventurePhotos.userId,
      imageUrl: adventurePhotos.imageUrl,
      caption: adventurePhotos.caption,
      createdAt: adventurePhotos.createdAt,
      adventureTitle: rpgItems.title,
      username: users.username
    }).from(adventurePhotos).innerJoin(rpgItems, eq(adventurePhotos.rpgItemId, rpgItems.id)).innerJoin(users, eq(adventurePhotos.userId, users.id)).where(eq(adventurePhotos.isApproved, false)).orderBy(adventurePhotos.createdAt);
    return result;
  }
  // Adventure Comment methods
  async getAdventureComments(rpgItemId) {
    const results = await db.select().from(adventureComments).innerJoin(users, eq(adventureComments.userId, users.id)).where(eq(adventureComments.rpgItemId, rpgItemId)).orderBy(desc(adventureComments.createdAt));
    const comments = results.map((result) => ({
      ...result.adventure_comments,
      user: result.users
    }));
    const parentComments = comments.filter((c) => !c.parentId);
    const replyMap = /* @__PURE__ */ new Map();
    comments.filter((c) => c.parentId).forEach((reply) => {
      if (!replyMap.has(reply.parentId)) {
        replyMap.set(reply.parentId, []);
      }
      replyMap.get(reply.parentId).push(reply);
    });
    return parentComments.map((parent) => ({
      ...parent,
      replies: replyMap.get(parent.id) || []
    }));
  }
  async createAdventureComment(comment) {
    const [created] = await db.insert(adventureComments).values(comment).returning();
    return created;
  }
  async deleteAdventureComment(id) {
    const result = await db.delete(adventureComments).where(eq(adventureComments.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async voteOnComment(commentId, userId, voteType) {
    try {
      const existingVote = await db.select().from(commentVotes).where(and(
        eq(commentVotes.commentId, commentId),
        eq(commentVotes.userId, userId)
      ));
      if (existingVote.length > 0) {
        await db.update(commentVotes).set({ voteType }).where(and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, userId)
        ));
      } else {
        await db.insert(commentVotes).values({
          commentId,
          userId,
          voteType
        });
      }
      await this.updateCommentVoteCounts(commentId);
      return true;
    } catch (error) {
      console.error("Error voting on comment:", error);
      return false;
    }
  }
  async updateCommentVoteCounts(commentId) {
    const upvoteResult = await db.select({ count: sql`COUNT(*)` }).from(commentVotes).where(and(
      eq(commentVotes.commentId, commentId),
      eq(commentVotes.voteType, "up")
    ));
    const downvoteResult = await db.select({ count: sql`COUNT(*)` }).from(commentVotes).where(and(
      eq(commentVotes.commentId, commentId),
      eq(commentVotes.voteType, "down")
    ));
    const upvotes = Number(upvoteResult[0]?.count || 0);
    const downvotes = Number(downvoteResult[0]?.count || 0);
    await db.update(adventureComments).set({ upvotes, downvotes }).where(eq(adventureComments.id, commentId));
  }
  // Stats methods
  async getRpgCount() {
    const result = await db.select({ count: sql`COUNT(*)` }).from(rpgItems);
    return Number(result[0].count);
  }
  async getReviewCount() {
    const result = await db.select({ count: sql`COUNT(*)` }).from(reviews);
    return Number(result[0].count);
  }
  async getUserCount() {
    const result = await db.select({ count: sql`COUNT(*)` }).from(users);
    return Number(result[0].count);
  }
  async getForumPostCount() {
    const result = await db.select({ count: sql`COUNT(*)` }).from(forumPosts);
    return Number(result[0].count);
  }
  // Password Reset methods
  async createPasswordResetToken(token) {
    const [passwordResetToken] = await db.insert(passwordResetTokens).values(token).returning();
    return passwordResetToken;
  }
  async getPasswordResetToken(token) {
    const [passwordResetToken] = await db.select().from(passwordResetTokens).where(and(
      eq(passwordResetTokens.token, token),
      eq(passwordResetTokens.used, false),
      sql`${passwordResetTokens.expiresAt} > NOW()`
    ));
    return passwordResetToken || void 0;
  }
  async markPasswordResetTokenAsUsed(tokenId) {
    const result = await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, tokenId));
    return (result.rowCount || 0) > 0;
  }
  async cleanupExpiredTokens() {
    await db.delete(passwordResetTokens).where(sql`${passwordResetTokens.expiresAt} < NOW()`);
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/email-service.ts
import { MailService } from "@sendgrid/mail";
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}
var mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);
async function sendEmail(params) {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html
    });
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    if (process.env.NODE_ENV === "development" && params.text?.includes("Click the link below")) {
      const resetLinkMatch = params.text.match(/(http[s]?:\/\/[^\s]+)/);
      if (resetLinkMatch) {
        console.log("\n=== DEVELOPMENT MODE - PASSWORD RESET LINK ===");
        console.log("Since email sending failed, here is your reset link:");
        console.log(resetLinkMatch[0]);
        console.log("Copy and paste this URL in your browser to reset your password.");
        console.log("===============================================\n");
        return true;
      }
    }
    return false;
  }
}
async function sendPasswordResetEmail(userEmail, resetToken, baseUrl) {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  const emailParams = {
    to: userEmail,
    from: "tbiafore@gmail.com",
    // Using the same email domain as SendGrid sender identity
    subject: "Password Reset Request - The RPG Vault",
    text: `
Hello,

You requested to reset your password for The RPG Vault.

Click the link below to reset your password:
${resetLink}

This link will expire in 30 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The RPG Vault Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset - The RPG Vault</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed, #9333ea); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">The RPG Vault</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
    <h2 style="color: #495057; margin-bottom: 20px;">Reset Your Password</h2>
    
    <p style="margin-bottom: 25px; font-size: 16px;">
      Hello! You requested to reset your password for your RPG Vault account.
    </p>
    
    <p style="margin-bottom: 30px;">
      Click the button below to reset your password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
      If the button doesn't work, copy and paste this link into your browser:
      <br>
      <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
      <p style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">
        <strong>Important:</strong> This password reset link will expire in 30 minutes for security reasons.
      </p>
      
      <p style="font-size: 14px; color: #6c757d;">
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
    <p>Best regards,<br>The RPG Vault Team</p>
  </div>
</body>
</html>
    `
  };
  return await sendEmail(emailParams);
}

// server/nodemailer-service.ts
import nodemailer from "nodemailer";
async function sendPasswordResetEmailWithGmail(userEmail, resetToken, baseUrl, gmailUser, gmailPassword) {
  if (!gmailUser || !gmailPassword) {
    console.log("Gmail credentials not provided, skipping Gmail email send");
    return false;
  }
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    });
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: `"The RPG Vault" <${gmailUser}>`,
      to: userEmail,
      subject: "Password Reset Request - The RPG Vault",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset - The RPG Vault</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed, #9333ea); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">The RPG Vault</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
    <h2 style="color: #495057; margin-bottom: 20px;">Reset Your Password</h2>
    
    <p style="margin-bottom: 25px; font-size: 16px;">
      Hello! You requested to reset your password for your RPG Vault account.
    </p>
    
    <p style="margin-bottom: 30px;">
      Click the button below to reset your password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
      If the button doesn't work, copy and paste this link into your browser:
      <br>
      <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
      <p style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">
        <strong>Important:</strong> This password reset link will expire in 30 minutes for security reasons.
      </p>
      
      <p style="font-size: 14px; color: #6c757d;">
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
    <p>Best regards,<br>The RPG Vault Team</p>
  </div>
</body>
</html>
      `,
      text: `
Hello,

You requested to reset your password for The RPG Vault.

Click the link below to reset your password:
${resetLink}

This link will expire in 30 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The RPG Vault Team
      `
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully via Gmail");
    return true;
  } catch (error) {
    console.error("Gmail email error:", error);
    return false;
  }
}

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "rpgvault-secret-key-development-only",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Username, password, and email are required"
        });
      }
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({
          error: "Username already exists",
          details: "Please choose a different username"
        });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          error: "Email already exists",
          details: "An account with this email already exists"
        });
      }
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password)
      });
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
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  app2.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Email required",
          details: "Please provide your email address"
        });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(200).json({
          message: "If an account with that email exists, we've sent a password reset link."
        });
      }
      const resetToken = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1e3);
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt
      });
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      let emailSent = await sendPasswordResetEmail(user.email, resetToken, baseUrl);
      if (!emailSent) {
        console.log("SendGrid failed, trying Gmail fallback...");
        emailSent = await sendPasswordResetEmailWithGmail(
          user.email,
          resetToken,
          baseUrl,
          process.env.GMAIL_USER,
          process.env.GMAIL_PASSWORD
        );
      }
      if (!emailSent) {
        if (process.env.NODE_ENV === "development") {
          const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
          console.log("\n=== DEVELOPMENT MODE - PASSWORD RESET LINK ===");
          console.log("Email sending failed, but here is your reset link:");
          console.log(resetLink);
          console.log("Copy and paste this URL in your browser to reset your password.");
          console.log("===============================================\n");
          return res.status(200).json({
            message: "Password reset link generated. Check server console for the link (development mode)."
          });
        }
        return res.status(500).json({
          error: "Email sending failed",
          details: "Could not send password reset email"
        });
      }
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
  app2.post("/api/reset-password", async (req, res) => {
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
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({
          error: "Invalid or expired token",
          details: "The reset link is invalid or has expired"
        });
      }
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await storage.updateUserPassword(resetToken.userId, hashedPassword);
      if (!updatedUser) {
        return res.status(404).json({
          error: "User not found",
          details: "Associated user account not found"
        });
      }
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
  app2.get("/api/validate-reset-token/:token", async (req, res) => {
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

// server/routes.ts
import { z as z2 } from "zod";
import nodemailer2 from "nodemailer";
function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/rpgs", async (req, res) => {
    try {
      const { genre, type, system, search, limit, offset, featured } = req.query;
      const rpgs = await storage.getRpgItems({
        genre,
        type,
        system,
        search,
        limit: limit ? parseInt(limit) : void 0,
        offset: offset ? parseInt(offset) : void 0,
        featured: featured === "true" ? true : featured === "false" ? false : void 0
      });
      res.json(rpgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RPGs" });
    }
  });
  app2.get("/api/rpgs/:id", async (req, res) => {
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
  app2.post("/api/rpgs", async (req, res) => {
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
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      if (error instanceof Error && error.message.includes("unique_adventure")) {
        return res.status(409).json({
          error: "Duplicate adventure detected",
          message: `An adventure with the title "${req.body.title}" by ${req.body.publisher} (${req.body.yearPublished}) for ${req.body.system} already exists. Please check existing entries before adding new ones.`
        });
      }
      console.error("Failed to create RPG:", error);
      res.status(500).json({ error: "Failed to create RPG" });
    }
  });
  app2.put("/api/rpgs/:id", async (req, res) => {
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
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      if (error instanceof Error && error.message.includes("unique_adventure")) {
        return res.status(409).json({
          error: "Duplicate adventure detected",
          message: `An adventure with the title "${req.body.title}" by ${req.body.publisher} (${req.body.yearPublished}) for ${req.body.system} already exists. Please check existing entries before adding new ones.`
        });
      }
      console.error("Failed to update RPG:", error);
      res.status(500).json({ error: "Failed to update RPG" });
    }
  });
  app2.patch("/api/rpgs/:id/featured", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      const id = parseInt(req.params.id);
      const { isFeatured } = req.body;
      if (typeof isFeatured !== "boolean") {
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
  app2.get("/api/reviews", async (req, res) => {
    try {
      const { rpgId } = req.query;
      const reviews2 = await storage.getReviews(rpgId ? parseInt(rpgId) : void 0);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log("Review submission data:", req.body);
      console.log("User ID:", req.user.id);
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      console.log("Validated data:", validatedData);
      const review = await storage.createReview(validatedData);
      if (validatedData.rpgItemId) {
        await storage.updateRpgItemRating(validatedData.rpgItemId);
      }
      res.status(201).json({
        ...review,
        rating: parseFloat(review.rating)
      });
    } catch (error) {
      console.error("Review creation error:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });
  app2.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum categories" });
    }
  });
  app2.get("/api/forum/threads", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const threads = await storage.getForumThreads(
        categoryId ? parseInt(categoryId) : void 0
      );
      res.json(threads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum threads" });
    }
  });
  app2.get("/api/forum/threads/:id", async (req, res) => {
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
  app2.post("/api/forum/threads", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const validatedData = insertForumThreadSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const thread = await storage.createForumThread(validatedData);
      res.status(201).json(thread);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create thread" });
    }
  });
  app2.get("/api/forum/posts/:threadId", async (req, res) => {
    try {
      const threadId = parseInt(req.params.threadId);
      const posts = await storage.getForumPosts(threadId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });
  app2.post("/api/forum/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });
  app2.get("/api/rankings/overall", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const topRated = await storage.getTopRatedRpgs(void 0, limit, offset);
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
  app2.get("/api/rankings/:genre", async (req, res) => {
    try {
      const { genre } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let mappedGenre;
      if (genre !== "overall") {
        const genreMap = {
          "fantasy": "fantasy",
          "science-fiction": "sci-fi",
          "sci-fi": "sci-fi",
          "horror": "horror",
          "historical": "historical",
          "steampunk-dieselpunk": "sci-fi",
          "science-fantasy": "sci-fi",
          "wuxia-eastern": "fantasy",
          "mythological": "fantasy",
          "comedy-satirical": "fantasy",
          "anthropomorphic": "fantasy",
          "children-family-friendly": "fantasy",
          "superhero": "superhero",
          "modern-urban": "modern",
          "modern": "modern",
          "mystery-investigation": "horror",
          "anime-manga": "fantasy"
        };
        mappedGenre = genreMap[genre] || genre;
      }
      if (genre === "overall") {
        const topRated = await storage.getTopRatedRpgs(void 0, limit, offset);
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
  app2.post("/api/admin/recalculate-ratings", async (req, res) => {
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
  app2.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }
      if (!type || type === "rpgs") {
        const rpgs = await storage.getRpgItems({ search: q, limit: 20 });
        res.json({ rpgs });
      } else {
        res.json({ rpgs: [] });
      }
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });
  app2.get("/api/adventure-photos/:rpgId", async (req, res) => {
    try {
      const rpgId = parseInt(req.params.rpgId);
      const photos = await storage.getAdventurePhotos(rpgId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adventure photos" });
    }
  });
  app2.post("/api/adventure-photos", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const validatedData = insertAdventurePhotoSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const photo = await storage.createAdventurePhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });
  app2.delete("/api/adventure-photos/:id", async (req, res) => {
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
  app2.patch("/api/adventure-photos/:id/approve", async (req, res) => {
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
  app2.get("/api/admin/pending-photos", async (req, res) => {
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
      console.error("Error fetching pending photos:", error);
      res.status(500).json({ error: "Failed to fetch pending photos" });
    }
  });
  app2.get("/api/adventure-comments/:rpgId", async (req, res) => {
    try {
      const rpgId = parseInt(req.params.rpgId);
      const comments = await storage.getAdventureComments(rpgId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adventure comments" });
    }
  });
  app2.post("/api/adventure-comments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const validatedData = insertAdventureCommentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const comment = await storage.createAdventureComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create comment" });
    }
  });
  app2.delete("/api/adventure-comments/:id", async (req, res) => {
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
  app2.post("/api/adventure-comments/:id/vote", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const commentId = parseInt(req.params.id);
      const { voteType } = req.body;
      if (voteType !== "up" && voteType !== "down") {
        return res.status(400).json({ error: "Invalid vote type. Must be 'up' or 'down'" });
      }
      const success = await storage.voteOnComment(commentId, req.user.id, voteType);
      if (success) {
        res.json({ message: "Vote recorded successfully" });
      } else {
        res.status(500).json({ error: "Failed to record vote" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to vote on comment" });
    }
  });
  app2.post("/api/submit-adventure", async (req, res) => {
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
        additionalNotes: additionalNotes || "None",
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("=== NEW RPG ADVENTURE SUBMISSION ===");
      console.log(JSON.stringify(submissionData, null, 2));
      console.log("=== END SUBMISSION ===");
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
- Additional Notes: ${additionalNotes || "None"}

Submitter Information:
- Name: ${submitterName}
- Email: ${submitterEmail}

Please review this submission and decide whether to add it to the RPG Vault database.
          `;
          const transporter = nodemailer2.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "tbiafore@gmail.com",
            subject: `New RPG Adventure Submission: ${title}`,
            text: emailContent,
            replyTo: submitterEmail
          });
          console.log("Email sent successfully to tbiafore@gmail.com");
        } catch (emailError) {
          console.error("Failed to send email, but submission logged:", emailError instanceof Error ? emailError.message : emailError);
        }
      } else {
        console.log("Email credentials not configured. Submission logged to console.");
      }
      res.json({
        message: "Adventure submission received! It has been logged for admin review." + (process.env.EMAIL_USER ? " An email has been sent to the admin." : " Please check the server logs.")
      });
    } catch (error) {
      console.error("Error processing adventure submission:", error);
      res.status(500).json({ error: "Failed to process adventure submission" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
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
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared")
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(process.cwd(), "client/index.html")
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
