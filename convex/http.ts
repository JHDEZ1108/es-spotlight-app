import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';

const http = httpRouter();

// Define route for handling Clerk webhook POST requests
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Ensure the webhook secret is available
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("missing CLERK_WEBHOOK_SECRET environment variable");
    }

    // Verify presence of necessary headers for Svix webhook
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no Svix headers", { status: 400 });
    }

    // Parse and prepare the request payload for verification
    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    let evt: any;

    // Attempt to verify the webhook signature
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (error) {
      console.error("Error verifying webhook", error);
      return new Response("Error occurred", { status: 400 });
    }

    // Handle specific event types; in this case, user creation
    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0].email_address;
      
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      // Create a user record in response to the webhook
      try {
        await ctx.runMutation(api.users.createUser, {
          email: email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0], // Extract username from email
        });
      } catch (error) {
        console.error("Error creating user: ", error);
        return new Response("Error occurred", { status: 500 });
      }
    }

    // Return success response if the webhook is processed without errors
    return new Response("Webhook processed successfully", { status: 200 });
  })
})

export default http;