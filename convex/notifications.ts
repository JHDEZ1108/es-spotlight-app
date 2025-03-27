import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

// Fetch notifications for the currently authenticated user
export const getNotifications = query({
  handler: async (ctx) => {
    // Ensure user is authenticated
    const currentUser = await getAuthenticatedUser(ctx);
    
    // Get all notifications where the user is the receiver
    const notifications = await ctx.db.query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .order("desc") // Most recent first
      .collect();

    // Enhance each notification with sender and related post/comment data
    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        // Get sender info
        const sender = (await ctx.db.get(notification.senderId))!;

        let post = null;
        let comment = null;

        // If the notification has a postId, fetch the post
        if (notification.postId) {
          post = await ctx.db.get(notification.postId);
        }

        // If it's a comment notification, fetch comment content
        if (notification.type === "comment" && notification.commentId) {
          comment = await ctx.db.get(notification.commentId);
        }

        // Return the enriched notification object
        return {
          ...notification,
          sender: {
            _id: sender._id,
            username: sender.username,
            image: sender.image,
          },
          post,
          comment: comment?.content, // Only return comment text
        };
      })
    );
    
    return notificationsWithInfo;
  }
});
