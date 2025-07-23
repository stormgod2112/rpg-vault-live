import { users, rpgItems, reviews, forumCategories, forumThreads, forumPosts, adventurePhotos, adventureComments, commentVotes, passwordResetTokens } from "../shared/schema";
import type { 
  User, InsertUser, 
  RpgItem, InsertRpgItem,
  Review, InsertReview,
  ForumCategory, InsertForumCategory,
  ForumThread, InsertForumThread,
  ForumPost, InsertForumPost,
  AdventurePhoto, InsertAdventurePhoto,
  AdventureComment, InsertAdventureComment,
  CommentVote, InsertCommentVote,
  PasswordResetToken, InsertPasswordResetToken
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { calculateBayesianRating, getBayesianConfig, calculateGlobalAverageRating } from "./bayesian-rating";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined>;

  // Password Reset methods
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenAsUsed(tokenId: number): Promise<boolean>;
  cleanupExpiredTokens(): Promise<void>;

  // RPG Item methods
  getRpgItems(filters?: {
    genre?: string;
    type?: string;
    system?: string;
    search?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
  }): Promise<RpgItem[]>;
  getRpgItem(id: number): Promise<RpgItem | undefined>;
  createRpgItem(item: InsertRpgItem): Promise<RpgItem>;
  updateRpgItem(id: number, item: Partial<InsertRpgItem>): Promise<RpgItem | undefined>;
  deleteRpgItem(id: number): Promise<boolean>;
  toggleFeatured(id: number, isFeatured: boolean): Promise<RpgItem | undefined>;

  // Review methods
  getReviews(rpgItemId?: number): Promise<(Review & { user: User; rpgItem: RpgItem })[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateRpgItemRating(rpgItemId: number): Promise<void>;

  // Forum methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumThreads(categoryId?: number): Promise<(ForumThread & { user: User; category: ForumCategory })[]>;
  getForumThread(id: number): Promise<(ForumThread & { user: User; category: ForumCategory }) | undefined>;
  createForumThread(thread: InsertForumThread): Promise<ForumThread>;
  getForumPosts(threadId: number): Promise<(ForumPost & { user: User })[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;

  // Rankings methods
  getTopRatedRpgs(genre?: string, limit?: number, offset?: number): Promise<RpgItem[]>;
  getTopRatedRpgsCount(genre?: string): Promise<number>;
  updateGlobalRatingAverage(): Promise<void>;

  // Adventure Photo methods
  getAdventurePhotos(rpgItemId: number): Promise<(AdventurePhoto & { user: User })[]>;
  createAdventurePhoto(photo: InsertAdventurePhoto): Promise<AdventurePhoto>;
  deleteAdventurePhoto(id: number): Promise<boolean>;
  approveAdventurePhoto(id: number): Promise<boolean>;

  // Adventure Comment methods
  getAdventureComments(rpgItemId: number): Promise<(AdventureComment & { user: User; replies?: AdventureComment[] })[]>;
  createAdventureComment(comment: InsertAdventureComment): Promise<AdventureComment>;
  deleteAdventureComment(id: number): Promise<boolean>;
  voteOnComment(commentId: number, userId: number, voteType: 'up' | 'down'): Promise<boolean>;
  updateCommentVoteCounts(commentId: number): Promise<void>;

  // Stats methods
  getRpgCount(): Promise<number>;
  getReviewCount(): Promise<number>;
  getUserCount(): Promise<number>;
  getForumPostCount(): Promise<number>;

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getRpgItems(filters?: {
    genre?: string;
    type?: string;
    system?: string;
    search?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
  }): Promise<RpgItem[]> {
    let query = db.select().from(rpgItems);
    
    const conditions = [];
    if (filters?.genre) {
      conditions.push(eq(rpgItems.genre, filters.genre as any));
    }
    if (filters?.type) {
      conditions.push(eq(rpgItems.type, filters.type as any));
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
    if (filters?.featured !== undefined) {
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

  async getRpgItem(id: number): Promise<RpgItem | undefined> {
    const [item] = await db.select().from(rpgItems).where(eq(rpgItems.id, id));
    return item || undefined;
  }

  async createRpgItem(item: InsertRpgItem): Promise<RpgItem> {
    const [created] = await db
      .insert(rpgItems)
      .values(item)
      .returning();
    return created;
  }

  async updateRpgItem(id: number, item: Partial<InsertRpgItem>): Promise<RpgItem | undefined> {
    const [updated] = await db
      .update(rpgItems)
      .set(item)
      .where(eq(rpgItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRpgItem(id: number): Promise<boolean> {
    const result = await db.delete(rpgItems).where(eq(rpgItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async toggleFeatured(id: number, isFeatured: boolean): Promise<RpgItem | undefined> {
    const [updated] = await db
      .update(rpgItems)
      .set({ isFeatured })
      .where(eq(rpgItems.id, id))
      .returning();
    return updated || undefined;
  }

  async getReviews(rpgItemId?: number): Promise<(Review & { user: User; rpgItem: RpgItem })[]> {
    let baseQuery = db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(rpgItems, eq(reviews.rpgItemId, rpgItems.id));

    if (rpgItemId) {
      baseQuery = baseQuery.where(eq(reviews.rpgItemId, rpgItemId));
    }

    const results = await baseQuery.orderBy(desc(reviews.createdAt));
    
    return results.map(result => ({
      ...result.reviews,
      rating: parseFloat(result.reviews.rating), // Convert string rating back to number
      user: result.users,
      rpgItem: result.rpg_items,
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db
      .insert(reviews)
      .values({
        ...review,
        rating: review.rating.toString()
      })
      .returning();
    
    return created;
  }

  async updateRpgItemRating(rpgItemId: number): Promise<void> {
    const result = await db
      .select({
        averageRating: sql`AVG(${reviews.rating})`,
        count: sql`COUNT(*)`
      })
      .from(reviews)
      .where(eq(reviews.rpgItemId, rpgItemId));

    const { averageRating, count } = result[0];
    const rawAverage = averageRating ? Number(averageRating) : 0;
    const reviewCount = Number(count);
    
    // Calculate Bayesian rating
    const config = getBayesianConfig();
    const bayesianRating = calculateBayesianRating(reviewCount, rawAverage, config);
    
    console.log(`Updating RPG ${rpgItemId} with avg rating: ${rawAverage.toFixed(2)}, count: ${reviewCount}`);
    
    await db
      .update(rpgItems)
      .set({
        averageRating: rawAverage.toFixed(2),
        bayesianRating: bayesianRating.toString(),
        reviewCount: reviewCount
      })
      .where(eq(rpgItems.id, rpgItemId));
  }

  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(forumCategories.name);
  }

  async getForumThreads(categoryId?: number): Promise<(ForumThread & { user: User; category: ForumCategory })[]> {
    let baseQuery = db
      .select()
      .from(forumThreads)
      .innerJoin(users, eq(forumThreads.userId, users.id))
      .innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id));

    if (categoryId) {
      baseQuery = baseQuery.where(eq(forumThreads.categoryId, categoryId));
    }

    const results = await baseQuery.orderBy(desc(forumThreads.lastActivityAt));
    
    return results.map(result => ({
      ...result.forum_threads,
      user: result.users,
      category: result.forum_categories,
    }));
  }

  async getForumThread(id: number): Promise<(ForumThread & { user: User; category: ForumCategory }) | undefined> {
    const results = await db
      .select()
      .from(forumThreads)
      .innerJoin(users, eq(forumThreads.userId, users.id))
      .innerJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
      .where(eq(forumThreads.id, id));

    const result = results[0];
    if (!result) return undefined;

    return {
      ...result.forum_threads,
      user: result.users,
      category: result.forum_categories,
    };
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    const [created] = await db
      .insert(forumThreads)
      .values(thread)
      .returning();
    return created;
  }

  async getForumPosts(threadId: number): Promise<(ForumPost & { user: User })[]> {
    const results = await db
      .select()
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.threadId, threadId))
      .orderBy(forumPosts.createdAt);

    return results.map(result => ({
      ...result.forum_posts,
      user: result.users,
    }));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [created] = await db
      .insert(forumPosts)
      .values(post)
      .returning();

    // Update thread reply count and last activity
    await db
      .update(forumThreads)
      .set({
        replyCount: sql`${forumThreads.replyCount} + 1`,
        lastActivityAt: new Date(),
      })
      .where(eq(forumThreads.id, post.threadId!));

    return created;
  }

  async getTopRatedRpgs(genre?: string, limit: number = 10, offset: number = 0): Promise<RpgItem[]> {
    let query = db.select().from(rpgItems);

    if (genre) {
      query = query.where(eq(rpgItems.genre, genre as any));
    }

    return await query
      .orderBy(desc(rpgItems.bayesianRating))
      .limit(limit)
      .offset(offset);
  }

  async getTopRatedRpgsCount(genre?: string): Promise<number> {
    let query = db.select({ count: sql<number>`COUNT(*)` }).from(rpgItems);

    if (genre) {
      query = query.where(eq(rpgItems.genre, genre as any));
    }

    const result = await query;
    return Number(result[0].count);
  }

  async updateGlobalRatingAverage(): Promise<void> {
    // Get all reviews to calculate global average
    const getAllReviews = async () => {
      return await db.select({ rating: reviews.rating }).from(reviews);
    };
    
    const globalAverage = await calculateGlobalAverageRating(getAllReviews);
    console.log(`Updated global average rating: ${globalAverage}`);
    
    // Recalculate all Bayesian ratings with new global average
    const allItems = await db.select().from(rpgItems);
    
    for (const item of allItems) {
      await this.updateRpgItemRating(item.id);
    }
  }

  // Adventure Photo methods
  async getAdventurePhotos(rpgItemId: number): Promise<(AdventurePhoto & { user: User })[]> {
    const results = await db
      .select()
      .from(adventurePhotos)
      .innerJoin(users, eq(adventurePhotos.userId, users.id))
      .where(and(
        eq(adventurePhotos.rpgItemId, rpgItemId),
        eq(adventurePhotos.isApproved, true)
      ))
      .orderBy(desc(adventurePhotos.createdAt));

    return results.map(result => ({
      ...result.adventure_photos,
      user: result.users,
    }));
  }

  async createAdventurePhoto(photo: InsertAdventurePhoto): Promise<AdventurePhoto> {
    const [created] = await db
      .insert(adventurePhotos)
      .values(photo)
      .returning();
    return created;
  }

  async deleteAdventurePhoto(id: number): Promise<boolean> {
    const result = await db.delete(adventurePhotos).where(eq(adventurePhotos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async approveAdventurePhoto(id: number): Promise<boolean> {
    const result = await db
      .update(adventurePhotos)
      .set({ isApproved: true })
      .where(eq(adventurePhotos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getPendingAdventurePhotos(): Promise<any[]> {
    const result = await db
      .select({
        id: adventurePhotos.id,
        rpgItemId: adventurePhotos.rpgItemId,
        userId: adventurePhotos.userId,
        imageUrl: adventurePhotos.imageUrl,
        caption: adventurePhotos.caption,
        createdAt: adventurePhotos.createdAt,
        adventureTitle: rpgItems.title,
        username: users.username,
      })
      .from(adventurePhotos)
      .innerJoin(rpgItems, eq(adventurePhotos.rpgItemId, rpgItems.id))
      .innerJoin(users, eq(adventurePhotos.userId, users.id))
      .where(eq(adventurePhotos.isApproved, false))
      .orderBy(adventurePhotos.createdAt);
    
    return result;
  }

  // Adventure Comment methods
  async getAdventureComments(rpgItemId: number): Promise<(AdventureComment & { user: User; replies?: AdventureComment[] })[]> {
    // Get all comments for the RPG item
    const results = await db
      .select()
      .from(adventureComments)
      .innerJoin(users, eq(adventureComments.userId, users.id))
      .where(eq(adventureComments.rpgItemId, rpgItemId))
      .orderBy(desc(adventureComments.createdAt));

    const comments = results.map(result => ({
      ...result.adventure_comments,
      user: result.users,
    }));

    // Organize into parent comments with their replies
    const parentComments = comments.filter(c => !c.parentId);
    const replyMap = new Map<number, AdventureComment[]>();

    // Group replies by parent ID
    comments.filter(c => c.parentId).forEach(reply => {
      if (!replyMap.has(reply.parentId!)) {
        replyMap.set(reply.parentId!, []);
      }
      replyMap.get(reply.parentId!)!.push(reply);
    });

    // Add replies to parent comments
    return parentComments.map(parent => ({
      ...parent,
      replies: replyMap.get(parent.id) || []
    }));
  }

  async createAdventureComment(comment: InsertAdventureComment): Promise<AdventureComment> {
    const [created] = await db
      .insert(adventureComments)
      .values(comment)
      .returning();
    return created;
  }

  async deleteAdventureComment(id: number): Promise<boolean> {
    const result = await db.delete(adventureComments).where(eq(adventureComments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async voteOnComment(commentId: number, userId: number, voteType: 'up' | 'down'): Promise<boolean> {
    try {
      // Check if user already voted on this comment
      const existingVote = await db
        .select()
        .from(commentVotes)
        .where(and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, userId)
        ));

      if (existingVote.length > 0) {
        // Update existing vote
        await db
          .update(commentVotes)
          .set({ voteType })
          .where(and(
            eq(commentVotes.commentId, commentId),
            eq(commentVotes.userId, userId)
          ));
      } else {
        // Create new vote
        await db
          .insert(commentVotes)
          .values({
            commentId,
            userId,
            voteType,
          });
      }

      // Update comment vote counts
      await this.updateCommentVoteCounts(commentId);
      return true;
    } catch (error) {
      console.error('Error voting on comment:', error);
      return false;
    }
  }

  async updateCommentVoteCounts(commentId: number): Promise<void> {
    // Count up and down votes
    const upvoteResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(commentVotes)
      .where(and(
        eq(commentVotes.commentId, commentId),
        eq(commentVotes.voteType, 'up')
      ));

    const downvoteResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(commentVotes)
      .where(and(
        eq(commentVotes.commentId, commentId),
        eq(commentVotes.voteType, 'down')
      ));

    const upvotes = Number(upvoteResult[0]?.count || 0);
    const downvotes = Number(downvoteResult[0]?.count || 0);

    // Update comment with new counts
    await db
      .update(adventureComments)
      .set({ upvotes, downvotes })
      .where(eq(adventureComments.id, commentId));
  }

  // Stats methods
  async getRpgCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(rpgItems);
    return Number(result[0].count);
  }

  async getReviewCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews);
    return Number(result[0].count);
  }

  async getUserCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users);
    return Number(result[0].count);
  }

  async getForumPostCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(forumPosts);
    return Number(result[0].count);
  }

  // Password Reset methods
  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [passwordResetToken] = await db.insert(passwordResetTokens).values(token).returning();
    return passwordResetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        sql`${passwordResetTokens.expiresAt} > NOW()`
      ));
    return passwordResetToken || undefined;
  }

  async markPasswordResetTokenAsUsed(tokenId: number): Promise<boolean> {
    const result = await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
    return (result.rowCount || 0) > 0;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(sql`${passwordResetTokens.expiresAt} < NOW()`);
  }
}

export const storage = new DatabaseStorage();
