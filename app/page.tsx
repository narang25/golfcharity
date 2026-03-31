"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useScrollAnimation, useCountUp } from "@/lib/hooks";
import { PublicLayout } from "@/components/layout/public-layout";

interface PrizePool {
  total: number;
  jackpot: number;
  runners: number;
  community: number;
  subscribers: number;
}

interface FeaturedCharity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
}

interface HomepageData {
  prizePool: PrizePool;
  featuredCharity: FeaturedCharity | null;
  impact: { totalGiven: number; charitiesSupported: number };
}

export default function HomePage() {
  const containerRef = useScrollAnimation();
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    fetch("/api/public/homepage")
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d); })
      .catch(() => {
        // Fallback data
        setData({
          prizePool: { total: 249.75, jackpot: 99.90, runners: 87.41, community: 62.44, subscribers: 125 },
          featuredCharity: null,
          impact: { totalGiven: 1200, charitiesSupported: 4 },
        });
      });
  }, []);

  const prizeTarget = data?.prizePool?.total ?? 250;
  const { count: prizeCount, ref: prizeRef } = useCountUp(Math.round(prizeTarget * 100), 2200);

  return (
    <PublicLayout>
    <div ref={containerRef} className="min-h-screen bg-stone-50 font-sans text-emerald-950">
      {/* ═══════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="hero">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl animate-float" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl" />

          {/* Orbital decorative elements */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit">
              <div className="w-3 h-3 bg-emerald-300/40 rounded-full" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit-reverse">
              <div className="w-2 h-2 bg-amber-300/40 rounded-full" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="fade-in-up inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-10 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Charity-powered golf competition
          </div>

          {/* Headline */}
          <h1 className="fade-in-up delay-100 text-5xl sm:text-6xl lg:text-8xl font-bold font-serif tracking-tight leading-[1.05]">
            Your score.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Their future.</span>
          </h1>

          {/* Sub-headline */}
          <p className="fade-in-up delay-200 mt-8 text-lg sm:text-xl text-emerald-800/60 max-w-2xl mx-auto leading-relaxed">
            Enter your Stableford scores. Get entered into monthly prize draws.
            A portion of every subscription goes directly to a charity you choose.
          </p>

          {/* CTA Buttons */}
          <div className="fade-in-up delay-300 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="group relative px-8 py-4 bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-800 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto overflow-hidden"
              id="hero-cta"
            >
              <span className="relative z-10">Start Giving Today</span>
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-4 glass text-emerald-900 font-semibold text-lg rounded-2xl hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
              id="hero-secondary-cta"
            >
              See How it Works →
            </Link>
          </div>

          {/* Trust signals */}
          <div className="fade-in-up delay-400 mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-emerald-800/40 font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Verified charities
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure payments
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Monthly draws
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-400/40">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-5 h-8 border-2 border-emerald-300/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-emerald-400/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-6 bg-white relative overflow-hidden" id="how-it-works">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
              Simple & impactful
            </p>
            <h2 className="fade-in-up delay-100 text-4xl sm:text-5xl font-bold font-serif text-emerald-950">
              Three steps to making a difference
            </h2>
            <p className="fade-in-up delay-200 mt-5 text-lg text-emerald-800/50 max-w-2xl mx-auto">
              No complexity. No catches. Just play, compete, and contribute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 – Score */}
            <div className="fade-in-up delay-100 group relative">
              <div className="bg-stone-50 rounded-3xl p-8 lg:p-10 border border-stone-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors group-hover:scale-110 group-hover:rotate-3 duration-500">
                  <svg className="w-7 h-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-[64px] font-serif font-bold text-emerald-100 absolute top-6 right-8 select-none pointer-events-none leading-none">1</div>
                <h3 className="text-xl font-bold font-serif text-emerald-950 mb-3">Enter Your Score</h3>
                <p className="text-emerald-800/50 leading-relaxed">
                  Submit up to 5 Stableford scores from your round. Your rolling window keeps your best plays active.
                </p>
              </div>
            </div>

            {/* Step 2 – Draw */}
            <div className="fade-in-up delay-200 group relative">
              <div className="bg-stone-50 rounded-3xl p-8 lg:p-10 border border-stone-100 hover:border-amber-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors group-hover:scale-110 group-hover:-rotate-3 duration-500">
                  <svg className="w-7 h-7 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-[64px] font-serif font-bold text-amber-100 absolute top-6 right-8 select-none pointer-events-none leading-none">2</div>
                <h3 className="text-xl font-bold font-serif text-emerald-950 mb-3">Monthly Draw</h3>
                <p className="text-emerald-800/50 leading-relaxed">
                  Your scores become your lottery numbers. Each month, winning numbers are drawn — match 3, 4, or all 5 to win.
                </p>
              </div>
            </div>

            {/* Step 3 – Give */}
            <div className="fade-in-up delay-300 group relative">
              <div className="bg-stone-50 rounded-3xl p-8 lg:p-10 border border-stone-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors group-hover:scale-110 group-hover:rotate-3 duration-500">
                  <svg className="w-7 h-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-[64px] font-serif font-bold text-emerald-100 absolute top-6 right-8 select-none pointer-events-none leading-none">3</div>
                <h3 className="text-xl font-bold font-serif text-emerald-950 mb-3">Charity Gets Funded</h3>
                <p className="text-emerald-800/50 leading-relaxed">
                  A portion of every subscription automatically flows to the charity you choose. Real impact, every single month.
                </p>
              </div>
            </div>
          </div>

          {/* Connector line between steps (desktop only) */}
          <div className="hidden md:flex items-center justify-center mt-[-220px] mb-[180px] px-20 pointer-events-none">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-amber-200 opacity-50" />
            <div className="flex-1 h-px bg-gradient-to-r from-amber-200 via-emerald-200 to-transparent opacity-50" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRIZE POOL
          ═══════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-6 bg-emerald-950 text-emerald-50 relative overflow-hidden" id="prize-pool">
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-emerald-800/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-emerald-900/40 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[60%] w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10" ref={prizeRef}>
          <div className="text-center mb-16">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              This month&apos;s draw
            </p>
            <h2 className="fade-in-up delay-100 text-4xl sm:text-5xl font-bold font-serif text-white">
              Current Prize Pool
            </h2>
          </div>

          {/* Main prize display */}
          <div className="fade-in-scale delay-200 text-center mb-16">
            <div className="inline-block animate-pulse-glow rounded-3xl px-12 py-10 glass-dark">
              <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-3">
                Total Pool
              </p>
              <p className="text-6xl sm:text-8xl font-bold font-serif text-white tabular-nums">
                £{(prizeCount / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-emerald-300/50 mt-3">
                Built from {data?.prizePool?.subscribers ?? 0} active members
              </p>
            </div>
          </div>

          {/* Prize breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="fade-in-up delay-200 glass-dark rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                🏆 Jackpot (5/5)
              </p>
              <p className="text-3xl font-bold font-serif text-white">
                £{data?.prizePool?.jackpot?.toFixed(2) ?? "0.00"}
              </p>
            </div>
            <div className="fade-in-up delay-300 glass-dark rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                Runner-up (4/5)
              </p>
              <p className="text-3xl font-bold font-serif text-white">
                £{data?.prizePool?.runners?.toFixed(2) ?? "0.00"}
              </p>
            </div>
            <div className="fade-in-up delay-400 glass-dark rounded-2xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                Community (3/5)
              </p>
              <p className="text-3xl font-bold font-serif text-white">
                £{data?.prizePool?.community?.toFixed(2) ?? "0.00"}
              </p>
            </div>
          </div>

          <div className="fade-in-up delay-500 text-center mt-12">
            <Link
              href="/pricing"
              className="inline-block px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-900/30"
              id="prize-pool-cta"
            >
              Enter This Month&apos;s Draw
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED CHARITY SPOTLIGHT
          ═══════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-6 bg-white relative overflow-hidden" id="charity-spotlight">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
              Where your money goes
            </p>
            <h2 className="fade-in-up delay-100 text-4xl sm:text-5xl font-bold font-serif text-emerald-950">
              Charity Spotlight
            </h2>
          </div>

          {data?.featuredCharity ? (
            <div className="fade-in-scale delay-200 grid md:grid-cols-2 gap-0 bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 shadow-xl max-w-4xl mx-auto">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-5">
                  Featured Partner
                </span>
                <h3 className="text-3xl font-bold font-serif text-emerald-950 mb-4">
                  {data.featuredCharity.name}
                </h3>
                <p className="text-emerald-800/60 leading-relaxed mb-8 line-clamp-4">
                  {data.featuredCharity.description}
                </p>
                <Link
                  href={`/charities/${data.featuredCharity.id}`}
                  className="inline-block w-fit px-6 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition shadow-md hover:-translate-y-0.5"
                  id="charity-spotlight-cta"
                >
                  Learn About Their Impact →
                </Link>
              </div>
              <div className="relative min-h-[300px] bg-emerald-100">
                {data.featuredCharity.image_url ? (
                  <img
                    src={data.featuredCharity.image_url}
                    alt={data.featuredCharity.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] font-serif font-bold text-emerald-200/50 select-none">
                      {data.featuredCharity.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Fallback — no featured charity in DB yet */
            <div className="fade-in-scale delay-200 grid md:grid-cols-2 gap-0 bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 shadow-xl max-w-4xl mx-auto">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-5">
                  Featured Partner
                </span>
                <h3 className="text-3xl font-bold font-serif text-emerald-950 mb-4">
                  Making Real Impact
                </h3>
                <p className="text-emerald-800/60 leading-relaxed mb-8">
                  Every subscription powers verified charitable organizations. From youth education to local community projects,
                  your golf scores directly fund meaningful change. Choose your cause when you sign up.
                </p>
                <Link
                  href="/charities"
                  className="inline-block w-fit px-6 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition shadow-md hover:-translate-y-0.5"
                >
                  Explore All Charities →
                </Link>
              </div>
              <div className="relative min-h-[300px] bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-emerald-300/60 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-emerald-600/40 font-serif font-bold text-lg">Choose Your Cause</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS / SOCIAL PROOF
          ═══════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-6 bg-stone-50 relative overflow-hidden" id="testimonials">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
              Community voices
            </p>
            <h2 className="fade-in-up delay-100 text-4xl sm:text-5xl font-bold font-serif text-emerald-950">
              What our members say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`fade-in-up delay-${(i + 1) * 100} bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-emerald-800/70 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">{t.name}</p>
                    <p className="text-xs text-emerald-800/40">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA BANNER
          ═══════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-6 bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 text-white relative overflow-hidden" id="final-cta">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="fade-in-up text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            Ready to play for{" "}
            <span className="gradient-text-warm">something bigger?</span>
          </h2>
          <p className="fade-in-up delay-100 mt-6 text-lg text-emerald-100/60 max-w-xl mx-auto">
            Join a community of golfers turning their passion into charitable impact.
            From £9.99/month.
          </p>
          <div className="fade-in-up delay-200 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="px-10 py-5 bg-white text-emerald-950 font-bold text-lg rounded-2xl hover:bg-stone-100 hover:-translate-y-0.5 transition-all shadow-xl w-full sm:w-auto"
              id="final-cta-button"
            >
              Become a Member
            </Link>
            <Link
              href="/about"
              className="px-10 py-5 border border-emerald-700 text-emerald-200 font-semibold text-lg rounded-2xl hover:border-emerald-500 hover:text-white hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PublicLayout>
  );
}

const testimonials = [
  {
    quote: "I was skeptical at first, but seeing my subscription directly funding a local youth charity made me feel genuinely proud. The draw is just a bonus!",
    name: "James W.",
    initials: "JW",
    detail: "Member since 2025 · Handicap 14",
  },
  {
    quote: "Finally, a reason to actually log my scores. The platform is beautiful, and knowing part of my fee helps charities keeps me coming back every month.",
    name: "Sarah M.",
    initials: "SM",
    detail: "Member since 2025 · Handicap 22",
  },
  {
    quote: "Won £45 in my second month and my chosen charity got funded too. It's the most rewarding competition I've ever been part of.",
    name: "David R.",
    initials: "DR",
    detail: "Member since 2025 · Handicap 8",
  },
];
