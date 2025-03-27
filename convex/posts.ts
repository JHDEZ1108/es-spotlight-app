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

// Get post in the database
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

//Handle likes on the posts
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existing) {
      // remove like
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, { likes: post.likes -1 })
      return false; // unliked
    } else {
      // add like
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      })
      await ctx.db.patch(args.postId, { likes: post.likes +1 })
      
      //if it's not my post create a notification
      if(currentUser._id !== post.userId){
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId
        });
      }
      
      return true //liked
    } 
  },
});


export const deletePost = mutation({
  args: { postId: v.id("posts") },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // Fetch the post to verify it exists
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Verify the user owns the post
    if (post.userId !== currentUser._id)
      throw new Error("Not authorized to delete this post");

    // Delete all likes associated with this post
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    
    // Delete associated comments
    const comments = await ctx.db 
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    
    // Delete associated comments
    const bookmarks = await ctx.db 
    .query("bookmarks")
    .withIndex("by_post", (q) => q.eq("postId", args.postId))
    .collect();
  
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }
    
    //Delete Notifications
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect()
    
    for(const notification of notifications){
      await ctx.db.delete(notification._id)
    }
    
    // Delete the storage file
    await ctx.storage.delete(post.storageId);
    
    // Delete the post
    await ctx.db.delete(args.postId);
    
    // Decrement user's post count by 1
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) -1),
    });
  },
});

