import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CharityProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Directly fetching within the Server Component for SEO and speed
  const supabase = await createClient();
  const { data: charity, error } = await supabase
    .from("charities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !charity) notFound();

  // Aggregate stats
  const { data: contributions } = await supabase
    .from("charity_contributions")
    .select("amount")
    .eq("charity_id", id);
    
  const totalRaised = contributions?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  
  // Parse JSONB
  const events = typeof charity.upcoming_events === "string" 
    ? JSON.parse(charity.upcoming_events) 
    : (charity.upcoming_events || []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-emerald-950">
      
      {/* Hero Header */}
      <div className="bg-emerald-950 pt-32 pb-24 px-6 relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none -mt-40 -mr-40" />
        
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-10 relative z-10">
          <div className="w-40 h-40 bg-white rounded-full flex-shrink-0 flex items-center justify-center shadow-2xl overflow-hidden border-4 border-emerald-800">
            {charity.image_url ? 
               <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" /> 
             : <span className="text-6xl font-serif text-emerald-200">{charity.name.charAt(0)}</span>
            }
          </div>
          <div>
            <span className="text-amber-500 uppercase tracking-widest font-bold text-xs bg-amber-950/40 px-3 py-1 rounded-full mb-4 inline-block border border-amber-900/50">
              {charity.category || "Official Partner"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif text-white font-bold leading-tight mb-4">{charity.name}</h1>
            <p className="text-emerald-100/70 text-lg max-w-2xl leading-relaxed">{charity.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        
        {/* Left Column: Details & Events */}
        <div>
           <div className="mb-16">
             <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-6">About the Cause</h2>
             <p className="text-emerald-800/80 leading-relaxed whitespace-pre-line">{charity.description}</p>
             {charity.website_url && (
               <a href={charity.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 text-emerald-600 hover:text-emerald-800 font-semibold transition">
                 Visit Official Website <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
               </a>
             )}
           </div>

           <div>
             <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-6 flex items-center gap-3">
               <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               Upcoming Golf Events
             </h2>

             {events.length === 0 ? (
                <div className="bg-stone-100/50 border border-stone-200 rounded-2xl p-8 text-center">
                  <p className="text-emerald-800/60 font-medium tracking-wide">No scheduled events published currently.</p>
                </div>
             ) : (
                <ul className="space-y-4">
                  {events.map((evt: any, idx: number) => (
                    <li key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
                       <div>
                         <h4 className="font-bold text-emerald-950 text-lg">{evt.name}</h4>
                         <p className="text-sm text-stone-500 mt-1">{evt.location}</p>
                       </div>
                       <div className="bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded-xl text-center sm:text-right min-w-[120px]">
                          {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                       </div>
                    </li>
                  ))}
                </ul>
             )}
           </div>
        </div>

        {/* Right Column: Ticker & Actions */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden text-center sticky top-24">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 blur-3xl opacity-20 pointer-events-none rounded-full" />
              
              <h3 className="text-sm font-bold tracking-widest text-emerald-800/60 uppercase mb-2">Platform Contribution</h3>
              <p className="text-5xl font-serif font-bold text-amber-500 mb-6">£{totalRaised.toLocaleString()}</p>
              
              <div className="w-full h-px bg-stone-100 mb-6" />

              <p className="text-sm text-emerald-900/70 mb-8 leading-relaxed">
                Connect your rolling handicaps to actively funnel a verified percentage of your subscription right here.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/pricing" className="w-full flex justify-center items-center gap-2 py-4 rounded-xl font-bold bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800 hover:-translate-y-0.5 transition-all">
                   <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Subscribe to Play & Donate
                </Link>
                <a href="#donate" className="w-full flex justify-center items-center gap-2 py-4 rounded-xl font-bold bg-white text-emerald-800 border-2 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                   <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                   Direct Donation Only
                </a>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
