"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DrawsManagement() {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation Matrix
  const [drawType, setDrawType] = useState('random');
  const [simResults, setSimResults] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);
  
  // Publishing Lock
  const [publishLoading, setPublishLoading] = useState(false);

  const fetchDraws = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/draws");
    const data = await res.json();
    if (data.draws) setDraws(data.draws);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  async function handleSimulate() {
    setSimLoading(true);
    const res = await fetch("/api/admin/draws/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draw_type: drawType })
    });
    const data = await res.json();
    if (data.success) {
      setSimResults(data.simulation);
    } else {
      alert("Simulation bounds failed: " + data.error);
    }
    setSimLoading(false);
  }

  async function handlePublish() {
    if (!confirm("CRITICAL: You are about to permanently capture subscriber score states and lock financial liabilities into the global database. Execute the transaction?")) return;
    
    setPublishLoading(true);
    const res = await fetch("/api/admin/draws/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draw_type: drawType })
    });
    const data = await res.json();
    
    if (data.success) {
      alert("Nuclear Execution Complete! Check the published matrix below.");
      setSimResults(null); 
      fetchDraws();
    } else {
      alert("Lock Sequence aborted: " + data.error);
    }
    setPublishLoading(false);
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Draw Orchestrator</h1>
        <p className="text-stone-500">Run mathematical simulations, govern trajectories, and lock physical payouts.</p>
      </div>

      {/* Execution Console */}
      <div className="bg-emerald-950 rounded-3xl p-8 lg:p-12 shadow-2xl text-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-800/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div>
              <h2 className="text-2xl font-serif font-bold mb-6 text-white tracking-wide">Generate Matrix</h2>
              
              <label className="block text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3">Mathematical Engine Mode</label>
              <div className="flex bg-emerald-900/50 p-2 rounded-2xl mb-8 border border-emerald-800">
                 <button 
                   className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition ${drawType === 'random' ? 'bg-emerald-500 text-stone-950 shadow-md' : 'text-emerald-300 hover:text-white hover:bg-emerald-800/50'}`}
                   onClick={() => setDrawType('random')}
                 >
                   Random Spline
                 </button>
                 <button 
                   className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition ${drawType === 'algorithmic' ? 'bg-amber-400 text-amber-950 shadow-md' : 'text-emerald-300 hover:text-amber-200 hover:bg-emerald-800/50'}`}
                   onClick={() => setDrawType('algorithmic')}
                 >
                   Weighted Algorithm
                 </button>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800/60 p-6 rounded-2xl mb-6 text-sm text-emerald-100/80 leading-relaxed shadow-inner">
                {drawType === 'random' 
                  ? "Standard mode safely pulling 5 bounds blindly from the 1-45 spread. Assures entirely fair, stochastic delivery against the physical player subsets."
                  : "Dramatically forces a heavy 80% pull-weight exclusively towards the top 20 most frequently occurring Stableford numbers inside the active player databases globally."
                }
              </div>

              <button 
                onClick={handleSimulate}
                disabled={simLoading}
                className="w-full bg-white text-emerald-950 font-bold text-lg py-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition disabled:opacity-50"
              >
                 {simLoading ? "Compiling Matrix Model..." : "Dry Run Simulation"}
              </button>
           </div>

           {/* Results Pane */}
           <div>
             {!simResults ? (
               <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-emerald-800/50 rounded-2xl bg-emerald-900/10 text-emerald-600/50 font-medium tracking-wide">
                  Awaiting dry-run execution bounds...
               </div>
             ) : (
               <div className="animate-in fade-in zoom-in-95 duration-500 bg-white text-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full border border-stone-200">
                  <div className="bg-stone-50 p-6 border-b border-stone-200 flex justify-between items-center">
                    <span className="font-bold text-lg tracking-tight">Projected Matrix</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">{simResults.projectedType} Engine</span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-6">
                     <div className="flex justify-between items-center bg-stone-100 p-4 rounded-xl border border-stone-200">
                        <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Simulated Sequence</span>
                        <div className="flex gap-2">
                          {simResults.simulatedWinningNumbers.map((num: number, i: number) => (
                             <span key={i} className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-full text-sm shadow">{num}</span>
                          ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                          <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider mb-1">Total Pool</p>
                          <p className="text-lg font-bold text-emerald-950">£{(simResults.poolConfig.grossPayout + simResults.poolConfig.rolledOverBonus).toLocaleString()}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                          <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider mb-1">Rollover Bonus</p>
                          <p className="text-lg font-bold text-amber-950">£{simResults.poolConfig.rolledOverBonus.toLocaleString()}</p>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-3 text-center border border-stone-200">
                          <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1">Active Accounts</p>
                          <p className="text-lg font-bold text-stone-950">{simResults.poolConfig.activeSubscribers}</p>
                        </div>
                     </div>

                     <div className="flex-1">
                        <div className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-3">Projected Winners Split</div>
                        <ul className="space-y-2">
                           {['jackpotTier', 'fourMatchTier', 'threeMatchTier'].map((tier, idx) => {
                             const layer = simResults.projectedPrizes[tier];
                             const labels = ["5-Match JACKPOT", "4-Match Split", "3-Match Split"];
                             return (
                               <li key={idx} className="flex flex-col p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold text-sm ${idx === 0 ? 'text-amber-600' : 'text-stone-700'}`}>{labels[idx]}</span>
                                    <span className="font-bold text-stone-900">£{layer.totalPrize.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="text-stone-500 font-medium">Yielding {layer.winners} hit{layer.winners !== 1 ? 's' : ''}</span>
                                    <span className="text-emerald-700 font-bold">£{layer.individualPayout} per seat</span>
                                 </div>
                               </li>
                             );
                           })}
                        </ul>
                     </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-200">
                     <button 
                       onClick={handlePublish}
                       disabled={publishLoading}
                       className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                     >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       {publishLoading ? "Locking Matrix Sequence..." : "EXECUTE PHYSICAL PUBLISH"}
                     </button>
                  </div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Historical Draws Matrix */}
      <div>
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Execution Layout</h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-stone-100 text-stone-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold">Chronology</th>
                <th className="py-4 px-4 font-bold">Calculated Trajectory</th>
                <th className="py-4 px-4 font-bold">Core Liabilities</th>
                <th className="py-4 px-4 font-bold text-right">Drill Down</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-stone-100 animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-stone-100 rounded w-24 mb-2"></div><div className="h-3 bg-stone-50 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="flex gap-1 mb-2">{(Array.from({length:5})).map((_,j) => <div key={j} className="h-6 w-6 bg-stone-100 rounded-full"></div>)}</div><div className="h-3 bg-stone-50 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-amber-50 rounded w-32 mb-2"></div><div className="h-3 bg-stone-50 rounded w-24"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-8 bg-stone-50 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : draws.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
                       <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-stone-900">No Historical Launches</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">Generate a matrix and execute a physical publish above to log your first system draw.</p>
                  </td>
                </tr>
              ) : (
                draws.map(d => (
                  <tr key={d.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-950 text-sm">{new Date(d.draw_date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <span className="bg-stone-100 text-stone-600 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 rounded mt-1 inline-block">ID: {d.id.slice(0, 8)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1 items-center mb-1">
                        {d.winning_numbers?.map((num: number, idx: number) => <span key={idx} className="w-6 h-6 flex items-center justify-center bg-stone-200 text-stone-800 rounded-full text-xs font-bold">{num}</span>)}
                      </div>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">{d.draw_type} Node</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-amber-700 text-sm mb-1">Jackpot: £{(Number(d.jackpot_amount)).toLocaleString()}</div>
                      <div className="text-xs text-stone-500 font-medium">{d.total_winners} physical hits mapped</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-semibold text-sm transition border border-emerald-100/50 shadow-sm">
                        View Matrix
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
