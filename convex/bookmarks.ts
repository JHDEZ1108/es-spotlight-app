import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

// Toggle bookmark status for a post
export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },

  handler: async (ctx, args) => {
    // Get the currently authenticated user
    const currentUser = await getAuthenticatedUser(ctx);

    // Check if the bookmark already exists
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      // If it exists, remove the bookmark
      await ctx.db.delete(existing._id);
      return false;
    } else {
      // If not, create a new bookmark
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId: args.postId,
      });
      return true;
    }
  },
});

// Get Bookmarked Post with all info
export const getBookmarkedPosts = query({
  handler: async (ctx) => {
    // Get the currently authenticated user
    const currentUser = await getAuthenticatedUser(ctx);

    // Get all bookmarks for the current user (most recent first)
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();

    // Fetch full post data for each bookmark
    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);
        return post;
      })
    );

    return bookmarksWithInfo;
  },
});
