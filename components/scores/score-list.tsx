"use client";

import { Score } from "@/app/(dashboard)/scores/page";

interface ScoreListProps {
  scores: Score[];
  onEdit: (score: Score) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export function ScoreList({ scores, onEdit, onDelete, loading }: ScoreListProps) {
  if (loading) {
    return <div className="p-8 text-center text-emerald-800 bg-emerald-50 rounded-3xl animate-pulse">Loading previous scores...</div>;
  }

  if (scores.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-emerald-200 rounded-3xl text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
        </div>
        <h3 className="text-lg font-bold font-serif text-emerald-950">Empty Window</h3>
        <p className="text-sm text-emerald-800/60 mt-1">You haven't logged any stableford scores yet. Log your first round to activate your index.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
         <h2 className="text-lg font-bold font-serif text-emerald-950">Rolling Window</h2>
         <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">{scores.length} / 5 Logged</span>
      </div>

      <ul className="divide-y divide-stone-100">
        {scores.map((score, index) => {
          // Since it's ordered chronologically descending via API, index 0 is most recent
          const isNewest = index === 0;

          return (
            <li key={score.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isNewest ? 'bg-emerald-50/40 relative' : 'hover:bg-stone-50'}`}>
              
              {isNewest && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-md" />
              )}
              
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold font-serif ${isNewest ? 'text-emerald-700' : 'text-emerald-950'}`}>
                    {score.score}
                  </span>
                  <span className="text-sm font-semibold text-emerald-800/50 uppercase tracking-widest pt-1">pts</span>
                  
                  {isNewest && (
                    <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm tracking-wider">Most Recent</span>
                  )}
                </div>
                
                <div className="mt-1 flex items-center gap-2 text-sm text-emerald-800/60 font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {new Date(score.played_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:mt-0">
                <button
                  onClick={() => onEdit(score)}
                  className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(score.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                >
                  Drop
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
