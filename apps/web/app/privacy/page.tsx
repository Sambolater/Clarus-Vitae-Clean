import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Clarus Vitae',
  description:
    'Our commitment to your privacy. Learn how we protect your data and respect your privacy while you research wellness destinations.',
};

/**
 * Privacy Policy Page
 *
 * Comprehensive privacy policy that reflects the platform's privacy-first approach.
 * Clear, accessible language explaining data practices.
 */
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-clarus-navy py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Your privacy is foundational to our platform, not an afterthought.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-16">
        {/* Our Commitment */}
        <section className="prose prose-slate max-w-none">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Our Commitment
          </h2>
          <p className="text-slate">
            Clarus Vitae is built on a fundamental principle: your privacy matters. We
            understand that you may be researching sensitive health topics—addiction
            recovery, weight management, mental health, aging concerns, or performance
            optimization you prefer to keep private. That&apos;s why privacy isn&apos;t just a
            feature; it&apos;s the foundation of our platform.
          </p>
          <p className="text-slate">
            We&apos;ve designed our platform so you can research with complete confidence.
            You don&apos;t need to create an account. You don&apos;t need to accept cookies. You
            can browse our entire site in Research Mode—completely private, with no
            tracking whatsoever.
          </p>
        </section>

        {/* What We Collect */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            What We Collect
          </h2>

          <div className="mt-6 rounded-lg border border-verification-green/30 bg-verification-green/5 p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-verification-green">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              When Browsing (Research Mode - Default)
            </h3>
            <p className="mt-2 text-slate">
              <strong className="text-clarus-navy">Nothing.</strong> No cookies, no
              tracking, no data collection. You can browse our entire site—view
              properties, compare treatments, read reviews—without us collecting any
              information about you.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-stone bg-white p-6">
            <h3 className="text-lg font-medium text-clarus-navy">
              When You Submit an Inquiry
            </h3>
            <p className="mt-2 text-slate">
              Only when you actively choose to contact a property do we collect:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate">
              <li>Name and email (required)</li>
              <li>Phone number (optional)</li>
              <li>Your message to the property</li>
              <li>Which property you&apos;re interested in</li>
            </ul>
            <p className="mt-4 text-sm text-slate">
              All personal information is encrypted with AES-256 encryption before
              storage.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-stone bg-white p-6">
            <h3 className="text-lg font-medium text-clarus-navy">
              When You Create an Account (Optional)
            </h3>
            <p className="mt-2 text-slate">
              If you choose to create an account (not required), we store:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-slate">
              <li>Email address</li>
              <li>Saved properties and comparisons</li>
              <li>Your preference settings</li>
            </ul>
          </div>
        </section>

        {/* What We DON'T Do */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            What We DON&apos;T Do
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              'Sell your data to anyone, ever',
              'Share with data brokers',
              'Share with insurance companies',
              'Use retargeting ads',
              'Track you across other websites',
              'Use Facebook Pixel or Google Analytics',
              'Fingerprint your browser',
              'Store unencrypted personal data',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-error-red/20 bg-error-red/5 p-3"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-error-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-clarus-navy">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How We Protect Your Data */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            How We Protect Your Data
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                AES-256 Encryption
              </h3>
              <p className="mt-1 text-sm text-slate">
                All personal information is encrypted with military-grade AES-256-GCM
                encryption before storage. Even in the unlikely event of a data
                breach, your information would be unreadable.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Secure Infrastructure
              </h3>
              <p className="mt-1 text-sm text-slate">
                Our servers are hosted in secure facilities with SOC 2 compliance.
                All data transmission uses TLS 1.3 encryption.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Minimal Data Retention
              </h3>
              <p className="mt-1 text-sm text-slate">
                We only keep data as long as necessary. Inquiry data is automatically
                deleted after 90 days unless you have an active conversation with a
                property.
              </p>
            </div>
            <div className="rounded-lg border border-stone bg-white p-4">
              <h3 className="font-medium text-clarus-navy">
                Regular Security Audits
              </h3>
              <p className="mt-1 text-sm text-slate">
                We conduct regular security assessments and penetration testing to
                ensure your data remains protected.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Your Rights
          </h2>
          <p className="mt-4 text-slate">
            You have complete control over your data. These rights apply globally,
            regardless of where you live—we don&apos;t limit them to EU residents.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-clarus-navy/20 bg-clarus-navy/5 p-4">
              <h3 className="font-medium text-clarus-navy">Right to Access</h3>
              <p className="mt-1 text-sm text-slate">
                See all data we have about you at any time.
              </p>
            </div>
            <div className="rounded-lg border border-clarus-navy/20 bg-clarus-navy/5 p-4">
              <h3 className="font-medium text-clarus-navy">Right to Export</h3>
              <p className="mt-1 text-sm text-slate">
                Download all your data in a portable format (JSON/CSV).
              </p>
            </div>
            <div className="rounded-lg border border-clarus-navy/20 bg-clarus-navy/5 p-4">
              <h3 className="font-medium text-clarus-navy">Right to Delete</h3>
              <p className="mt-1 text-sm text-slate">
                One-click complete deletion of all your data.
              </p>
            </div>
            <div className="rounded-lg border border-clarus-navy/20 bg-clarus-navy/5 p-4">
              <h3 className="font-medium text-clarus-navy">Right to Be Forgotten</h3>
              <p className="mt-1 text-sm text-slate">
                Removed from backups within 30 days of deletion request.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/privacy/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-clarus-navy px-6 py-3 text-sm font-medium text-white hover:bg-clarus-navy/90 transition-colors"
            >
              Manage Your Data
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
          </div>
        </section>

        {/* Inquiries & Properties */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Inquiries & Properties
          </h2>
          <p className="mt-4 text-slate">
            When you inquire about a property, here&apos;s exactly what happens:
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-sm font-medium text-white">
                1
              </div>
              <div>
                <h3 className="font-medium text-clarus-navy">
                  You Submit Your Inquiry
                </h3>
                <p className="mt-1 text-sm text-slate">
                  Your information is immediately encrypted and stored securely.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-sm font-medium text-white">
                2
              </div>
              <div>
                <h3 className="font-medium text-clarus-navy">
                  We Share With the Property
                </h3>
                <p className="mt-1 text-sm text-slate">
                  Only your name, contact information, and message are shared with
                  the specific property you selected.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-sm font-medium text-white">
                3
              </div>
              <div>
                <h3 className="font-medium text-clarus-navy">
                  What We DON&apos;T Share
                </h3>
                <p className="mt-1 text-sm text-slate">
                  Your browsing history, other properties viewed, comparison lists,
                  or any other activity on our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Secure Inquiry Option */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Secure Inquiry Option
          </h2>
          <p className="mt-4 text-slate">
            For maximum privacy, we offer a secure inquiry channel with additional
            protections:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>Option to use Signal for communication</li>
            <li>No logging of request contents on our servers</li>
            <li>Automatic deletion after property contact</li>
            <li>Option for secure callback instead of email</li>
          </ul>
        </section>

        {/* Analytics */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Analytics
          </h2>
          <p className="mt-4 text-slate">
            If you choose to enable analytics (off by default), we use self-hosted
            Plausible Analytics, which:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate">
            <li>Does not use cookies</li>
            <li>Does not collect personal data</li>
            <li>Does not track across sites</li>
            <li>Only provides aggregate, anonymous metrics</li>
            <li>Is hosted on our own servers, not shared with third parties</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mt-12 rounded-lg border border-stone bg-warm-gray p-6">
          <h2 className="font-display text-xl font-medium text-clarus-navy">
            Questions About Privacy?
          </h2>
          <p className="mt-2 text-slate">
            We&apos;re committed to transparency. If you have any questions about our
            privacy practices, please contact us:
          </p>
          <p className="mt-4">
            <a
              href="mailto:privacy@clarusvitae.com"
              className="font-medium text-clarus-navy hover:underline"
            >
              privacy@clarusvitae.com
            </a>
          </p>
        </section>

        {/* Last Updated */}
        <footer className="mt-12 border-t border-stone pt-8">
          <p className="text-sm text-slate">
            This privacy policy was last updated in January 2026. We will notify
            users of any material changes to this policy via email (if you&apos;ve
            provided one) or through a prominent notice on our website.
          </p>
        </footer>
      </article>
    </main>
  );
}
