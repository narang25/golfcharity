import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { PLANS } from "@/lib/plans";
import OnboardingWizard from "./wizard"; // We'll stick client logic here

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Double check if onboarding is already complete
  const { data: profile } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  // Fetch plan specifics for dynamic math
  const status = await getUserSubscriptionStatus(user.id);
  // Default to monthly context if they somehow bypassed checkout
  const currentPlan = status?.plan === "yearly" ? PLANS.yearly : PLANS.monthly;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 text-emerald-950 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-4">Complete your Profile</h1>
          <p className="text-emerald-800/70">Set up your charitable preferences before teeing off.</p>
        </div>

        <OnboardingWizard planPrice={currentPlan.price} planInterval={currentPlan.interval} />
      </div>
    </div>
  );
}
