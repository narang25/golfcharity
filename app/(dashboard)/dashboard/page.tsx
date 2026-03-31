import { requireActiveSubscription } from "@/lib/requireActiveSubscription";
import { createClient } from "@/lib/supabase/server";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

export default async function TopLevelDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If unauthorized via middleware, this shouldn't trigger natively.
  if (!user) return null;

  // The Dashboard is an authenticated hub view natively restricted by 
  // our requireActiveSubscription edge logic.
  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  const isAdmin = profile?.is_admin === true;

  return <DashboardGrid isAdmin={isAdmin} />;
}
