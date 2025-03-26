import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

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
      // Authenticate user
      const currentUser = await getAuthenticatedUser(ctx);

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

export const getFeedPost = query({
  handler: async(ctx) => {
    // Authenticate the user and get user data to ensure the user is authorized.
    const currentUser = await getAuthenticatedUser(ctx);
    
    // Fetch all posts from the database and order them in descending order.
    const posts = await ctx.db.query("posts").order("desc").collect();
    
    // Return an empty array if no posts are found.
    if (posts.length === 0) return [];
    
    // Enhance each post with author data and user interaction status (likes and bookmarks).
    const postsWithInfo = await Promise.all(
      posts.map(async(post) => {
        // Retrieve author's data based on user ID associated with each post.
        const postAuthor = (await ctx.db.get(post.userId))!;

        // Check if the current user has liked the post.
        const like = await ctx.db.query("likes")
          .withIndex("by_user_and_post", 
          (q) => q.eq("userId", currentUser._id).eq("postId", post._id)).first();
        
        // Check if the current user has bookmarked the post.
        const bookmark = await ctx.db.query("bookmarks")
          .withIndex("by_user_and_post", 
          (q) => q.eq("userId", currentUser._id).eq("postId", post._id)).first();
        
        // Return the enhanced post object, including author info and interaction flags.
        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image
          },
          isLiked: !!like, // Convert truthy or falsy value to boolean.
          isBookmarked: !!bookmark // Convert truthy or falsy value to boolean.
        }
      })
    );
    
    // Return the list of enhanced posts.
    return postsWithInfo;
  }
});