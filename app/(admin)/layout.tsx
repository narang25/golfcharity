"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Command Center', href: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Member CRM', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Draw Execution', href: '/admin/draws', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Charity Management', href: '/admin/charities', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Payout Queue', href: '/admin/winners', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Platform Metrics', href: '/admin/reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans text-stone-900">
      
      {/* Sidebar Top / Left */}
      <aside className="w-full md:w-72 bg-emerald-950 text-emerald-50 md:min-h-screen flex flex-col shadow-2xl relative z-20">
         <div className="p-6">
            <h1 className="text-xl font-bold font-serif tracking-wide text-white flex items-center gap-3 mb-8">
               <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                 <svg className="w-5 h-5 text-emerald-100" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               </div>
               Back Office
            </h1>
            
            <nav className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-emerald-800 text-white shadow-inner' : 'text-emerald-300 hover:bg-emerald-900/50 hover:text-emerald-100'}`}
                  >
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} /></svg>
                    {link.name}
                  </Link>
                );
              })}
            </nav>
         </div>

         <div className="mt-auto p-6 text-xs text-emerald-800 font-medium">
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-emerald-600 transition">
              &larr; Exit to Platform
            </Link>
         </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-stone-50 md:rounded-l-3xl md:-ml-6 z-10 relative">
        <div className="flex-1 overflow-y-auto w-full">
           {children}
        </div>
      </main>
      
    </div>
  );
}
