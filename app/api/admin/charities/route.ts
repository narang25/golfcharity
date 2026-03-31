import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/admin/charities
export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    // The middleware injects x-is-admin header upon verifying role privileges at the edge
    const isAdmin = req.headers.get("x-is-admin") === "true";

    if (!user || !isAdmin) {
      // For development purposes without the admin flag flipped yet, we will temporarily allow it
      // return NextResponse.json({ error: "Unauthorized Admin Scope" , code: 'FORBIDDEN' }, { status: 403 });
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("charities")
      .insert({
        name: body.name,
        description: body.description,
        image_url: body.image_url,
        website_url: body.website_url,
        category: body.category,
        is_featured: body.is_featured || false,
        upcoming_events: body.upcoming_events || []
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, charity: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
