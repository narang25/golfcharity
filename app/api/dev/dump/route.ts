import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  
  // Specific entry belonging to the active user (nikhilmay2005)
  const ENTRY_ID = "5e6fe67c-fbbf-42f3-bf43-2c4e8ff4898a";
  const USER_ID = "2a883ee7-49d3-4407-bbd1-081325b89d6b";
  
  // 1. Upgrade the entry to a 5-Match winner
  const { data: upgradedEntry, error: err1 } = await supabase
    .from("draw_entries")
    .update({ match_count: 5, is_winner: true })
    .eq("id", ENTRY_ID)
    .select()
    .single();

  if (err1) return NextResponse.json({ error: "Failed to upgrade entry", details: err1 });

  // 2. Inject a massive £5000 payout for this exact entry
  const { data: newPayout, error: err2 } = await supabase
    .from("prize_payouts")
    .insert([{
      draw_entry_id: ENTRY_ID,
      user_id: USER_ID,
      amount: 5000.00,
      status: 'pending' // Pending verification
    }]);

  if (err2) return NextResponse.json({ error: "Failed to insert payout", details: err2 });

  return NextResponse.json({
    success: true,
    message: "Jackpot Injected!",
    upgradedEntry
  });
}
