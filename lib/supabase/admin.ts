import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin client using the service role key.
 * WARNING: This bypasses Row Level Security — use ONLY in trusted
 * server-side contexts (API routes, server actions, webhooks).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
