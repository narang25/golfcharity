import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePrizePool, generateAlgorithmicNumbers, generateRandomNumbers, evaluateMatches } from "@/lib/drawEngine";

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const isAdmin = req.headers.get("x-is-admin") === "true";
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const body = await req.json();
    const drawType = body.draw_type || 'random'; // 'random' | 'algorithmic'

    // 1. Gather Active Subscriber Bounds
    const { data: activeUsers, error: usersErr } = await supabase
      .from("users")
      .select("id")
      .eq("subscription_status", "active");

    if (usersErr || !activeUsers) throw new Error("Failed to map active user thresholds.");
    if (activeUsers.length === 0) {
      return NextResponse.json({ error: "Cannot simulate a draw with zero active subscribers." , code: 'BAD_REQUEST' }, { status: 400 });
    }
    const activeSubscriberCount = activeUsers.length;

    // 2. Derive Current Rolled Over Jackpot dynamically
    const { data: lastDraw } = await supabase
      .from("draws")
      .select("id, jackpot_amount")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let rolledOverJackpot = 0;
    if (lastDraw) {
      const { count } = await supabase
        .from("draw_entries")
        .select("id", { count: "exact" })
        .eq("draw_id", lastDraw.id)
        .eq("match_count", 5);
      
      if (count === 0) {
        rolledOverJackpot = lastDraw.jackpot_amount;
      }
    }

    // 3. Pool Computations
    const pool = calculatePrizePool(activeSubscriberCount, rolledOverJackpot);

    // 4. Fetch the entire active scores matrix securely
    const activeIds = activeUsers.map(u => u.id);
    const { data: allScores } = await supabase
      .from("scores")
      .select("user_id, score")
      .in("user_id", activeIds);

    const userScoreMap: Record<string, number[]> = {};
    const flatScores: number[] = [];
    allScores?.forEach(s => {
      if (!userScoreMap[s.user_id]) userScoreMap[s.user_id] = [];
      userScoreMap[s.user_id].push(s.score);
      flatScores.push(s.score);
    });

    // 5. Generate Winning Trajectory
    const winningNumbers = drawType === 'algorithmic' 
      ? generateAlgorithmicNumbers(flatScores)
      : generateRandomNumbers();

    // 6. Intersection Parsing
    let fives = 0, fours = 0, threes = 0;
    
    activeUsers.forEach(user => {
      const scores = userScoreMap[user.id] || [];
      if (scores.length >= 5) {
        // Enforced strict 5 score ceiling verification (take newest 5)
        const matchCount = evaluateMatches(winningNumbers, scores.slice(0, 5));
        if (matchCount === 5) fives++;
        if (matchCount === 4) fours++;
        if (matchCount === 3) threes++;
      }
    });

    const simulatorPayload = {
      drawDate: new Date().toISOString().split('T')[0],
      projectedType: drawType,
      simulatedWinningNumbers: winningNumbers,
      poolConfig: {
        activeSubscribers: activeSubscriberCount,
        grossPayout: pool.totalGenerated,
        rolledOverBonus: rolledOverJackpot
      },
      projectedPrizes: {
         jackpotTier: { totalPrize: pool.jackpot, winners: fives, individualPayout: fives > 0 ? (pool.jackpot / fives).toFixed(2) : 0 },
         fourMatchTier: { totalPrize: pool.fourMatch, winners: fours, individualPayout: fours > 0 ? (pool.fourMatch / fours).toFixed(2) : 0 },
         threeMatchTier: { totalPrize: pool.threeMatch, winners: threes, individualPayout: threes > 0 ? (pool.threeMatch / threes).toFixed(2) : 0 }
      }
    };

    return NextResponse.json({ success: true, simulation: simulatorPayload });

  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
