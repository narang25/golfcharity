import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseUserClient = await createClient();
    const { data: { user } } = await supabaseUserClient.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });

    const supabase = createAdminClient();

    // 1. Core Profile & Charity data
    const { data: profile } = await supabase
      .from("users")
      .select(`
        subscription_status, 
        subscription_plan, 
        subscription_renewal_date, 
        charity_contribution_percent,
        charities ( id, name, image_url )
      `)
      .eq("id", user.id)
      .single();

    // 2. Score counts
    const { count: scoreCount } = await supabase
      .from("scores")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", user.id);

    // 3. Winnings aggregations
    // Using simple fetch summation instead of raw SQL since Supabase JS lacks a direct sum() aggregate
    const { data: payouts } = await supabase
      .from("prize_payouts")
      .select("amount, status, id")
      .eq("user_id", user.id);

    const totalWon = payouts?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    const pendingWin = payouts?.find(p => p.status === 'pending') || null;

    // 4. Participation context
    const { count: drawsEnteredCount } = await supabase
      .from("draw_entries")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", user.id);

    const { data: drawHistory } = await supabase
      .from("draw_entries")
      .select(`
        id, match_count, is_winner,
        draws ( draw_date )
      `)
      .eq("user_id", user.id)
      .limit(5);

    const { data: nextDraw } = await supabase
      .from("draws")
      .select("draw_date")
      .eq("status", "scheduled")
      .order("draw_date", { ascending: true })
      .limit(1)
      .single();

    return NextResponse.json({
      subscription: {
        status: profile?.subscription_status || 'inactive',
        plan: profile?.subscription_plan,
        renewalDate: profile?.subscription_renewal_date
      },
      charity: {
        percent: profile?.charity_contribution_percent || 10,
        details: profile?.charities || null
      },
      scores: {
        count: scoreCount || 0
      },
      winnings: {
        totalWon: totalWon,
        activePending: pendingWin
      },
      participation: {
        entriesCount: drawsEnteredCount || 0,
        nextDrawDate: nextDraw?.draw_date,
        history: drawHistory || []
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to assemble dashboard data", raw: error.message }, { status: 500 });
  }
}
