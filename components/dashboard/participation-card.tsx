interface ParticipationProps {
  entriesCount: number;
  nextDrawDate: string | null;
  history: any[];
}

export function ParticipationCard({ entriesCount, nextDrawDate, history }: ParticipationProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col h-full">
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-stone-50 rounded-2xl">
          <svg className="w-6 h-6 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-emerald-800/50 uppercase tracking-widest">Lifetime</p>
          <p className="text-xl font-bold font-serif text-emerald-950">{entriesCount} Entries</p>
        </div>
      </div>

      {nextDrawDate && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mb-6 flex items-center gap-4">
           <div className="w-10 h-10 bg-emerald-200/50 rounded-full flex items-center justify-center animate-pulse">
             <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
           </div>
           <div>
             <p className="text-xs font-bold text-emerald-800/60 uppercase">Next Scheduled Draw</p>
             <p className="text-sm font-bold text-emerald-950">{new Date(nextDrawDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
           </div>
        </div>
      )}

      <div className="flex-1 mt-2">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Recent History</h4>
        {history?.length === 0 ? (
          <p className="text-sm text-stone-400">You haven't entered any draws yet. Ensure your scorecard is filled!</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry, idx) => (
              <li key={idx} className="flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition p-3 rounded-xl border border-stone-100">
                <span className="text-sm font-medium text-emerald-900">{new Date(entry.draws?.draw_date).toLocaleDateString()}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ${entry.is_winner ? 'bg-amber-400 text-amber-950' : 'bg-stone-200 text-stone-600'}`}>
                  {entry.is_winner ? 'Winner' : `${entry.match_count} Matches`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
