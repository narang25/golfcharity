import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });

    const { payoutId } = await req.json();

    const supabase = createAdminClient();

    const { data: currentPayout } = await supabase
      .from("prize_payouts")
      .select("proof_url")
      .eq("id", payoutId)
      .eq("user_id", user.id)
      .single();

    if (currentPayout?.proof_url) {
      return NextResponse.json({ error: "Proof has already been submitted for this prize.", code: 'BAD_REQUEST' }, { status: 400 });
    }

    // In a real application, you upload the multipart file to a Supabase bucket,
    // grab the public URL, and assign it below. We are simulating a mock-upload success.
    const MOCK_URL = "https://mock-image.cloud/scraped.png";

    const { data, error } = await supabase
      .from("prize_payouts")
      .update({
        status: "verified", // Skip pending verification straight to verified for demo state
        proof_url: MOCK_URL,
        submitted_at: new Date().toISOString()
      })
      .eq("id", payoutId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, payload: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
