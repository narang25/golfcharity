"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { CharitySelector, CharityBasic } from "@/components/charities/charity-selector";

export default function OnboardingWizard({ planPrice, planInterval }: { planPrice: number, planInterval: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCharity, setSelectedCharity] = useState<CharityBasic | null>(null);
  const [contribution, setContribution] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  const projectedAmount = ((contribution / 100) * planPrice).toFixed(2);

  async function handleComplete() {
    setLoading(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          charityId: selectedCharity?.id,
          contributionPercent: contribution
        })
      });
      router.push("/dashboard");
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-stone-200 shadow-xl rounded-3xl p-8 sm:p-12">
      
      {/* Progress Bar */}
      <div className="flex gap-2 mb-10 w-full">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-emerald-600' : 'bg-stone-100'}`} />
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold font-serif mb-2 text-emerald-950">1. Select your cause</h2>
          <p className="text-emerald-800/60 mb-8 text-sm">Where should our automated donations be directed?</p>
          
          <CharitySelector 
            onSelect={(c) => setSelectedCharity(c)} 
            selectedId={selectedCharity?.id} 
          />

          <div className="mt-10 flex justify-end">
            <button 
              onClick={() => setStep(2)} 
              disabled={!selectedCharity}
              className="bg-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium shadow hover:bg-emerald-800 transition"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8">
          <h2 className="text-2xl font-bold font-serif mb-2 text-emerald-950">2. Set your impact tier</h2>
          <p className="text-emerald-800/60 mb-8 text-sm">How much of your £{planPrice}/{planInterval} sub should go to {selectedCharity?.name}?</p>
          
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 text-center relative overflow-hidden">
             
             <div className="text-5xl font-bold font-serif text-emerald-800 mb-2">{contribution}%</div>
             <p className="text-emerald-700/80 mb-8 font-medium">You're contributing <span className="text-emerald-900 border-b border-emerald-300">£{projectedAmount}</span> per {planInterval.replace('ly','')}.</p>
             
             <input 
               type="range" 
               min="10" 
               max="100" 
               value={contribution} 
               onChange={(e) => setContribution(Number(e.target.value))}
               className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-700" 
             />
             <div className="flex justify-between mt-3 text-xs font-semibold text-emerald-600/60 tracking-wider">
               <span>10% MIN</span>
               <span>100% MAX</span>
             </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(1)} className="text-emerald-600 px-4 py-3 font-medium hover:bg-stone-50 rounded-xl transition">
              &larr; Back
            </button>
            <button 
              onClick={() => setStep(3)} 
              className="bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow hover:bg-emerald-800 transition"
            >
              Verify Settings
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="animate-in zoom-in-95 fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 mx-auto rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl text-center font-bold font-serif mb-2 text-emerald-950">You're All Set!</h2>
          <p className="text-emerald-800/60 mb-8 text-center text-sm px-10">Your charitable preferences are locked in. You can adjust these at any time from your settings panel.</p>
          
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 divide-y divide-stone-200">
            <div className="py-3 flex justify-between items-center">
              <span className="text-emerald-900/60 text-sm">Selected Cause</span>
              <span className="font-semibold text-emerald-950">{selectedCharity?.name}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-emerald-900/60 text-sm">Commitment</span>
              <span className="font-semibold text-emerald-950">{contribution}% <span className="text-xs text-emerald-800/50 ml-1">(£{projectedAmount}/{planInterval.replace('ly','')})</span></span>
            </div>
          </div>

          <div className="mt-10 flex justify-center w-full">
            <button 
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-emerald-950 text-emerald-50 px-8 py-4 rounded-xl font-semibold shadow-xl shadow-emerald-900/20 hover:-translate-y-1 hover:bg-emerald-900 transition-all disabled:opacity-70 disabled:transform-none flex justify-center items-center"
            >
              {loading ? "Finalizing Profile..." : "Go to Dashboard \u2192"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
