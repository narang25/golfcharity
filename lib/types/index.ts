/**
 * Shared type definitions for the Golf Charity Subscription Platform
 */

// --- User ---
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "user" | "admin";
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

// --- Subscription ---
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  plan: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

// --- Golf Score ---
export interface GolfScore {
  id: string;
  user_id: string;
  course_name: string;
  score: number;
  handicap?: number;
  played_at: string;
  created_at: string;
}

// --- Draw ---
export interface Draw {
  id: string;
  title: string;
  description: string;
  charity_id: string;
  prize_description: string;
  draw_date: string;
  status: "upcoming" | "active" | "completed";
  winner_id?: string;
  created_at: string;
}

// --- Charity ---
export interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  total_raised: number;
  is_active: boolean;
  created_at: string;
}

// --- API Response ---
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
