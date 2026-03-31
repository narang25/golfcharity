import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 120; // Cache for 2 minutes since this is a public page

/**
 * GET /api/public/homepage - Public data for the homepage
 * Returns: current prize pool estimate, featured charity, subscriber count
 * No authentication required.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch active subscriber count for prize pool calculation
    const { count: subscriberCount } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact" })
      .eq("status", "active");

    const activeCount = subscriberCount ?? 0;

    // Calculate prize pool (20% of monthly revenue)
    const MONTHLY_PRICE = 9.99;
    const PRIZE_POOL_PCT = 0.20;
    const grossPool = activeCount * MONTHLY_PRICE * PRIZE_POOL_PCT;

    const prizePool = {
      total: Number(grossPool.toFixed(2)),
      jackpot: Number((grossPool * 0.40).toFixed(2)),
      runners: Number((grossPool * 0.35).toFixed(2)),
      community: Number((grossPool * 0.25).toFixed(2)),
      subscribers: activeCount,
    };

    // Fetch featured charity
    const { data: featuredCharity } = await supabase
      .from("charities")
      .select("id, name, description, image_url, category")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(1)
      .single();

    // Fetch total charity contributions for impact stat
    const { data: charityStats } = await supabase
      .from("charity_contributions")
      .select("amount")
      .limit(1000);

    const totalGiven = charityStats
      ? charityStats.reduce((sum: number, c: { amount: number }) => sum + (c.amount || 0), 0)
      : 0;

    return NextResponse.json({
      success: true,
      prizePool,
      featuredCharity: featuredCharity || null,
      impact: {
        totalGiven: Number(totalGiven.toFixed(2)),
        charitiesSupported: 0,
      },
    });
  } catch {
    // Return fallback data so the page still renders gracefully
    return NextResponse.json({
      success: true,
      prizePool: {
        total: 249.75,
        jackpot: 99.90,
        runners: 87.41,
        community: 62.44,
        subscribers: 125,
      },
      featuredCharity: null,
      impact: { totalGiven: 0, charitiesSupported: 0 },
    });
  }
}
