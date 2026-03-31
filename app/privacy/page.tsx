import { PublicLayout } from "@/components/layout/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Swing for Change",
  description: "How we collect, use, and protect your personal data on Swing for Change.",
};

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-stone-50 font-sans text-emerald-950">
        <div className="pt-36 pb-24 px-6 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-emerald-950 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-emerald-800/40 mb-12">
            Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">1. Information We Collect</h2>
              <p className="text-emerald-800/60 leading-relaxed mb-3">
                When you create an account, we collect your name, email address, and payment information
                (processed securely via Stripe). When you use the platform, we collect your submitted
                golf scores and charity preferences.
              </p>
              <p className="text-emerald-800/60 leading-relaxed">
                We also automatically collect usage data such as browser type, device information,
                and pages visited to improve our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">2. How We Use Your Information</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                Your information is used to: manage your subscription and account, process draw entries
                and prize payouts, direct charitable contributions to your chosen organization,
                communicate important platform updates, and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">3. Data Sharing</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                We do not sell your personal data. We share limited information with: Stripe for payment
                processing, Supabase for secure data storage, and partner charities (only your
                contribution amount, never personal details, unless you opt in).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">4. Data Security</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                We implement industry-standard security measures including encrypted data transmission
                (TLS), secure authentication, and regular security audits. Payment data is handled
                entirely by Stripe and never touches our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">5. Your Rights</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                You have the right to access, correct, or delete your personal data at any time.
                You may also request a copy of all data we hold about you. To exercise these rights,
                contact us at privacy@swingforchange.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">6. Cookies</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                We use essential cookies to maintain your session and preferences. We do not use
                third-party tracking cookies. Analytics cookies are only used with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">7. Changes to This Policy</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                We may update this policy from time to time. Material changes will be communicated
                via email. Continued use of the platform after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-emerald-950 mb-3">8. Contact Us</h2>
              <p className="text-emerald-800/60 leading-relaxed">
                If you have questions about this privacy policy, contact us at
                privacy@swingforchange.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
