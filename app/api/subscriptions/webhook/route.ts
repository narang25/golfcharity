import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/subscriptions/webhook - Handle Stripe webhook events
 * Processes subscription lifecycle events (created, updated, deleted, payment events).
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" , code: 'BAD_REQUEST' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = createAdminClient();

    // Idempotency Check
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('id', event.id)
      .single();

    if (existingEvent) {
      console.log(`Ignored duplicate webhook event: ${event.id}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Mark as processed
    await supabase.from('webhook_events').insert({ id: event.id, type: event.type, created_at: new Date().toISOString() });

    switch (event.type) {
      case "checkout.session.completed":
        // TODO: Provision subscription in database
        break;
      case "customer.subscription.updated":
        // TODO: Update subscription status in database
        break;
      case "customer.subscription.deleted":
        // TODO: Handle cancellation in database
        break;
      case "invoice.payment_succeeded":
        // TODO: Record successful payment
        break;
      case "invoice.payment_failed":
        // TODO: Handle failed payment
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    void supabase; // placeholder reference

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message , code: 'BAD_REQUEST' }, { status: 400 });
  }
}
