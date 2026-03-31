"use client";

import { useEffect, useState } from "react";

export default function CharitiesMatrix() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Bounds
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', description: '', image_url: '', website_url: '', category: 'General', is_featured: false, is_active: true
  });

  const fetchMatrix = async () => {
    setLoading(true);
    // Directly pull open matrix (filters handled organically)
    const res = await fetch("/api/charities");
    const data = await res.json();
    if (data.charities) setCharities(data.charities);
    setLoading(false);
  };

  useEffect(() => { fetchMatrix(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingId ? `/api/admin/charities/${editingId}` : '/api/admin/charities';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', image_url: '', website_url: '', category: 'General', is_featured: false, is_active: true });
    fetchMatrix();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Soft Delete ${name}? This zeroes the UI assignment instantly but retains the mathematical tracking arrays natively.`)) return;
    await fetch(`/api/admin/charities/${id}`, { method: 'DELETE' });
    fetchMatrix();
  };

  const openEdit = (charity: any) => {
    setFormData({
      name: charity.name || '',
      description: charity.description || '',
      image_url: charity.image_url || '',
      website_url: charity.website_url || '',
      category: charity.category || 'General',
      is_featured: charity.is_featured || false,
      is_active: charity.is_active !== false
    });
    setEditingId(charity.id);
    setIsAdding(true);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Charity Matrix</h1>
          <p className="text-stone-500">Inject new destinations, manage featured banners, and archive legacy paths.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-emerald-800 transition flex gap-2 items-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Inject Origin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="bg-white rounded-3xl p-6 border border-stone-100 animate-pulse flex flex-col h-64">
                <div className="w-14 h-14 bg-stone-100 rounded-full mb-4 shrink-0"></div>
                <div className="h-5 bg-stone-100 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-stone-50 rounded w-1/3 mb-4"></div>
                <div className="h-16 bg-stone-50 rounded w-full mt-auto"></div>
             </div>
           ))
         ) : charities.length === 0 ? (
           <div className="col-span-full py-20 text-center">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
               <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
             </div>
             <h3 className="text-lg font-bold font-serif text-emerald-950">Empty Charity Matrix</h3>
             <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">Click "Inject Origin" above to setup your first charitable destination for the platform.</p>
           </div>
         ) : charities.map(c => (
           <div key={c.id} className={`bg-white rounded-3xl p-6 shadow-sm border ${c.is_featured ? 'border-amber-400 ring-2 ring-amber-100' : 'border-stone-100'} hover:shadow-xl transition-all group flex flex-col`}>
              <div className="flex items-start justify-between mb-4">
                 <div className="w-14 h-14 bg-stone-100 rounded-full flex-shrink-0 flex items-center justify-center border border-stone-200 overflow-hidden shadow-inner">
                   {c.image_url ? <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" /> : <span className="font-serif text-lg font-bold text-stone-400">{c.name.charAt(0)}</span>}
                 </div>
                 
                 {c.is_featured && <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">Hero Featured</span>}
              </div>

              <h2 className="text-lg font-bold text-emerald-950 mb-2 line-clamp-1">{c.name}</h2>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-4 inline-block">{c.category || 'General'}</span>
              
              <p className="text-sm text-stone-500 line-clamp-3 mb-6 flex-1 leading-relaxed">{c.description}</p>

              <div className="flex border-t border-stone-100 pt-4 mt-auto gap-4">
                 <button onClick={() => openEdit(c)} className="flex-1 text-center text-xs font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-800">Edit Frame</button>
                 <button onClick={() => handleDelete(c.id, c.name)} className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600">Archive</button>
              </div>
           </div>
         ))}
      </div>

      {isAdding && (
         <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
             
             <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">{editingId ? 'Modify Layout' : 'Inject Global Matrix Route'}</h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Formal Designation</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Description / Cause Layout</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Hero Image URL</label>
                  <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium text-sm text-emerald-700" placeholder="https://" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Category Routing</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium" />
                </div>

                <div className="md:col-span-2 flex items-center justify-between border border-emerald-100 bg-emerald-50 p-4 rounded-xl">
                   <div>
                     <p className="font-bold text-emerald-900 text-sm">Deploy to Top Grid Spot</p>
                     <p className="text-xs text-emerald-700 font-medium">Flags row boolean to physically push rendering boundaries over the primary layout UI natively.</p>
                   </div>
                   <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-emerald-600 rounded cursor-pointer" />
                </div>
             </div>

             <div className="flex gap-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition">Yield Process</button>
                <button type="submit" className="flex-1 py-4 font-bold text-white bg-emerald-950 shadow hover:bg-emerald-900 rounded-xl transition border-b-4 border-emerald-900">Compile Schema Lock</button>
             </div>
           </form>
         </div>
      )}
    </div>
  );
}
