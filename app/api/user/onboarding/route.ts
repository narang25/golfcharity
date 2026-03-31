import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });

    const { charityId, contributionPercent } = await req.json();

    if (!charityId) {
      return NextResponse.json({ error: "Charity selection required" , code: 'BAD_REQUEST' }, { status: 400 });
    }

    const percent = Number(contributionPercent);
    if (isNaN(percent) || percent < 10 || percent > 100) {
      return NextResponse.json({ error: "Contribution must be between 10% and 100%" , code: 'BAD_REQUEST' }, { status: 400 });
    }

    const { error } = await supabase
      .from("users")
      .update({
        charity_id: charityId,
        charity_contribution_percent: percent,
        onboarding_completed: true
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    // --- MOCK INTEGRATION SPOOF ---
    // Normally, the Stripe webhook `invoice.paid` event would insert this row 
    // after calculating the plan price * percent. Since we want to test the Public Directory Aggregates,
    // we explicitly inject a dummy £12.50 contribution right now so it isn't completely empty!
    await supabase.from("charity_contributions").insert({
      user_id: user.id,
      charity_id: charityId,
      amount: 12.50,
      subscription_period: "yearly" // Hardcoded simulate
    });

    return NextResponse.json({ success: true, message: "Onboarding finalized." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
