import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  const isAuthRoute = path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/reset-password";
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/admin") || path === "/onboarding";

  // If unauthenticated and on a protected route -> send to login
  if (!user && isProtectedRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If authenticated, we fetch their profile attributes to handle role-based routing
  if (user) {
    // 💡 Fetching from `users` table directly at the edge for subscription / role sync
    const { data: profile } = await supabase
      .from("users")
      .select("subscription_status, is_admin")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.is_admin === true;
    const subStatus = profile?.subscription_status || "inactive";

    // Attach headers so Server Components can read context without dual-fetching
    supabaseResponse.headers.set("x-is-admin", isAdmin ? "true" : "false");
    supabaseResponse.headers.set("x-sub-status", subStatus);

    // Routing Logic for authenticated users mapping away from open areas
    if (isAuthRoute) {
      url.pathname = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // Protection rule against standard users accessing /admin
    if (path.startsWith("/admin") && !isAdmin) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
