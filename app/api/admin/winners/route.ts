import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('status');

    let query = supabase
      .from("prize_payouts")
      .select(`
        id, amount, status, proof_url, submitted_at,
        users ( full_name, email ),
        draw_entries ( match_count, draws ( draw_date ) )
      `)
      .order("submitted_at", { ascending: false, nullsFirst: false });

    if (filter && filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data: payouts, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, payouts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
