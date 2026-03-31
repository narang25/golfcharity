import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-emerald-950 font-sans">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-amber-100 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 flex flex-col items-center">
        <Link href="/" className="inline-block group mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-emerald-950/90 font-serif">
          Swing for Change
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-800/60 max-w-sm">
          Join our global community of golfers making an impact with every stroke.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px] z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-3xl border border-white sm:px-12 relative overflow-hidden group">
          {/* Subtle top glare */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />
          
          {children}
        </div>
      </div>
    </div>
  );
}
