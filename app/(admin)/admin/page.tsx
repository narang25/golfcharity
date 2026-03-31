"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.overview);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 animate-pulse font-medium text-stone-400">Loading Command Data...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Platform Overview</h1>
      <p className="text-stone-500 mb-10">High-level insights into your operating matrices.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
            <h3 className="text-sm font-bold tracking-widest text-emerald-800/60 uppercase mb-4">Active Subs</h3>
            <p className="text-5xl font-serif font-bold text-emerald-950">{data?.activeSubscribers}</p>
            <Link href="/admin/users" className="mt-6 text-sm text-emerald-600 font-medium hover:text-emerald-800 transition">Manage Population &rarr;</Link>
         </div>

         <div className="bg-amber-400 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
            <h3 className="text-sm font-bold tracking-widest text-amber-900/60 uppercase mb-4 relative z-10">Prize Pool Paid</h3>
            <p className="text-5xl font-serif font-bold text-amber-950 relative z-10">£{data?.totalPrizeGiven?.toLocaleString()}</p>
            <Link href="/admin/reports" className="mt-6 text-sm text-amber-900/70 font-bold hover:text-amber-950 transition inline-block relative z-10">View Draw Splitting &rarr;</Link>
         </div>

         <div className="bg-emerald-950 rounded-3xl p-6 shadow-xl text-emerald-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/40 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
            <h3 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4 relative z-10">Charity Liabilities</h3>
            <p className="text-5xl font-serif font-bold text-emerald-50 relative z-10">£{data?.totalCharityGiven?.toLocaleString()}</p>
            <Link href="/admin/charities" className="mt-6 text-sm text-emerald-400 font-bold hover:text-emerald-300 transition inline-block relative z-10">Manage Directory &rarr;</Link>
         </div>

      </div>
    </div>
  );
}
