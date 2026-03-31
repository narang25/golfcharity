import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * Use this for creating checkout sessions, managing subscriptions,
 * verifying webhooks, etc.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_fallback_key", {
  apiVersion: "2026-03-25.dahlia" as any,
  typescript: true,
});
