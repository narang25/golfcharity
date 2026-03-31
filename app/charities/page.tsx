"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";

interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
}

export default function CharityDirectory() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Youth & Education", "Healthcare", "Global Infrastructure", "Local Community"];

  useEffect(() => {
    async function fetchCharities() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);

      try {
        const res = await fetch(`/api/charities?${params.toString()}`);
        const data = await res.json();
        if (data.charities) setCharities(data.charities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Debounce the search typing
    const timer = setTimeout(fetchCharities, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const featured = charities.find(c => c.is_featured);
  const gridCharities = charities.filter(c => !c.is_featured || (c.is_featured && charities.length === 1));

  return (
    <PublicLayout>
    <div className="min-h-screen bg-stone-50 text-emerald-950 font-sans pb-24 pt-20">
      
      {/* Search Header */}
      <div className="bg-emerald-950 px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 relative z-10">Discover Our Causes</h1>
        <p className="text-emerald-100/70 max-w-2xl mx-auto mb-10 relative z-10">Every point scored redirects funds to verifiable charities making a physical impact. Explore the directory to find where your subscription will shine brightest.</p>
        
        <div className="max-w-3xl mx-auto relative z-10 bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col sm:flex-row gap-2 border border-white/20">
           <input 
             type="text" 
             placeholder="Search charities by name..." 
             className="flex-1 px-4 py-3 rounded-xl bg-white text-emerald-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
           <select 
             className="px-4 py-3 rounded-xl bg-white text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 border-none sm:w-48 appearance-none"
             value={category}
             onChange={(e) => setCategory(e.target.value)}
           >
             {categories.map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full" />
          </div>
        ) : (
          <>
            {/* Featured Charity Block */}
            {featured && category === "All" && search === "" && (
              <div className="mb-16 bg-white rounded-3xl overflow-hidden shadow-lg border border-emerald-100 grid md:grid-cols-2 relative group hover:shadow-2xl transition">
                 <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4 bg-amber-50 inline-block px-3 py-1 rounded w-fit">Spotlight Initiative</span>
                    <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-4">{featured.name}</h2>
                    <p className="text-emerald-800/70 mb-8 leading-relaxed line-clamp-4">{featured.description}</p>
                    <Link href={`/charities/${featured.id}`} className="inline-block bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-800 transition w-fit shadow-md hover:-translate-y-0.5">
                      View Profile & Impact
                    </Link>
                 </div>
                 <div className="bg-stone-100 min-h-[300px] h-full relative overflow-hidden">
                    {featured.image_url ? 
                      <img src={featured.image_url} alt={featured.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" /> 
                    : <div className="absolute inset-0 flex items-center justify-center text-8xl font-serif font-bold text-stone-200">{featured.name.charAt(0)}</div>}
                 </div>
              </div>
            )}

            {/* General Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridCharities.map(charity => (
                <div key={charity.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
                  <div className="h-48 bg-emerald-50 relative overflow-hidden flex-shrink-0">
                    {charity.image_url ? 
                      <img src={charity.image_url} alt={charity.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    : <div className="absolute inset-0 flex items-center justify-center text-6xl font-serif font-bold text-emerald-200/50">{charity.name.charAt(0)}</div>}
                    
                    {charity.category && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-900 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                        {charity.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 pb-8">
                    <h3 className="text-xl font-bold font-serif text-emerald-950 mb-2">{charity.name}</h3>
                    <p className="text-sm text-emerald-800/60 leading-relaxed line-clamp-3 mb-6 flex-1">{charity.description}</p>
                    <Link href={`/charities/${charity.id}`} className="text-center font-semibold text-emerald-700 bg-stone-50 hover:bg-emerald-50 border border-stone-200 py-3 rounded-xl transition w-full">
                      View Charity
                    </Link>
                  </div>
                </div>
              ))}

              {charities.length === 0 && (
                <div className="col-span-full py-20 text-center">
                   <h3 className="text-xl font-serif font-bold text-emerald-900 mb-2">No organizations found.</h3>
                   <p className="text-emerald-800/60">Try adjusting your filters or searching for entirely different terms.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
    </PublicLayout>
  );
}
