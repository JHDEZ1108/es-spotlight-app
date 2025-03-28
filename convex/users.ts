import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()), 
    image: v.string(), 
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
      
    if(existingUser) return;
    
    //create a user in db 
    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio, 
      image: args.image, 
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0
    })
  },
});

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  // Authenticate user; throw if unauthorized
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  // Retrieve the current user by Clerk ID, throw if not found
  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
    
  if(!currentUser) throw new Error("User not found");
  
  return currentUser;
};

export const getUserByClerkId = query({
  args: { clerkId: v.string() },

  handler: async (ctx, args) => {
    // Query the users table using the "by_clerk_id" index
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique(); // Ensure only one user is returned

    return user;
  },
});

// Mutation to update the profile information
export const updateProfile = mutation({
  args: {
    fullname: v.string(),              
    bio: v.optional(v.string()),       
  },
  handler: async (ctx, args) => {
    // Get the currently authenticated user
    const currentUser = await getAuthenticatedUser(ctx);

    // Update user record in the database
    await ctx.db.patch(currentUser._id, {
      fullname: args.fullname,
      bio: args.bio,
    });
  },
});

// Query to fetch a user's profile by their document ID
export const getUserProfile = query({
  args: {
    id: v.id("users"), // Require a valid user document ID as argument
  },
  handler: async (ctx, args) => {
    // Fetch the user from the database
    const user = await ctx.db.get(args.id);

    // Throw error if user does not exist
    if (!user) throw new Error("User not found");

    // Return the user document
    return user;
  },
});

// Query to check if the currently authenticated user is following another user
export const isFollowing = query({
  args: {
    followingId: v.id("users"), // ID of the user to check if being followed
  },
  handler: async (ctx, args) => {
    // Get the currently authenticated user
    const currentUser = await getAuthenticatedUser(ctx);

    // Look for a follow relationship in the "follows" table
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first(); // Return the first match (if any)

    // Return true if a follow record exists, false otherwise
    return !!follow;
  },
});

export const toggleFollow = mutation({
  args: { followingId: v.id("users") }, // ID of the user to follow/unfollow
  handler: async (ctx, args) => {
    // Get the currently authenticated user
    const currentUser = await getAuthenticatedUser(ctx);

    // Check if a follow relationship already exists between the users
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();

    if (existing) {
      // If exists: unfollow
      await ctx.db.delete(existing._id);
      await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
    } else {
      // If not exists: follow
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.followingId,
      });

      // Update follow/follower counters
      await updateFollowCounts(ctx, currentUser._id, args.followingId, true);

      // Create a follow notification for the receiver
      await ctx.db.insert("notifications", {
        receiverId: args.followingId,
        senderId: currentUser._id,
        type: "follow",
      });
    }
  },
});


// Helper function to update follower/following counters
async function updateFollowCounts(
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean // true if following, false if unfollowing
) {
  // Fetch both users from the database
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (follower && following) {
    // Update the follower user's "following" count
    await ctx.db.patch(followerId, {
      following: follower.following + (isFollow ? 1 : -1),
    });

    // Update the following user's "followers" count
    await ctx.db.patch(followingId, {
      followers: following.followers + (isFollow ? 1 : -1),
    });
  }
}


