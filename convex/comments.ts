import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

// Add a new comment to a post
export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts")
  },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found");

    // Insert the comment into the "comments" table
    const commentId = await ctx.db.insert("comments", {
      userId: currentUser?._id,
      postId: args.postId,
      content: args.content,
    });
    
    // Increment comment count on the post
    await ctx.db.patch(args.postId, { comments: post.comments + 1 });
    
    // Create a notification if the comment is not on the user's own post
    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });
    }
  }
});

// Fetch all comments for a given post, with user info
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // Get all comments using the by_post index
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Attach author info to each comment
    const commentsWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            fullname: user!.fullname,
            image: user!.image,
          },
        };
      })
    );

    return commentsWithInfo;
  },
});
