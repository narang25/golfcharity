"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { useScrollAnimation } from "@/lib/hooks";

export default function AboutPage() {
  const containerRef = useScrollAnimation();

  return (
    <PublicLayout>
      <div ref={containerRef} className="min-h-screen bg-stone-50 font-sans text-emerald-950">

        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-amber-50/60 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
              Our Story
            </p>
            <h1 className="fade-in-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-[1.08]">
              Golf that gives{" "}
              <span className="gradient-text">back.</span>
            </h1>
            <p className="fade-in-up delay-200 mt-8 text-xl text-emerald-800/60 max-w-2xl leading-relaxed">
              Swing for Change was built on a simple belief: every golfer&apos;s
              passion can be a force for real-world good. We connect the game
              you love with the causes that matter most.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="fade-in-left text-3xl sm:text-4xl font-bold font-serif text-emerald-950 mb-6">
                Our Mission
              </h2>
              <p className="fade-in-left delay-100 text-emerald-800/60 leading-relaxed mb-5">
                We believe that competition and compassion aren&apos;t mutually
                exclusive. Swing for Change transforms the routine of logging
                golf scores into a collective engine for charitable impact.
              </p>
              <p className="fade-in-left delay-200 text-emerald-800/60 leading-relaxed">
                Every subscription splits into three streams: a prize pool that
                rewards your performance, a direct contribution to a verified
                charity of your choosing, and platform sustainability to keep
                the ecosystem growing.
              </p>
            </div>
            <div className="fade-in-right delay-200">
              <div className="bg-stone-50 rounded-3xl p-10 border border-stone-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-950 mb-1">20% Prize Pool</h3>
                      <p className="text-sm text-emerald-800/50">Rewarding top scorers with monthly cash prizes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-950 mb-1">30% Charity Fund</h3>
                      <p className="text-sm text-emerald-800/50">Directly to the verified charity you selected.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-950 mb-1">50% Platform</h3>
                      <p className="text-sm text-emerald-800/50">Operations, development, and growing the impact.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6 bg-stone-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="fade-in-up text-3xl sm:text-4xl font-bold font-serif text-emerald-950 text-center mb-16">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Transparency",
                  desc: "Every penny is tracked. See exactly where your subscription goes, which charities receive funds, and how draws are calculated.",
                  icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                },
                {
                  title: "Community",
                  desc: "Golf is better together. We're building a community where competition drives collective good, not individual gain alone.",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                },
                {
                  title: "Impact",
                  desc: "We partner only with verified charitable organizations making measurable, real-world differences in their communities.",
                  icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((v, i) => (
                <div key={v.title} className={`fade-in-up delay-${(i + 1) * 100} bg-white rounded-3xl p-8 border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-500`}>
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-emerald-950 mb-3">{v.title}</h3>
                  <p className="text-sm text-emerald-800/50 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="fade-in-up text-4xl sm:text-5xl font-bold font-serif">
              Join the movement
            </h2>
            <p className="fade-in-up delay-100 mt-5 text-lg text-emerald-100/60">
              Every round you play can change a life. Start making your scores count.
            </p>
            <Link
              href="/pricing"
              className="fade-in-up delay-200 inline-block mt-10 px-10 py-5 bg-white text-emerald-950 font-bold text-lg rounded-2xl hover:bg-stone-100 hover:-translate-y-0.5 transition-all shadow-xl"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
