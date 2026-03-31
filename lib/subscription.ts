import { createClient } from "./supabase/server";

export interface UserSubscription {
  status: 'active' | 'inactive' | 'lapsed' | 'cancelled';
  plan: 'monthly' | 'yearly';
  mockCustomerId: string | null;
  startDate: string | null;
  renewalDate: string | null;
}

/**
 * Fetches the user's localized subscription state from our database mapping.
 * 
 * // TODO: When Stripe is active, this function might also sync state from the
 * // Stripe Customer Portal or invoke `stripe.subscriptions.retrieve()` as a source of truth.
 */
export async function getUserSubscriptionStatus(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("subscription_status, subscription_plan, mock_customer_id, subscription_start_date, subscription_renewal_date")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    status: data.subscription_status,
    plan: data.subscription_plan,
    mockCustomerId: data.mock_customer_id,
    startDate: data.subscription_start_date,
    renewalDate: data.subscription_renewal_date,
  };
}

/**
 * A fast binary check on the user's explicit recurring status.
 */
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const statusObject = await getUserSubscriptionStatus(userId);
  return statusObject?.status === "active";
}
