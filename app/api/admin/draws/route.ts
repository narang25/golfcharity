import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient();
    const isAdmin = req.headers.get("x-is-admin") === "true";
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { data: draws, error } = await supabase
      .from("draws")
      .select("*")
      .order("draw_date", { ascending: false });

    if (error) throw new Error(error.message);

    // Light map to calculate aggregated winners per draw (Optional natively but helpful for list UI)
    const summarizedDraws = await Promise.all(draws.map(async (draw) => {
      const { count } = await supabase
        .from("draw_entries")
        .select("id", { count: "exact" })
        .eq("draw_id", draw.id)
        .eq("is_winner", true);

      return { ...draw, total_winners: count || 0 };
    }));

    return NextResponse.json({ success: true, draws: summarizedDraws });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
