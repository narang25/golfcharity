/**
 * MOCK PAYMENT MODULE
 * 
 * // TODO: Replace with real Stripe SDK imports when API keys are active.
 * // import Stripe from "stripe";
 * // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
 */

export interface MockCheckoutSession {
  url: string;
  session_id: string;
  plan_id: string;
  user_id: string;
}

/**
 * // TODO: Replace with real Stripe checkout session creation.
 * // Uses stripe.checkout.sessions.create({ line_items: [...], success_url, ... })
 */
export async function createMockCheckoutSession(planId: string, userId: string): Promise<MockCheckoutSession> {
  const mockSessionId = `mock_cs_${crypto.randomUUID()}`;
  
  // In a real flow, this would be a Stripe hosted URL.
  // We simulate it by generating a stub object that our frontend will use immediately.
  return {
    url: `/subscription/success?session_id=${mockSessionId}`,
    session_id: mockSessionId,
    plan_id: planId,
    user_id: userId,
  };
}

/**
 * // TODO: Replace with real Stripe webhook processing script.
 * // Uses stripe.webhooks.constructEvent(payload, signature, secret) logic to trust requests.
 */
export async function simulateMockWebhookEvent(eventType: string, sessionId: string) {
  // We log this purely for debugging context in development mode.
  console.log(`[MOCK WEBHOOK STUB] Triggered ${eventType} for session ${sessionId}`);
  return { received: true };
}
