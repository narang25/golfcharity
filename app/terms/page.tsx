import { PublicLayout } from "@/components/layout/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Swing for Change",
  description: "Terms and conditions governing the use of the Swing for Change platform.",
};

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-stone-50 font-sans text-emerald-950">
        <div className="pt-36 pb-24 px-6 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-emerald-950 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-emerald-800/40 mb-12">
            Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">1. Acceptance of Terms</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                By creating an account or using the Swing for Change platform (&quot;Service&quot;), you agree
                to be bound by these Terms of Service. If you do not agree, you may not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">2. Eligibility</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                You must be at least 18 years old and legally capable of entering into binding agreements
                to use the Service. By registering, you confirm you meet these requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">3. Subscriptions & Billing</h2>
              <p className="text-emerald-800/60 leading-relaxed mb-3">
                The Service operates on a subscription basis. Billing occurs at the start of each
                billing period (monthly or annually). All fees are in GBP and are non-refundable
                unless otherwise required by law.
              </p>
              <p className="text-emerald-800/60 leading-relaxed">
                You may cancel your subscription at any time. Cancellation takes effect at the end
                of the current billing period, and you will retain access until then.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">4. Prize Draws</h2>
              <p className="text-emerald-800/60 leading-relaxed mb-3">
                Prize draws are conducted monthly using an algorithmic selection process. Entry is
                automatic for all active subscribers who have submitted at least one valid score.
                Prize amounts are calculated from 20% of the month&apos;s active subscription
                revenue.
              </p>
              <p className="text-emerald-800/60 leading-relaxed">
                We reserve the right to modify draw rules, prize structures, or frequency with
                reasonable notice to subscribers. Unclaimed prizes after 90 days will be
                donated to charity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">5. Score Submissions</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                You are responsible for the accuracy of your submitted scores. Deliberately
                submitting false scores may result in disqualification from draws and account
                termination. We reserve the right to investigate and verify scores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">6. Charitable Contributions</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                A portion of each subscription is allocated to the charity you select. Swing for
                Change acts as a facilitator and is not itself a registered charity. We make
                reasonable efforts to ensure all partner charities are legitimate and verified.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">7. Prohibited Conduct</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                You may not: attempt to manipulate draws or scores, create multiple accounts,
                use automated systems to interact with the Service, or engage in any activity
                that disrupts or undermines the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">8. Limitation of Liability</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                To the maximum extent permitted by law, Swing for Change shall not be liable for
                any indirect, incidental, or consequential damages arising from your use of the
                Service. Our total liability shall not exceed the amount you paid in the 12
                months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">9. Modifications</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                We may modify these terms at any time. Material changes will be communicated
                via email at least 30 days before taking effect. Your continued use constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">10. Governing Law</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                These terms are governed by the laws of England and Wales. Any disputes shall
                be resolved in the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">11. Contact</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                Questions about these terms? Contact us at legal@swingforchange.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
