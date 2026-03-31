"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PLANS, SubscriptionPlan } from "@/lib/plans";
import { FormInput } from "@/components/auth/form-input";

function SubscribeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan");
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [failSimulation, setFailSimulation] = useState(false);

  useEffect(() => {
    if (planKey === "yearly") setPlan(PLANS.yearly);
    else setPlan(PLANS.monthly);
  }, [planKey]);

  if (!plan) return <div className="p-20 text-center text-emerald-900">Loading plan details...</div>;

  async function handleMockCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Passing intent to simulate failure purely for testing UX flows
        body: JSON.stringify({ planId: plan?.id, simulateFailure: failSimulation })
      });
      
      const payload = await response.json();

      if (payload.success) {
        // Mock successful ping
        router.push(`/subscription/success?session_id=${payload.sessionId}`);
      } else {
        router.push(`/subscription/cancel`);
      }
    } catch (err) {
      router.push(`/subscription/cancel`);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8 text-emerald-950 font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Order Summary */}
        <div>
          <h2 className="text-3xl font-bold font-serif mb-6 text-emerald-950">Complete your membership</h2>
          <div className="bg-emerald-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-emerald-600 blur-3xl opacity-50 rounded-full"></div>
             <p className="text-emerald-300 text-sm font-semibold tracking-wide uppercase mb-1">Order Summary</p>
             <h3 className="text-3xl font-serif">{plan.name}</h3>
             <div className="my-8 border-t border-emerald-800" />
             <div className="flex justify-between items-center text-lg">
               <span>Due Today</span>
               <span className="font-bold">£{plan.price}</span>
             </div>
             <p className="text-emerald-400 text-sm text-right mt-1">Billed {plan.interval}</p>
          </div>

          <div className="mt-8 flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h4 className="font-medium text-amber-900">Test Mode Active</h4>
              <p className="text-sm text-amber-800/70 mt-1">No real payment will be taken. This form simulates the future Stripe Elements drop-in.</p>
            </div>
          </div>
        </div>

        {/* Mock Payment Form */}
        <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
          
          <form onSubmit={handleMockCheckout} className="space-y-5">
            <FormInput id="mock_name" name="mock_name" label="Cardholder Name" defaultValue="Test User" required />
            <FormInput id="mock_cc" name="mock_cc" label="Card Number" defaultValue="4242 4242 4242 4242" required maxLength={19} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput id="mock_exp" name="mock_exp" label="Expiry Date" defaultValue="12/28" required />
              <FormInput id="mock_cvv" name="mock_cvv" label="CVV" defaultValue="123" required maxLength={4} type="password" />
            </div>

            <label className="flex items-center gap-3 mt-4 text-sm text-emerald-800 bg-stone-100 p-3 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-200 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-600"
                checked={failSimulation}
                onChange={(e) => setFailSimulation(e.target.checked)}
              />
              Simulate payment failure
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Processing Securely..." : `Pay £${plan.price}`}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-20 text-center text-emerald-900 bg-stone-50">Loading checkout...</div>}>
      <SubscribeForm />
    </Suspense>
  );
}
