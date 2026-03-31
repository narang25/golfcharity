import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { data: scores, error } = await supabase
      .from("scores")
      .select("id, score, played_date, created_at")
      .eq("user_id", user.id)
      .order("played_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ scores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json();
    const parsedScore = parseInt(body.score, 10);
    const playedDate = new Date(body.played_date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Validation Rules
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 45) {
      return NextResponse.json({ error: "Score must be a Stableford integer between 1 and 45" , code: 'BAD_REQUEST' }, { status: 400 });
    }

    if (playedDate > today) {
      return NextResponse.json({ error: "Played date cannot be in the future" , code: 'BAD_REQUEST' }, { status: 400 });
    }

    // --- Enforce Max 5 Rolling Window ---
    const { data: existingScores } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user.id)
      .order("played_date", { ascending: true }) // Oldest first
      .order("created_at", { ascending: true });

    if (existingScores && existingScores.length >= 5) {
      // Delete oldest scores until only 4 remain (leaving room for the 5th)
      const overflowCount = existingScores.length - 4; 
      const idsToDelete = existingScores.slice(0, overflowCount).map(s => s.id);
      
      await supabase
        .from("scores")
        .delete()
        .in("id", idsToDelete);
    }

    const { data, error } = await supabase
      .from("scores")
      .insert({
        user_id: user.id,
        score: parsedScore,
        played_date: body.played_date, // Insert strictly as 'YYYY-MM-DD' depending on UI passing
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    // Returning success. The rolling 5-window trigger inside Supabase handles culling the 6th independently.
    return NextResponse.json({ success: true, score: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
