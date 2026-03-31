/**
 * Utility functions for the Golf Charity Subscription Platform
 */

/**
 * Formats a price amount (in cents) to a currency string.
 */
export function formatPrice(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Returns the absolute URL for a given path.
 * Works on both server and client.
 */
export function getURL(path: string = ""): string {
  // Check for NEXT_PUBLIC_APP_URL first
  let url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  // Ensure prefix with https:// if not localhost
  url = url.startsWith("http") ? url : `https://${url}`;
  // Ensure no trailing slash
  url = url.replace(/\/+$/, "");
  // Ensure path starts with /
  path = path.replace(/^\/+/, "");

  return `${url}/${path}`;
}

/**
 * Combines class names, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
