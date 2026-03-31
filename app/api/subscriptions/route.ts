import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

/**
 * GET /api/subscriptions - Get current user's subscription status
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    // TODO: Query subscription from database
    return NextResponse.json({ subscription: null }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions - Create a Stripe Checkout session for a new subscription
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { priceId } = await request.json();

    // TODO: Create or retrieve Stripe customer, create checkout session
    void stripe; // placeholder reference
    void priceId;

    return NextResponse.json(
      { message: "Checkout session creation not yet implemented" },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
