import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    let query = supabase
      .from("charities")
      .select("id, name, description, image_url, category, is_featured")
      .eq("is_active", true);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Always sort featured first, then roughly alphabetically
    query = query.order('is_featured', { ascending: false }).order('name', { ascending: true });

    const { data: charities, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message , code: 'INTERNAL_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ charities });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch charities" , code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
