import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: charity, error } = await supabase
      .from("charities")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !charity) {
      return NextResponse.json({ error: "Charity not found" , code: 'NOT_FOUND' }, { status: 404 });
    }

    // Tally up all real contributions tied to this charity ID
    // Note: Since Supabase Javascript doesn't natively expose aggregate SUM() without RPC,
    // we fetch amounts and reduce. For millions of rows, create a Postgres View or RPC.
    const { data: contributions } = await supabase
      .from("charity_contributions")
      .select("amount")
      .eq("charity_id", id);
      
    const totalRaised = contributions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

    return NextResponse.json({ charity, totalRaised });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch charity profile" , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
