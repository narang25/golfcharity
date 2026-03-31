import Link from "next/link";

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 text-emerald-950">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-10 text-center shadow-lg relative overflow-hidden">
        
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-serif text-emerald-950 font-bold tracking-tight">Payment Unsuccessful</h1>
        <p className="mt-4 text-emerald-800/70 text-sm leading-relaxed">
          Your card was not charged because the payment process was either interrupted or declined. Let's try that again.
        </p>

        <div className="mt-10 space-y-4">
          <Link
            href="/pricing"
            className="w-full inline-flex justify-center rounded-2xl bg-emerald-700 px-6 py-4 text-center text-sm font-semibold text-white shadow hover:bg-emerald-800 transition-colors"
          >
            Try Again
          </Link>
          
          <a
            href="mailto:support@swingforchange.example"
            className="w-full inline-block rounded-2xl px-6 py-4 text-center text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors border border-stone-200 hover:bg-stone-50"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
