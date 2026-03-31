"use client";

import { useState, useEffect } from "react";

export interface CharityBasic {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface CharitySelectorProps {
  onSelect: (charity: CharityBasic) => void;
  selectedId?: string;
  compact?: boolean; // Changes to dropdown layout if true
}

export function CharitySelector({ onSelect, selectedId, compact = false }: CharitySelectorProps) {
  const [charities, setCharities] = useState<CharityBasic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charities")
      .then(res => res.json())
      .then(data => {
        if (data.charities) setCharities(data.charities);
        setLoading(false);
      });
  }, []);

  const filtered = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="relative mb-6">
        <svg className="absolute left-3 top-3 w-5 h-5 text-emerald-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input 
          type="text"
          placeholder="Search registered causes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-emerald-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${compact ? 'py-2 text-sm text-stone-950 font-medium' : ''}`}
        />
      </div>

      {loading ? (
         <div className="py-10 text-center animate-pulse text-emerald-800/60 font-medium">Fetching directory...</div>
      ) : (
        <div className={`overflow-y-auto pr-2 custom-scrollbar ${compact ? 'max-h-[300px] flex flex-col gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px]'}`}>
          
          {filtered.length === 0 && <p className="text-stone-400 py-4 text-center w-full col-span-2">No causes match your search.</p>}

          {filtered.map(c => {
            const isSelected = selectedId === c.id;
            
            return (
              <div 
                key={c.id} 
                onClick={() => onSelect(c)}
                className={`cursor-pointer transition-all duration-200 ${compact ? 'flex items-center gap-3 p-3 rounded-lg border hover:bg-stone-50' : 'p-5 rounded-2xl border-2'} ${isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500' : 'border-stone-100 hover:border-emerald-200 bg-white'}`}
              >
                <div className="flex-shrink-0">
                  {c.image_url ? (
                     <img src={c.image_url} alt={c.name} className={`${compact ? 'w-10 h-10' : 'w-12 h-12 shadow-[0_4px_10px_rgba(0,0,0,0.1)] mb-3'} object-cover rounded-full border border-stone-100`}/>
                  ) : (
                     <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12 mb-3'} bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200/50`}>
                       {c.name.charAt(0)}
                     </div>
                  )}
                </div>

                <div className={compact ? 'flex-1' : ''}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold text-emerald-950 line-clamp-1 ${compact ? 'text-sm' : ''}`}>{c.name}</h3>
                    {isSelected && <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {!compact && (
                    <p className="text-xs text-emerald-800/60 mt-2 line-clamp-2 leading-relaxed">{c.description}</p>
                  )}
                </div>
              </div>
          )})}
        </div>
      )}
    </div>
  );
}
