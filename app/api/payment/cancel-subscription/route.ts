import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });

    // Instantly invalidate recurring privileges (MOCK behaviour)
    // TODO: When using Stripe, you actually call `stripe.subscriptions.update(id, {cancel_at_period_end: true})`
    const { error } = await supabase
      .from("users")
      .update({ subscription_status: 'cancelled' })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription cancelled successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
