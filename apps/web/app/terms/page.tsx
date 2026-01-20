import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Clarus Vitae',
  description:
    'Terms and conditions governing your use of the Clarus Vitae platform for wellness intelligence and research.',
};

/**
 * Terms of Service Page
 *
 * Comprehensive terms of service reflecting the platform's commitment to
 * transparency, editorial independence, and user protection.
 */
export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-clarus-navy py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Clear terms for a transparent platform.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-16">
        {/* Introduction */}
        <section className="prose prose-slate max-w-none">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Agreement to Terms
          </h2>
          <p className="text-slate">
            Welcome to Clarus Vitae. By accessing or using our platform at
            clarusvitae.com (&quot;the Platform&quot;), you agree to be bound by these Terms
            of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do
            not use the Platform.
          </p>
          <p className="text-slate">
            Clarus Vitae provides wellness intelligence and research services. We
            are not a healthcare provider, and nothing on our platform constitutes
            medical advice. Our service helps you make informed decisions about
            wellness destinations—decisions you should always discuss with qualified
            healthcare professionals.
          </p>
        </section>

        {/* What We Provide */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            What We Provide
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Wellness Intelligence
              </h3>
              <p className="mt-1 text-sm text-slate">
                Independent research, analysis, and evaluation of wellness
                destinations worldwide using our proprietary Clarus Index
                methodology.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Research Tools
              </h3>
              <p className="mt-1 text-sm text-slate">
                Search, filter, and compare properties based on your specific
                criteria, including treatments, diagnostics, and outcomes data.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Inquiry Facilitation
              </h3>
              <p className="mt-1 text-sm text-slate">
                Secure transmission of your inquiries to properties you select.
                We facilitate the connection; properties handle all booking and
                transactions directly.
              </p>
            </div>
          </div>
        </section>

        {/* What We Don't Provide */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            What We Don&apos;t Provide
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              'Medical advice or diagnosis',
              'Treatment recommendations',
              'Booking or reservation services',
              'Financial or insurance advice',
              'Guarantees of treatment outcomes',
              'Endorsement of specific treatments',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-alert-amber/20 bg-alert-amber/5 p-3"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-alert-amber"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-clarus-navy">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Editorial Independence
          </h2>
          <div className="mt-6 rounded-lg border border-verification-green/30 bg-verification-green/5 p-6">
            <p className="text-slate">
              <strong className="text-clarus-navy">Our assessments are independent.</strong>{' '}
              Properties cannot pay for inclusion, ranking, or favorable coverage.
              Our Clarus Index scores reflect our methodology, not commercial
              relationships. When we have partnerships with properties (for inquiry
              facilitation or affiliate arrangements), these are clearly disclosed
              and do not influence our editorial assessments.
            </p>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Your Responsibilities
          </h2>
          <p className="mt-4 text-slate">
            When using the Platform, you agree to:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>Provide accurate information in inquiries and reviews</li>
            <li>Use the Platform for personal research purposes only</li>
            <li>Not scrape, copy, or reproduce our content without permission</li>
            <li>Not attempt to manipulate reviews or ratings</li>
            <li>Consult qualified healthcare professionals before making health decisions</li>
            <li>Respect the intellectual property rights of Clarus Vitae and listed properties</li>
          </ul>
        </section>

        {/* Reviews and User Content */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Reviews and User Content
          </h2>
          <p className="mt-4 text-slate">
            If you submit reviews or other content to the Platform:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>You retain ownership of your content</li>
            <li>
              You grant us a license to display, distribute, and use your content
              on the Platform
            </li>
            <li>
              You confirm your reviews are based on genuine experiences
            </li>
            <li>
              You agree not to submit false, misleading, or defamatory content
            </li>
            <li>
              We may remove content that violates these Terms or our guidelines
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate">
            Team member reviews are clearly identified and may include additional
            verification information about visit circumstances.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Intellectual Property
          </h2>
          <p className="mt-4 text-slate">
            The Platform, including our Clarus Index methodology, scoring systems,
            content, design, and software, is protected by intellectual property
            laws. You may not:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>Copy, modify, or distribute our proprietary content</li>
            <li>Use automated systems to scrape or extract data</li>
            <li>Reproduce our methodology or scoring systems</li>
            <li>Use our trademarks without written permission</li>
          </ul>
          <p className="mt-4 text-slate">
            Property descriptions, images, and related content may be subject to
            the intellectual property rights of respective properties.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Disclaimers
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-stone bg-warm-gray p-4">
              <h3 className="font-medium text-clarus-navy">
                Not Medical Advice
              </h3>
              <p className="mt-1 text-sm text-slate">
                Content on this Platform is for informational purposes only and
                does not constitute medical advice, diagnosis, or treatment. Always
                consult with qualified healthcare providers before making health
                decisions.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-warm-gray p-4">
              <h3 className="font-medium text-clarus-navy">
                No Guarantees
              </h3>
              <p className="mt-1 text-sm text-slate">
                While we strive for accuracy, we cannot guarantee that all
                information is current, complete, or error-free. Property details,
                pricing, and availability may change without notice.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-warm-gray p-4">
              <h3 className="font-medium text-clarus-navy">
                Third-Party Services
              </h3>
              <p className="mt-1 text-sm text-slate">
                We are not responsible for the services, policies, or practices of
                properties listed on our Platform. Your interactions with properties
                are governed by their terms and policies.
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Limitation of Liability
          </h2>
          <p className="mt-4 text-slate">
            To the maximum extent permitted by law, Clarus Vitae and its officers,
            directors, employees, and agents shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from
            your use of the Platform, including but not limited to:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>Decisions made based on Platform content</li>
            <li>Experiences at properties listed on the Platform</li>
            <li>Interruptions or errors in Platform availability</li>
            <li>Loss of data or unauthorized access</li>
          </ul>
        </section>

        {/* Indemnification */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Indemnification
          </h2>
          <p className="mt-4 text-slate">
            You agree to indemnify and hold harmless Clarus Vitae from any claims,
            damages, losses, or expenses (including reasonable legal fees) arising
            from your use of the Platform, your violation of these Terms, or your
            violation of any third-party rights.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Changes to Terms
          </h2>
          <p className="mt-4 text-slate">
            We may update these Terms from time to time. We will notify you of
            material changes by posting the updated Terms on the Platform with a
            new &quot;Last updated&quot; date. Your continued use of the Platform after
            changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Governing Law
          </h2>
          <p className="mt-4 text-slate">
            These Terms are governed by and construed in accordance with applicable
            laws. Any disputes arising from these Terms or your use of the Platform
            shall be resolved through good-faith negotiation, and if necessary,
            binding arbitration.
          </p>
        </section>

        {/* Severability */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Severability
          </h2>
          <p className="mt-4 text-slate">
            If any provision of these Terms is found to be unenforceable, the
            remaining provisions will continue in full force and effect.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-12 rounded-lg border border-stone bg-warm-gray p-6">
          <h2 className="font-display text-xl font-medium text-clarus-navy">
            Questions About These Terms?
          </h2>
          <p className="mt-2 text-slate">
            If you have any questions about these Terms of Service, please contact
            us:
          </p>
          <p className="mt-4">
            <a
              href="mailto:legal@clarusvitae.com"
              className="font-medium text-clarus-navy hover:underline"
            >
              legal@clarusvitae.com
            </a>
          </p>
        </section>

        {/* Related Links */}
        <section className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-md border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-clarus-navy/5 transition-colors"
          >
            Privacy Policy
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/about/methodology"
            className="inline-flex items-center gap-2 rounded-md border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-clarus-navy/5 transition-colors"
          >
            Our Methodology
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </section>

        {/* Last Updated */}
        <footer className="mt-12 border-t border-stone pt-8">
          <p className="text-sm text-slate">
            These Terms of Service were last updated in January 2026. We recommend
            reviewing this page periodically for any changes.
          </p>
        </footer>
      </article>
    </main>
  );
}
