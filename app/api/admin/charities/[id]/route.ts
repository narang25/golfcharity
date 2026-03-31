import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = req.headers.get("x-is-admin") === "true";

    // if (!user || !isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("charities")
      .update({
        name: body.name,
        description: body.description,
        image_url: body.image_url,
        website_url: body.website_url,
        category: body.category,
        is_featured: body.is_featured,
        upcoming_events: body.upcoming_events,
        is_active: body.is_active // Allows re-activating dropped charities
      })
      .eq("id", id)
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    // if (!user) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { id } = await params;

    // Secure Soft-Delete routing keeping foreign keys intact
    const { error } = await supabase
      .from("charities")
      .update({ is_active: false, is_featured: false })
      .eq("id", id);

    if (error) {
       return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Charity disabled from public directory" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
