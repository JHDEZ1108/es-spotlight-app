import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Generates a secure upload URL for client-side uploads
export const generateUploadUrl = mutation(async (ctx) => {
    // Authenticate user; throw if unauthorized
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Return a new upload URL from the storage API
    return await ctx.storage.generateUploadUrl();
});

// Creates a new post in the database
export const createPost = mutation({
    args: {
        caption: v.optional(v.string()), // Optional text for the post
        storageId: v.id("_storage"),    // Reference ID for uploaded image
    },
    handler: async (ctx, args) => {
      // Authenticate user; throw if unauthorized
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");

      // Retrieve the current user by Clerk ID, throw if not found
      const currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();
        
      if(!currentUser) throw new Error("User not found");

      // Retrieve the URL for the stored image, throw if not available
      const imageUrl = await ctx.storage.getUrl(args.storageId);
      if(!imageUrl) throw new Error("Image not found");

      // Insert the new post into the database
      const postId = await ctx.db.insert("posts", {
        userId: currentUser._id,
        imageUrl,
        storageId: args.storageId,
        caption: args.caption,
        likes: 0,
        comments: 0
      });

      // Increment the user's post count after successful post creation
      await ctx.db.patch(currentUser._id, {
        posts: currentUser.posts + 1
      });

      // Return the ID of the newly created post
      return postId;
    }
});

