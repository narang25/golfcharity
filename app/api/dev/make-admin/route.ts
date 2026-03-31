import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No user logged in." });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("users")
      .update({ is_admin: true })
      .eq("id", user.id);

    if (error) throw error;

    return new NextResponse(`
      <html>
        <head>
          <meta http-equiv="refresh" content="2;url=/dashboard" />
          <style>
            body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #064e3b; color: white; flex-direction: column; }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <h1>Success! You are now an Admin.</h1>
          <p>Redirecting you back to the dashboard in 2 seconds...</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
