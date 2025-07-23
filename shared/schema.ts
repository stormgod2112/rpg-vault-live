import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const rpgGenreEnum = pgEnum('rpg_genre', ['fantasy', 'sci-fi', 'horror', 'modern', 'historical', 'superhero', 'other']);
export const rpgTypeEnum = pgEnum('rpg_type', ['core-rules', 'adventure', 'setting', 'supplement', 'dice', 'accessory']);
export const forumCategoryTypeEnum = pgEnum('forum_category_type', ['general', 'reviews', 'rules-discussion', 'play-reports', 'homebrew']);
export const adventureTypeEnum = pgEnum('adventure_type', ['one-shot', 'campaign', 'module', 'anthology', 'setting-book']);
export const themeEnum = pgEnum('theme', ['horror', 'sci-fi', 'fantasy', 'mystery', 'comedy', 'drama', 'action', 'romance', 'thriller']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password Reset Tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// RPG Items table
export const rpgItems = pgTable("rpg_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  summary: text("summary"), // Short description for adventures
  genre: rpgGenreEnum("genre").notNull(),
  type: rpgTypeEnum("type").notNull(),
  system: varchar("system", { length: 100 }), // e.g., "D&D 5e", "Pathfinder", etc.
  publisher: varchar("publisher", { length: 100 }),
  yearPublished: integer("year_published"),
  releaseDate: timestamp("release_date"),
  imageUrl: text("image_url"),
  averageRating: decimal("average_rating", { precision: 4, scale: 2 }).default('0'),
  bayesianRating: decimal("bayesian_rating", { precision: 4, scale: 2 }).default('0'),
  reviewCount: integer("review_count").default(0),
  rankPosition: integer("rank_position"), // Current ranking position
  isFeatured: boolean("is_featured").default(false), // Admin can toggle featured status
  // Adventure-specific fields
  adventureType: adventureTypeEnum("adventure_type"),
  theme: themeEnum("theme"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  rating: decimal("rating", { precision: 4, scale: 1 }).notNull(), // 1.0-10.0 scale with 1 decimal place
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Categories table
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: forumCategoryTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Threads table
export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  replyCount: integer("reply_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum Posts table
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").references(() => forumThreads.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Adventure Photos table (for user-uploaded images)
export const adventurePhotos = pgTable("adventure_photos", {
  id: serial("id").primaryKey(),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Adventure Comments table (separate from forum posts)
export const adventureComments = pgTable("adventure_comments", {
  id: serial("id").primaryKey(),
  rpgItemId: integer("rpg_item_id").references(() => rpgItems.id),
  userId: integer("user_id").references(() => users.id),
  parentId: integer("parent_id"), // for nested replies
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isReported: boolean("is_reported").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comment Votes table (to track user votes on comments)
export const commentVotes = pgTable("comment_votes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => adventureComments.id),
  userId: integer("user_id").references(() => users.id),
  voteType: varchar("vote_type", { length: 10 }).notNull(), // 'up' or 'down'
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  forumThreads: many(forumThreads),
  forumPosts: many(forumPosts),
  adventurePhotos: many(adventurePhotos),
  adventureComments: many(adventureComments),
  commentVotes: many(commentVotes),
  passwordResetTokens: many(passwordResetTokens),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const rpgItemsRelations = relations(rpgItems, ({ many }) => ({
  reviews: many(reviews),
  adventurePhotos: many(adventurePhotos),
  adventureComments: many(adventureComments),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  rpgItem: one(rpgItems, {
    fields: [reviews.rpgItemId],
    references: [rpgItems.id],
  }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  threads: many(forumThreads),
}));

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  user: one(users, {
    fields: [forumThreads.userId],
    references: [users.id],
  }),
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  thread: one(forumThreads, {
    fields: [forumPosts.threadId],
    references: [forumThreads.id],
  }),
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
}));

export const adventurePhotosRelations = relations(adventurePhotos, ({ one }) => ({
  rpgItem: one(rpgItems, {
    fields: [adventurePhotos.rpgItemId],
    references: [rpgItems.id],
  }),
  user: one(users, {
    fields: [adventurePhotos.userId],
    references: [users.id],
  }),
}));

export const adventureCommentsRelations = relations(adventureComments, ({ one, many }) => ({
  rpgItem: one(rpgItems, {
    fields: [adventureComments.rpgItemId],
    references: [rpgItems.id],
  }),
  user: one(users, {
    fields: [adventureComments.userId],
    references: [users.id],
  }),
  parent: one(adventureComments, {
    fields: [adventureComments.parentId],
    references: [adventureComments.id],
    relationName: "CommentReplies"
  }),
  replies: many(adventureComments, {
    relationName: "CommentReplies"
  }),
  votes: many(commentVotes),
}));

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  comment: one(adventureComments, {
    fields: [commentVotes.commentId],
    references: [adventureComments.id],
  }),
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  createdAt: true,
});

export const insertRpgItemSchema = createInsertSchema(rpgItems).omit({
  id: true,
  averageRating: true,
  reviewCount: true,
  isFeatured: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(10),
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
});

export const insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  isPinned: true,
  isLocked: true,
  replyCount: true,
  lastActivityAt: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
});

export const insertAdventurePhotoSchema = createInsertSchema(adventurePhotos).omit({
  id: true,
  isApproved: true,
  createdAt: true,
});

export const insertAdventureCommentSchema = createInsertSchema(adventureComments).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  isReported: true,
  createdAt: true,
});

export const insertCommentVoteSchema = createInsertSchema(commentVotes).omit({
  id: true,
  createdAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  used: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRpgItem = z.infer<typeof insertRpgItemSchema>;
export type RpgItem = typeof rpgItems.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertAdventurePhoto = z.infer<typeof insertAdventurePhotoSchema>;
export type AdventurePhoto = typeof adventurePhotos.$inferSelect;
export type InsertAdventureComment = z.infer<typeof insertAdventureCommentSchema>;
export type AdventureComment = typeof adventureComments.$inferSelect;
export type InsertCommentVote = z.infer<typeof insertCommentVoteSchema>;
export type CommentVote = typeof commentVotes.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
