import Link from "next/link";

export default function SubscriptionSuccessPage() {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const formattedDate = nextMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500">
      <div className="max-w-md w-full bg-emerald-900/40 border border-emerald-800/50 backdrop-blur-xl rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
        
        {/* Confetti / Glow effect bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400 blur-[80px] opacity-20 pointer-events-none rounded-full" />

        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-serif text-white font-bold tracking-tight">Active & Ready</h1>
        <p className="mt-4 text-emerald-100/70 text-base leading-relaxed">
          Your payment was successful and your membership is now engaged. Thank you for stepping up to make a difference.
        </p>

        <div className="mt-8 bg-emerald-950/50 rounded-2xl p-4 border border-emerald-800 border-dashed">
          <p className="text-sm text-emerald-400 font-medium tracking-wide">NEXT BILLING CYCLE</p>
          <p className="text-xl text-white font-semibold mt-1">{formattedDate}</p>
        </div>

        <div className="mt-10">
          <Link
            href="/onboarding"
            className="w-full inline-block rounded-2xl bg-amber-400 px-6 py-4 text-center text-sm font-bold text-amber-950 shadow-lg hover:bg-amber-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            Continue to Setup &rarr;
          </Link>
          <p className="mt-4 text-xs text-emerald-200/40">Step 2: Designate your charitable impact</p>
        </div>
      </div>
    </div>
  );
}
