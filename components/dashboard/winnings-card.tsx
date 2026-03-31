"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WinningsProps {
  totalWon: number;
  activePending: any | null;
}

export function WinningsCard({ totalWon, activePending }: WinningsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSimulatedUpload() {
    if (!activePending?.id) return;
    setLoading(true);
    await fetch("/api/winnings/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId: activePending.id })
    });
    setLoading(false);
    router.refresh(); // natively update SC tree
  }

  return (
    <div className="bg-amber-400 text-amber-950 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-300 rounded-full blur-2xl opacity-50" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-amber-300/50 rounded-2xl border border-amber-300">
          <svg className="w-6 h-6 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <span className="font-serif font-bold text-2xl tracking-tight">£{totalWon.toLocaleString()}</span>
      </div>

      <h3 className="text-amber-900/80 font-bold text-sm tracking-widest uppercase mb-1">Total Vault</h3>
      
      {activePending && (
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-inner animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
             <h4 className="font-bold text-red-900 text-sm uppercase tracking-wider">Action Required</h4>
          </div>
          <p className="text-xl font-serif font-bold text-emerald-950 mb-1">£{activePending.amount} Pending</p>
          <p className="text-xs text-stone-600 mb-4 leading-relaxed">
            Congratulations! Please verify your score snapshot by uploading a screenshot from your official tracking app.
          </p>

          <button 
            onClick={handleSimulatedUpload}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold text-sm rounded-xl transition shadow disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Upload Proof (Simulated)"}
            {!loading && <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
          </button>
        </div>
      )}

      {!activePending && totalWon === 0 && (
         <p className="text-amber-900/60 text-sm mt-4 font-medium">Keep your Stableford windows loaded to participate in the upcoming draws.</p>
      )}
    </div>
  );
}
