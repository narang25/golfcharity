import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;
    const body = await req.json();

    const allowedStatuses = ['pending', 'verified', 'paid', 'rejected'];
    if (!allowedStatuses.includes(body.status)) {
       throw new Error("Invalid status update.");
    }

    const updatePayload: any = { status: body.status };

    // Automatically stamp auditing trails
    if (body.status === 'verified' || body.status === 'rejected') updatePayload.reviewed_at = new Date().toISOString();
    if (body.status === 'paid') updatePayload.paid_at = new Date().toISOString();

    const { data: updatedPayout, error } = await supabase
      .from("prize_payouts")
      .update(updatePayload)
      .eq("id", id)
      .select('amount, users(email, full_name)')
      .single();

    if (error) throw new Error(error.message);

    const userObj: any = Array.isArray(updatedPayout?.users) ? updatedPayout.users[0] : updatedPayout?.users;

    // Fire email notifications if transitioning to paid
    if (body.status === 'paid' && userObj?.email) {
      sendEmail('payout_confirmed', userObj.email, {
         name: userObj.full_name,
         prizeAmount: updatedPayout.amount
      }).catch(err => console.error("Payout email failed:", err));
    }

    return NextResponse.json({ success: true, message: `Payout uniquely marked as ${body.status}.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
