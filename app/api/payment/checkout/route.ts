import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMockCheckoutSession } from "@/lib/mockPayment";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { planId, simulateFailure } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });

    if (simulateFailure) {
      // Mock tracking of a failed start
      await supabase
        .from("users")
        .update({ subscription_status: 'lapsed' })
        .eq("id", user.id);

      // Fire subscription lapsed email
      if (user.email) {
        sendEmail('subscription_lapsed', user.email, { name: user.user_metadata?.full_name }).catch(err => 
          console.error("Lapsed email failed:", err)
        );
      }

      return NextResponse.json({ success: false, error: "Payment failed" });
    }

    // Call mock API logic (Replace with real Stripe Checkout later)
    const session = await createMockCheckoutSession(planId, user.id);

    // MOCK FULFILLMENT: We do this immediately instead of waiting for a webhook event since we lack Stripe.
    const monthOrYearAdder = planId === "yearly" ? 12 : 1;
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + monthOrYearAdder);

    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: 'active',
        subscription_plan: planId.includes('yearly') ? 'yearly' : 'monthly',
        subscription_start_date: new Date().toISOString(),
        subscription_renewal_date: renewalDate.toISOString(),
        mock_customer_id: `mock_cus_${user.id.substring(0, 8)}`
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    // Fire subscription confirmed email asynchronously
    if (user.email) {
      sendEmail('subscription_confirmed', user.email, { 
        name: user.user_metadata?.full_name,
        planName: planId.includes('yearly') ? 'Yearly' : 'Monthly',
        nextBillingDate: renewalDate.toISOString()
      }).catch(err => console.error("Confirmed email failed:", err));
    }

    return NextResponse.json({ success: true, sessionId: session.session_id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
