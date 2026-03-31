"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CharitySelector, CharityBasic } from "../charities/charity-selector";

export function CharityCard({ charityData }: { charityData: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [sliderVal, setSliderVal] = useState(charityData.percent || 10);
  const [loading, setLoading] = useState(false);

  const char = charityData.details?.length > 0 ? charityData.details[0] : charityData.details;

  async function handleSwitch(newCharity: CharityBasic) {
    setLoading(true);
    await fetch("/api/user/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ charityId: newCharity.id, contributionPercent: sliderVal })
    });
    setSwitching(false);
    setLoading(false);
    router.refresh();
  }

  async function handleSave() {
    setLoading(true);
    await fetch("/api/user/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ charityId: char?.id, contributionPercent: sliderVal })
    });
    setEditing(false);
    setLoading(false);
    router.refresh(); // Natively reload the server-component wrapper data
  }

  return (
    <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Visual background swoosh */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-800/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
          <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
      </div>

      <h3 className="text-xl font-serif font-bold text-emerald-50 mb-1">Your Impact</h3>
      
      {!char ? (
        <p className="text-sm text-emerald-300/70 mt-2">No charity selected yet.</p>
      ) : (
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-4">
             {char.image_url ? 
               <img src={char.image_url} alt={char.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-700/50" />
               : <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-lg border border-emerald-600/50">{char.name.charAt(0)}</div>
             }
             <div>
               <p className="font-semibold">{char.name}</p>
               <p className="text-xs text-emerald-300/80">Active Designation</p>
             </div>
          </div>

          {!editing && !switching ? (
             <div className="bg-emerald-900/50 rounded-2xl p-5 mt-6 border border-emerald-800/30 flex flex-col gap-4 backdrop-blur-sm">
               <div>
                 <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Contribution</p>
                 <p className="text-3xl font-bold font-serif leading-none">{charityData.percent}%</p>
               </div>
               <div className="flex gap-2 w-full">
                 <button onClick={() => setSwitching(true)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/20 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-colors text-emerald-50">
                   Switch
                 </button>
                 <button onClick={() => setEditing(true)} className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-colors text-emerald-50">
                   Adjust
                 </button>
               </div>
             </div>
          ) : editing ? (
             <div className="bg-emerald-900/80 rounded-2xl p-4 mt-4 border border-emerald-700/50 animate-in fade-in slide-in-from-top-2">
                 <div className="flex justify-between mb-2">
                   <span className="text-emerald-300 text-sm font-medium">{sliderVal}%</span>
                   <span className="text-emerald-500 text-xs">MIN 10</span>
                 </div>
                 <input 
                   type="range" min="10" max="100" 
                   value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))}
                   className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 mb-4" 
                 />
                 <div className="flex gap-2">
                   <button onClick={() => setEditing(false)} className="flex-1 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 rounded-lg hover:bg-emerald-950 transition">Cancel</button>
                   <button onClick={handleSave} disabled={loading} className="flex-1 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 rounded-lg shadow disabled:opacity-50 hover:bg-emerald-300 transition">{loading ? 'Saving..' : 'Save Layout'}</button>
                 </div>
             </div>
          ) : switching && (
             <div className="bg-white rounded-2xl p-4 mt-4 text-emerald-950 animate-in fade-in slide-in-from-top-2">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="font-bold text-sm">Select New Cause</h4>
                   <button onClick={() => setSwitching(false)} className="text-stone-400 hover:text-stone-600">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 </div>
                 {loading ? <p className="text-center py-4 opacity-50 text-sm font-medium animate-pulse">Assigning...</p> : (
                   <CharitySelector compact onSelect={handleSwitch} selectedId={char?.id} />
                 )}
             </div>
          )}
        </div>
      )}
    </div>
  );
}
