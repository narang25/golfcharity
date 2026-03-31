import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createAdminClient();
    // const isAdmin = req.headers.get("x-is-admin") === "true";
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: body.subscription_status,
        subscription_plan: body.subscription_plan,
        charity_id: body.charity_id || null
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: "User constraints overridden gracefully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
