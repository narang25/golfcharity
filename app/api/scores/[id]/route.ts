import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { id } = await params;
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

    const { data, error } = await supabase
      .from("scores")
      .update({
        score: parsedScore,
        played_date: body.played_date,
      })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure ownership
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, score: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Score deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
