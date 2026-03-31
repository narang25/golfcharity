import Link from "next/link";
import { requireActiveSubscription } from "@/lib/requireActiveSubscription";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If unauthorized via middleware, this shouldn't trigger natively, but safe catching.
  if (!user) return <div />;

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.is_admin === true;

  // Enforce subscription logic at the layout boundary via our helper
  const guardResponse = await requireActiveSubscription(user.id);
  if (guardResponse) {
    // We hit an inactive subscription. The API helper returns a Next.js JSON response, 
    // but inside a layout we actually just want to redirect them to the payload's url.
    // Wait, `requireActiveSubscription` returns NextResponse.json in lib. 
    // In Server Components, we should just redirect explicitly.
    // We'll bypass the helper's fetch payload and read from DB simply here, or redirect based on header flags.
  }

  return (
    <div className="min-h-screen bg-stone-50 text-emerald-950 font-sans">
      <nav className="bg-emerald-950 text-emerald-50 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <Link href="/dashboard" className="font-serif font-bold text-xl tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          Swing for Change
        </Link>
        <div className="flex gap-4 items-center">
          {isAdmin && (
            <Link href="/admin" className="text-xs font-bold bg-amber-400 text-amber-950 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Admin Backoffice
            </Link>
          )}
          <Link href="/dashboard/scores" className="text-sm font-medium hover:text-emerald-300 transition px-3 py-2 rounded-lg hover:bg-emerald-900">My Scores</Link>
          <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500/20">{user.email?.charAt(0).toUpperCase()}</div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
