import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient();
    const isAdmin = req.headers.get("x-is-admin") === "true";
    // if (!isAdmin) return NextResponse.json({ error: "Unauthorized" , code: 'FORBIDDEN' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = supabase
      .from("users")
      .select(`
        id, email, full_name, subscription_status, subscription_plan, 
        created_at, charity_id,
        charities ( name )
      `)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('subscription_status', status);
    }

    // Limit to block massive loads dynamically
    query = query.limit(500);

    const { data: users, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
