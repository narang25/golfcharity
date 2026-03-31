import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/stats - Get platform statistics (admin only)
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" , code: 'UNAUTHORIZED' }, { status: 401 });
    }

    // TODO: Verify admin role, query aggregate stats
    return NextResponse.json(
      {
        stats: {
          totalUsers: 0,
          activeSubscriptions: 0,
          totalDonations: 0,
          upcomingDraws: 0,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
