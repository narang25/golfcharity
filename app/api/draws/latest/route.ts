import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache this tightly since it receives heavy public hits on dashboard

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: latestDraw, error } = await supabase
      .from("draws")
      .select("id, draw_date, winning_numbers, jackpot_amount")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !latestDraw) {
      return NextResponse.json({ latestDraw: null });
    }

    // Optional: Identify if a jackpot was hit or purely rolled
    const { count } = await supabase
      .from("draw_entries")
      .select("id", { count: "exact" })
      .eq("draw_id", latestDraw.id)
      .eq("match_count", 5);

    return NextResponse.json({ 
      success: true, 
      latestDraw: {
        ...latestDraw,
        jackpot_hit: count !== null && count > 0 
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
