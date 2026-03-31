import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Core KPIs
    const [{ count: activeSubs }, { data: allDraws }, { data: allContributions }] = await Promise.all([
       supabase.from("users").select("id", { count: "exact" }).eq("subscription_status", "active"),
       supabase.from("draws").select("draw_date, jackpot_amount, four_match_amount, three_match_amount").eq("status", "published").order("draw_date", { ascending: true }),
       supabase.from("charity_contributions").select("amount, charities(name)")
    ]);

    // 2. Aggregate Data Maps
    
    // Charity Totals
    const charityMap: Record<string, number> = {};
    let globalCharitySum = 0;
    
    allContributions?.forEach(c => {
       const charName = Array.isArray(c.charities) ? c.charities[0]?.name : (c.charities as any)?.name;
       const safeName = charName || "Unassigned";
       const amt = Number(c.amount) || 0;
       
       if (!charityMap[safeName]) charityMap[safeName] = 0;
       charityMap[safeName] += amt;
       globalCharitySum += amt;
    });

    const charityData = Object.keys(charityMap).map(name => ({
       name, total: charityMap[name]
    })).sort((a,b) => b.total - a.total);

    // Prize Pool History Format
    let globalPrizeSum = 0;
    const poolHistory = allDraws?.map(d => {
       const totalPool = Number(d.jackpot_amount) + Number(d.four_match_amount) + Number(d.three_match_amount);
       globalPrizeSum += totalPool;
       return {
         date: new Date(d.draw_date).toLocaleDateString("en-US", { month: 'short' }),
         jackpot: d.jackpot_amount,
         pool: totalPool
       };
    }) || [];

    return NextResponse.json({ 
      success: true, 
      overview: {
        activeSubscribers: activeSubs || 0,
        totalPrizeGiven: globalPrizeSum,
        totalCharityGiven: globalCharitySum
      },
      charts: {
        charityDistribution: charityData,
        prizeHistory: poolHistory
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
