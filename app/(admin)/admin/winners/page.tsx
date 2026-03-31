"use client";

import { useEffect, useState } from "react";

export default function PayoutVerificationQueue() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchQueue = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.append("status", filter);

    const res = await fetch(`/api/admin/winners?${params.toString()}`);
    const data = await res.json();
    if (data.payouts) setPayouts(data.payouts);
    setLoading(false);
  };

  useEffect(() => { fetchQueue(); }, [filter]);

  const handleAction = async (id: string, actionStatus: string) => {
    if (!confirm(`Physically transition payout to ${actionStatus.toUpperCase()} inside the master database?`)) return;
    
    await fetch(`/api/admin/winners/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: actionStatus })
    });
    
    fetchQueue();
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Payout Validator</h1>
          <p className="text-stone-500">Cross-reference submitted identity images and authorize funds natively.</p>
        </div>
        
        <select 
          className="bg-white px-6 py-3 border border-stone-200 rounded-xl font-bold shadow-sm focus:outline-emerald-500 cursor-pointer text-stone-700"
          value={filter} onChange={e => setFilter(e.target.value)}
        >
          <option value="all">Global Matrix View</option>
          <option value="pending">Awaiting Approval (Pending)</option>
          <option value="verified">Verified (Ready to Pay)</option>
          <option value="paid">Funded (Settled)</option>
          <option value="rejected">Rejected Paths</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-stone-100 text-stone-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold">Winning Profile</th>
                <th className="py-4 px-4 font-bold">Draw Origin</th>
                <th className="py-4 px-4 font-bold">Financial Split</th>
                <th className="py-4 px-4 font-bold">Global Status</th>
                <th className="py-4 px-4 font-bold text-right">Verification Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-4"><div className="h-4 bg-stone-100 rounded w-32 mb-2"></div><div className="h-3 bg-stone-50 rounded w-40"></div></td>
                    <td className="py-6 px-4"><div className="h-4 bg-amber-50 rounded w-24 mb-2"></div><div className="h-3 bg-stone-50 rounded w-20"></div></td>
                    <td className="py-6 px-4"><div className="h-6 bg-emerald-50 rounded w-24"></div></td>
                    <td className="py-6 px-4"><div className="h-6 bg-stone-100 rounded-full w-24"></div></td>
                    <td className="py-6 px-4 text-right"><div className="h-8 bg-stone-50 rounded w-32 ml-auto"></div></td>
                  </tr>
                ))
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                       <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-stone-900">Queue is Clear</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">There are no pending winner payouts requiring authorization in this view.</p>
                  </td>
                </tr>
              ) : payouts.map(p => {
                const drawDateRaw = Array.isArray(p.draw_entries) ? null : p.draw_entries?.draws?.draw_date;
                const matchCount = Array.isArray(p.draw_entries) ? null : p.draw_entries?.match_count;
                
                return (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-6 px-4">
                      <div className="font-bold text-emerald-950 text-sm">{Array.isArray(p.users) ? 'Anonymous' : p.users?.full_name || 'Anonymous'}</div>
                      <span className="text-stone-500 mt-1 block text-sm">{Array.isArray(p.users) ? 'N/A' : p.users?.email}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-bold text-amber-800 text-sm tracking-wider mb-1">{matchCount ? `${matchCount}-Match Bracket` : 'Unknown Bounds'}</div>
                      <span className="text-xs text-stone-400 font-bold uppercase block">{drawDateRaw ? new Date(drawDateRaw).toLocaleDateString() : 'N/A'}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-bold text-emerald-700 text-lg">£{Number(p.amount).toLocaleString()}</div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border
                        ${p.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${p.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${p.status === 'paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${p.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                      `}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col items-end gap-2">
                        {p.proof_url ? (
                           <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-xs bg-stone-100 font-bold px-4 py-2 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-200 transition mb-1 inline-flex items-center gap-2">
                             Review Attachment &rarr;
                           </a>
                        ) : (
                           <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Awaiting Upload</span>
                        )}

                        {p.status === 'pending' && (
                          <div className="flex gap-2">
                             <button onClick={() => handleAction(p.id, 'verified')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow">Verify</button>
                             <button onClick={() => handleAction(p.id, 'rejected')} className="bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow">Reject</button>
                          </div>
                        )}

                        {p.status === 'verified' && (
                          <button onClick={() => handleAction(p.id, 'paid')} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow">Mark Formally Settled</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
