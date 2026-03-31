export type PlanInterval = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string; // Acts as the Stripe Price ID lookup
  name: string;
  price: number;
  interval: PlanInterval;
  description: string;
  isPopular?: boolean;
}

export const PLANS: Record<string, SubscriptionPlan> = {
  monthly: {
    id: "price_mock_monthly",
    name: "Monthly Impact",
    price: 9.99,
    interval: "monthly",
    description: "Make a difference every month. A structured mix of premium competition and recurring charitable deduction.",
  },
  yearly: {
    id: "price_mock_yearly",
    name: "Yearly Impact",
    price: 99.99,
    interval: "yearly",
    description: "Play. Win. Give. all year long. Save 17% and maximize your ongoing charitable impact immediately.",
    isPopular: true,
  },
};
