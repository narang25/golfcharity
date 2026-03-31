import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

// This endpoint is intended to be called daily via Vercel Cron or a similar scheduler.
export async function GET(req: Request) {
  // Optional: Secure this endpoint with a secret token
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Calculate dates to find renewals due exactly 3 days from now
    const today = new Date();
    
    const inThreeDays = new Date(today);
    inThreeDays.setDate(today.getDate() + 3);
    inThreeDays.setHours(0, 0, 0, 0); // Start of day

    const inFourDays = new Date(inThreeDays);
    inFourDays.setDate(inFourDays.getDate() + 1); // Start of next day

    const { data: renewals, error } = await supabase
      .from('users')
      .select('id, full_name, email, subscription_plan, subscription_renewal_date')
      .eq('subscription_status', 'active')
      .gte('subscription_renewal_date', inThreeDays.toISOString())
      .lt('subscription_renewal_date', inFourDays.toISOString());

    if (error) {
      throw new Error(`Failed to fetch renewals: ${error.message}`);
    }

    let emailsSent = 0;

    if (renewals && renewals.length > 0) {
      for (const user of renewals) {
        if (!user.email) continue;
        
        await sendEmail('subscription_renewal', user.email, {
          name: user.full_name,
          planName: user.subscription_plan === 'yearly' ? 'Yearly' : 'Monthly',
          nextBillingDate: user.subscription_renewal_date
        }).catch(err => {
          console.error(`Renewal email failed for user ${user.id}:`, err);
        });
        
        emailsSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: renewals?.length || 0,
      emailsSent 
    });

  } catch (error: any) {
    console.error("Cron renewals failed:", error);
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
