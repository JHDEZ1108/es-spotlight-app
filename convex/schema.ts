import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define user attributes and index by clerkId for quick lookup
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()), 
    image: v.string(), 
    followers: v.number(), 
    following: v.number(),
    posts: v.number(),
    clerkId: v.string(), 
  }).index("by_clerk_id", ["clerkId"]),
  
  // Store posts made by users with optional captions
  posts: defineTable({
    userId: v.id("users"), 
    imageUrl: v.string(),
    storageId: v.id("_storage"), // Reference for deletion purposes
    caption: v.optional(v.string()), 
    likes: v.number(), 
    comments: v.number(), 
  }).index("by_user", ["userId"]),
  
  // Track likes with compound index for efficient queries
  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  }).index("by_post", ["postId"]).index("by_user_and_post", ["userId", "postId"]),
  
  // Comments table with indexing by postId for easy retrieval
  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(), 
  }).index("by_post", ["postId"]),
  
  // Relationships table for followers using multiple indexes
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"), 
  }).index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),
  
  // Notifications table to alert users of interactions
  notifications: defineTable({
    receiverId: v.id("users"), 
    senderId: v.id("users"),
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")), // Type of notification
    postId: v.optional(v.id("posts")), 
    commentId: v.optional(v.id("comments")), 
  }).index("by_receiver", ["receiverId"])
    .index("by_post", ["postId"]),

  
  // Bookmarks table to save posts with multi-field indexing
  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"), 
  }).index("by_user", ["userId"])
    .index("by_post", ["postId"])
    .index("by_user_and_post", ["userId", "postId"]),
  
});
