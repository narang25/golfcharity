import Link from "next/link";

interface SubscriptionProps {
  status: string;
  plan: string | null;
  renewalDate: string | null;
}

export function SubscriptionCard({ status, plan, renewalDate }: SubscriptionProps) {
  const isActive = status === 'active';

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between group">
      {isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-200/50 transition-colors" />}

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-stone-50 rounded-2xl">
            <svg className="w-6 h-6 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
            {status}
          </span>
        </div>

        <h3 className="text-xl font-serif font-bold text-emerald-950">Membership</h3>
        
        {isActive ? (
          <div className="mt-4 pb-4">
             <p className="text-3xl font-bold tracking-tight text-emerald-900 capitalize mb-1">{plan} <span className="text-lg font-medium text-emerald-800/50 lowercase">tier</span></p>
             <p className="text-sm text-emerald-800/70">Renews on {new Date(renewalDate!).toLocaleDateString()}</p>
          </div>
        ) : (
          <div className="mt-4 pb-4">
             <p className="text-sm text-stone-500 leading-relaxed mb-4">Your membership is currently inactive. You are not contributing to a charity or eligible for any prize draws.</p>
             <Link href="/pricing" className="inline-block w-full text-center py-3 bg-emerald-700 text-white font-medium rounded-xl hover:bg-emerald-800 transition shadow-sm">
                Upgrade Now
             </Link>
          </div>
        )}
      </div>

      {isActive && (
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
          {/* // TODO: Add Stripe Customer Portal link when keys available */}
          <button className="text-sm font-medium text-emerald-700 hover:text-emerald-500 transition-colors">
            Manage Billing &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
