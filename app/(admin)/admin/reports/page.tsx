"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReportsAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports").then(r => r.json()).then(d => {
       if (d.success) setData(d);
       setLoading(false);
    });
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Platform Metaphysics</h1>
          <p className="text-stone-500">Visualize aggregate financial flows and platform routing distributions natively.</p>
        </div>
        <Link href="/admin" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-6 py-3 rounded-xl transition">
          Exit to Command Center &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 animate-pulse text-stone-400 font-bold uppercase tracking-widest text-sm">Parsing Visual Layout Matrices...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Chart 1: Global Charity Liabilities by Target */}
           <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col items-start w-full">
              <h2 className="text-xl font-serif font-bold text-emerald-950 mb-1">Global Philanthropy Map</h2>
              <p className="text-sm text-stone-500 mb-8">Cumulative payload distributions physically targeting designated causes.</p>
              
              <div className="w-full flex-1 flex flex-col gap-6 justify-center">
                 {data.charts?.charityDistribution.length === 0 ? (
                    <div className="text-center text-stone-400 text-sm font-medium py-10">Waiting for physical distributions to hit the origin matrix.</div>
                 ) : data.charts?.charityDistribution.map((char: any, i: number) => {
                    const max = Math.max(...data.charts.charityDistribution.map((c:any) => c.total));
                    const percentage = max > 0 ? (char.total / max) * 100 : 0;
                    
                    return (
                       <div key={i} className="w-full">
                          <div className="flex justify-between text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">
                             <span className="line-clamp-1">{char.name}</span>
                             <span className="text-emerald-700">£{char.total.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden shadow-inner">
                             <div 
                               className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-in-out relative"
                               style={{ width: `${Math.max(percentage, 2)}%` }} // Force minimum 2% purely for visibility
                             >
                                <div className="absolute top-0 right-0 w-8 h-full bg-white blur-md opacity-30" />
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* Chart 2: Prize Pool Historical Trajectory */}
           <div className="bg-emerald-950 rounded-3xl p-8 shadow-xl text-white flex flex-col items-start w-full relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 w-full flex flex-col h-full">
                <h2 className="text-xl font-serif font-bold text-amber-400 mb-1">Liability Spline History</h2>
                <p className="text-sm text-emerald-100/60 mb-8">Raw pool configurations distributed per snapshot over time.</p>
                
                <div className="w-full flex-1 flex items-end justify-between gap-1 sm:gap-2 pb-6 px-4 bg-emerald-900/40 rounded-xl border border-emerald-800/50 pt-16 mt-auto">
                   {data.charts?.prizeHistory.length === 0 ? (
                      <div className="w-full text-center text-emerald-600/50 text-sm font-medium">Awaiting explicit draw matrices to graph visually.</div>
                   ) : data.charts?.prizeHistory.map((pool: any, i: number) => {
                      const max = Math.max(...data.charts.prizeHistory.map((p:any) => p.pool));
                      const height = max > 0 ? (pool.pool / max) * 100 : 0;
                      
                      return (
                         <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-emerald-950 text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-2 relative z-20">
                               £{(pool.pool).toLocaleString()}
                               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                            </div>
                            
                            <div 
                               className="w-full bg-amber-400 rounded-t-sm transition-all duration-1000 relative overflow-hidden max-w-[40px]"
                               style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}
                            >
                               <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
                            </div>
                            
                            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mt-3 whitespace-nowrap rotate-[-45deg] origin-top-left ml-4 lg:ml-0 lg:rotate-0">
                               {pool.date}
                            </span>
                         </div>
                      );
                   })}
                </div>
              </div>
           </div>

        </div>
      )}
    </div>
  );
}
