"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { useScrollAnimation } from "@/lib/hooks";

export default function HowItWorksPage() {
  const containerRef = useScrollAnimation();

  return (
    <PublicLayout>
      <div ref={containerRef} className="min-h-screen bg-stone-50 font-sans text-emerald-950">

        {/* Hero */}
        <section className="relative pt-36 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <p className="fade-in-up text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
              The full breakdown
            </p>
            <h1 className="fade-in-up delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-[1.08]">
              How Swing for Change{" "}
              <span className="gradient-text">works</span>
            </h1>
            <p className="fade-in-up delay-200 mt-8 text-xl text-emerald-800/60 max-w-2xl mx-auto leading-relaxed">
              From entering your first score to funding a charity — here&apos;s
              exactly how the platform operates, step by step.
            </p>
          </div>
        </section>

        {/* Step-by-step Expanded */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Vertical connector */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[27px] top-[76px] bottom-0 w-px bg-gradient-to-b from-emerald-200 to-stone-100 hidden md:block" />
                )}

                <div className={`fade-in-up delay-${Math.min((i + 1) * 100, 300)} flex gap-6 md:gap-10 pb-16 md:pb-20`}>
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-serif ${
                      step.accent === "amber"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {i + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-emerald-800/60 leading-relaxed mb-6 max-w-xl">{step.description}</p>

                    {/* Detail cards */}
                    {step.details && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {step.details.map((d, j) => (
                          <div
                            key={j}
                            className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-emerald-200 transition"
                          >
                            <p className="text-sm font-bold text-emerald-950 mb-1">{d.label}</p>
                            <p className="text-xs text-emerald-800/50 leading-relaxed">{d.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="fade-in-up text-3xl sm:text-4xl font-bold font-serif text-emerald-950 text-center mb-16">
              Common Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`fade-in-up delay-${Math.min((i + 1) * 100, 300)} bg-stone-50 rounded-2xl p-6 border border-stone-100`}
                >
                  <h3 className="font-bold text-emerald-950 mb-2">{faq.q}</h3>
                  <p className="text-sm text-emerald-800/60 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-emerald-950 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-3xl" />
          </div>
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="fade-in-up text-4xl sm:text-5xl font-bold font-serif text-white">
              Simple enough?
            </h2>
            <p className="fade-in-up delay-100 mt-5 text-lg text-emerald-100/60">
              Get started in under 2 minutes. Your first score could be your lucky number.
            </p>
            <div className="fade-in-up delay-200 mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/pricing"
                className="px-10 py-5 bg-white text-emerald-950 font-bold text-lg rounded-2xl hover:bg-stone-100 hover:-translate-y-0.5 transition-all shadow-xl"
              >
                Start Your Membership
              </Link>
              <Link
                href="/charities"
                className="px-10 py-5 border border-emerald-700 text-emerald-200 font-semibold text-lg rounded-2xl hover:border-emerald-500 hover:text-white hover:-translate-y-0.5 transition-all"
              >
                Browse Charities
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

const steps = [
  {
    title: "Subscribe & Choose Your Charity",
    accent: "emerald",
    description:
      "Pick a monthly or yearly plan starting at £9.99. During signup, choose a verified charity where a portion of your subscription will be directed every single month.",
    details: [
      { label: "Monthly Plan", text: "£9.99/month — full access to all draws and score tracking." },
      { label: "Yearly Plan", text: "£99.99/year — save ~17%, same benefits, maximum impact." },
    ],
  },
  {
    title: "Enter Your Stableford Scores",
    accent: "amber",
    description:
      "After each round, log your Stableford score. You can keep up to 5 active scores at a time in a rolling window. Your oldest score drops off when you add a new one.",
    details: [
      { label: "Rolling Window", text: "5-score maximum. Always keeps your most recent entries active." },
      { label: "Score Range", text: "Any Stableford score from 1-45 qualifies as a valid draw entry." },
    ],
  },
  {
    title: "Monthly Draw",
    accent: "amber",
    description:
      "At the end of each month, 5 winning numbers are algorithmically drawn from the pool of all submitted scores. Your active scores are automatically matched against them.",
    details: [
      { label: "5/5 Match — Jackpot", text: "The big one. If nobody wins, the jackpot rolls over and grows." },
      { label: "4/5 Match — Runner-up", text: "Shared among all 4-match winners that month." },
      { label: "3/5 Match — Community", text: "Shared among all 3-match winners that month." },
      { label: "Algorithm Fairness", text: "Winning numbers are weighted toward common scores, increasing collective win rates." },
    ],
  },
  {
    title: "Prizes & Payouts",
    accent: "emerald",
    description:
      "Winners are notified immediately after the draw. Prize money is calculated from 20% of the month's active subscription revenue and split across the three tiers.",
    details: [
      { label: "40% → Jackpot", text: "All-or-nothing 5/5 match. Rolls over if unclaimed." },
      { label: "35% → Runner-up Pot", text: "Divided equally among all 4/5 match winners." },
    ],
  },
  {
    title: "Charity Gets Funded",
    accent: "emerald",
    description:
      "Simultaneously, 30% of all subscription revenue flows directly to the charities chosen by members. Every month, real money reaches real organizations making real change.",
    details: [
      { label: "Verified Partners", text: "All charities undergo verification before joining the directory." },
      { label: "Transparent Tracking", text: "View contribution totals and impact on your dashboard." },
    ],
  },
];

const faqs = [
  {
    q: "Do I need to be a good golfer?",
    a: "Not at all. Any Stableford score enters you into the draw equally. The system is designed so that recreational and experienced golfers have similar chances.",
  },
  {
    q: "How are winning numbers selected?",
    a: "We use an algorithmic draw that weighs common scores more heavily. This means winning numbers tend to be scores that many people actually submit, increasing the chance of matches across the community.",
  },
  {
    q: "What happens if nobody wins the jackpot?",
    a: "The jackpot rolls over to the next month, stacking on top of the new prize pool. This means bigger prizes as months go by without a 5/5 match.",
  },
  {
    q: "Can I change my chosen charity?",
    a: "Yes, you can update your charity selection at any time from your dashboard. Your next contribution will go to the newly selected charity.",
  },
  {
    q: "How do I know the charities are legitimate?",
    a: "Every charity in our directory is verified before being listed. We partner with trusted organizations with demonstrable track records of impact.",
  },
];
