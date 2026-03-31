import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminClient();
    // const isAdmin = req.headers.get("x-is-admin") === "true";
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { id } = await params;

    // 1. Fetch Draw Core
    const { data: draw, error: drawErr } = await supabase
      .from("draws")
      .select("*")
      .eq("id", id)
      .single();

    if (drawErr || !draw) throw new Error("Draw detail matrix not found.");

    // 2. Fetch Payout Trees (Joining user profiles for display)
    const { data: payouts, error: payErr } = await supabase
      .from("prize_payouts")
      .select(`
        *,
        users ( full_name, email ),
        draw_entries ( match_count )
      `)
      .in("draw_entry_id", (
        // Inner matching dynamically fetching valid entries
        await supabase.from("draw_entries").select("id").eq("draw_id", id).then(r => r.data?.map(d => d.id) || [])
      ));

    // 3. Optional: total physical entries count 
    const { count: entriesCount } = await supabase
      .from("draw_entries")
      .select("id", { count: "exact" })
      .eq("draw_id", id);

    return NextResponse.json({ 
      success: true, 
      draw, 
      payouts: payouts || [],
      entriesCount: entriesCount || 0
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
