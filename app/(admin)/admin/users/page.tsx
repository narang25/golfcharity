"use client";

import { useEffect, useState } from "react";
import { CharitySelector, CharityBasic } from "@/components/charities/charity-selector";

export default function UsersCRM() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter !== "all") params.append("status", statusFilter);

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  async function handleSaveOverride() {
    setSaveLoading(true);
    await fetch(`/api/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription_status: editingUser.subscription_status,
        subscription_plan: editingUser.subscription_plan,
        charity_id: editingUser.charity_id
      })
    });
    setSaveLoading(false);
    setEditingUser(null);
    fetchUsers();
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Member CRM</h1>
          <p className="text-stone-500">Govern user statuses, inspect configurations, and override profiles natively.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <input 
             type="text" placeholder="Search name or email..." 
             className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
             value={search} onChange={e => setSearch(e.target.value)}
           />
           <select 
             className="px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none"
             value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
           >
             <option value="all">All Statuses</option>
             <option value="active">Active Accounts</option>
             <option value="inactive">Inactive / Lapsed</option>
           </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-100 text-stone-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold">Member Mapping</th>
                <th className="py-4 px-4 font-bold">Plan Profile</th>
                <th className="py-4 px-4 font-bold">Status Matrix</th>
                <th className="py-4 px-4 font-bold">Charity Designations</th>
                <th className="py-4 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-stone-100 animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-stone-100 rounded w-3/4 mb-2"></div><div className="h-3 bg-stone-50 rounded w-1/2"></div></td>
                    <td className="py-4 px-4"><div className="h-5 bg-stone-100 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-6 bg-stone-50 rounded-full w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-stone-100 rounded w-32"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-8 bg-stone-50 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1m0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-stone-900">No Members Found</h3>
                    <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">Try adjusting your search query or status filter to find the member you&apos;re looking for.</p>
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-emerald-950">{u.full_name || 'Anonymous User'}</div>
                      <div className="text-sm text-stone-500">{u.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded text-xs font-bold uppercase">{u.subscription_plan || 'None'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${u.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {u.subscription_status || 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-stone-600">
                      {Array.isArray(u.charities) ? u.charities[0]?.name : (u.charities as any)?.name || 'Unassigned'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                         onClick={() => setEditingUser(u)}
                         className="text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg font-semibold text-sm transition"
                      >
                        Override View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Override Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 border border-stone-100 relative max-h-[90vh] overflow-y-auto">
             
             <div className="mb-6">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">Admin Privilege Modal</span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">Force Edit Profile</h2>
                <p className="text-sm text-stone-500 mt-1">Executing hard overwrites on: <span className="font-semibold">{editingUser.email}</span></p>
             </div>

             <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Subscription Toggle</label>
                  <select 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium"
                    value={editingUser.subscription_status || 'inactive'}
                    onChange={(e) => setEditingUser({...editingUser, subscription_status: e.target.value})}
                  >
                    <option value="active">Active (Eligible for Draws)</option>
                    <option value="inactive">Inactive</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Plan Matrix Override</label>
                  <select 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium"
                    value={editingUser.subscription_plan || ''}
                    onChange={(e) => setEditingUser({...editingUser, subscription_plan: e.target.value})}
                  >
                    <option value="">No Plan</option>
                    <option value="monthly">Monthly Recurring</option>
                    <option value="yearly">Yearly Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Hard-Routing Charity Payload</label>
                  <CharitySelector 
                     compact 
                     selectedId={editingUser.charity_id}
                     onSelect={(c) => setEditingUser({...editingUser, charity_id: c.id})}
                  />
                </div>
             </div>

             <div className="mt-8 flex gap-3">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-3 font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition">
                  Cancel Overwrite
                </button>
                <button onClick={handleSaveOverride} disabled={saveLoading} className="flex-1 py-3 font-semibold text-white bg-emerald-700 shadow hover:bg-emerald-800 rounded-xl transition disabled:opacity-50">
                  {saveLoading ? 'Locking...' : 'Force Commit Settings'}
                </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
