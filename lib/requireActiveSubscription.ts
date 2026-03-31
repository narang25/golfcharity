import { NextResponse } from "next/server";
import { isSubscriptionActive } from "./subscription";

/**
 * Endpoint protection guard for internal API routes requiring premium access.
 * Usage:
 * const subCheck = await requireActiveSubscription(userId);
 * if (subCheck) return subCheck; // intercepts request with 403.
 */
export async function requireActiveSubscription(userId: string): Promise<NextResponse | null> {
  const active = await isSubscriptionActive(userId);
  
  if (!active) {
    return NextResponse.json(
      {
        error: "Subscription required",
        code: "SUBSCRIPTION_INACTIVE",
        upgradeUrl: "/pricing"
      },
      { status: 403 }
    );
  }

  // Null means they are verified, letting the parent api route proceed.
  return null;
}
