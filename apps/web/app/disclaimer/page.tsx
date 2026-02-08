import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Clarus Vitae',
  description:
    'Important information about the nature of content on Clarus Vitae. We are an independent research platform, not a medical provider.',
};

/**
 * Medical Disclaimer Page
 *
 * Professional disclaimer clarifying Clarus Vitae's role as an independent
 * research platform and the nature of medical/wellness claims on the site.
 */
export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-clarus-navy py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            Medical Disclaimer
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Important information about the nature of content on this platform.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-16">
        {/* Independent Research Platform */}
        <section className="prose prose-slate max-w-none">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Independent Research Platform
          </h2>
          <p className="text-slate">
            Clarus Vitae is an independent research and editorial platform. We are
            not a medical provider, healthcare facility, or clinical practice. We do
            not diagnose, treat, cure, or prevent any disease or medical condition.
            Our role is to research, assess, and present information about wellness
            and longevity destinations to help you make informed decisions.
          </p>
          <p className="text-slate">
            Clarus Vitae does not employ, retain, or contract physicians, medical
            practitioners, or clinical staff. We operate independently from the
            properties and retreats featured on this platform.
          </p>
        </section>

        {/* Medical & Wellness Claims */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Medical &amp; Wellness Claims
          </h2>
          <p className="mt-4 text-slate">
            All medical claims, treatment descriptions, clinical outcomes, and
            wellness assertions presented on this platform originate from the
            retreats&apos; own clinical teams, their published research, and publicly
            available scientific literature. While we endeavour to present this
            information accurately, Clarus Vitae does not independently verify every
            clinical claim made by featured properties.
          </p>
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-50 p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-amber-800">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Important
            </h3>
            <p className="mt-2 text-amber-900">
              The information on this platform should not be used as a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the
              guidance of a qualified healthcare professional with any questions you
              may have regarding a medical condition or treatment option.
            </p>
          </div>
        </section>

        {/* The Clarus Index */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            The Clarus Index
          </h2>
          <p className="mt-4 text-slate">
            The Clarus Index is a proprietary research-based assessment methodology
            developed to evaluate and compare wellness and longevity destinations. It
            is an editorial and analytical tool—not a medical assessment, clinical
            recommendation, or endorsement of any specific treatment or provider.
          </p>
          <p className="mt-4 text-slate">
            Scores and ratings reflect our editorial team&apos;s research-driven
            evaluation of properties across standardised criteria. They are intended
            to inform your research, not to serve as medical guidance. A high or low
            score does not constitute a recommendation for or against any particular
            treatment, programme, or facility.
          </p>
        </section>

        {/* Your Responsibility */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Your Responsibility
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                title: 'Consult Qualified Professionals',
                description:
                  'Before making any decisions about medical treatments, wellness programmes, or health-related travel, consult with qualified healthcare professionals who can assess your individual circumstances.',
              },
              {
                title: 'Conduct Your Own Due Diligence',
                description:
                  'While we strive for accuracy, we encourage you to independently verify any claims, credentials, or certifications of properties and practitioners before committing to a programme.',
              },
              {
                title: 'Understand the Risks',
                description:
                  'Medical and wellness treatments carry inherent risks. Ensure you fully understand the potential risks, side effects, and contraindications of any treatment before proceeding.',
              },
              {
                title: 'Disclose Your Medical History',
                description:
                  'When engaging with any property or practitioner, provide complete and accurate information about your medical history, current medications, and health conditions.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-stone bg-white p-6"
              >
                <h3 className="font-medium text-clarus-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-slate">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* No Endorsement */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            No Endorsement
          </h2>
          <p className="mt-4 text-slate">
            The inclusion of any property, treatment, or practitioner on this
            platform does not constitute an endorsement, recommendation, or guarantee
            of outcomes. Our editorial assessments are based on research and publicly
            available information and are provided for informational purposes only.
          </p>
          <p className="mt-4 text-slate">
            Clarus Vitae is not responsible for the actions, services, or outcomes of
            any property or practitioner featured on this platform. Any arrangements
            made between you and a featured property are solely between those parties.
          </p>
        </section>

        {/* External Links & Third-Party Content */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            External Links &amp; Third-Party Content
          </h2>
          <p className="mt-4 text-slate">
            This platform may contain links to external websites, research papers,
            and third-party content. Clarus Vitae does not control and is not
            responsible for the content, accuracy, or practices of any third-party
            sites or resources.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-12 rounded-lg border border-stone bg-warm-gray p-6">
          <h2 className="font-display text-xl font-medium text-clarus-navy">
            Questions?
          </h2>
          <p className="mt-2 text-slate">
            If you have questions about this disclaimer or the nature of content on
            our platform, please contact us:
          </p>
          <p className="mt-4">
            <a
              href="mailto:info@clarusvitae.com"
              className="font-medium text-clarus-navy hover:underline"
            >
              info@clarusvitae.com
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-stone pt-8">
          <p className="text-sm text-slate">
            This disclaimer was last updated in January 2026. We may update this
            disclaimer from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>
          <p className="mt-4 text-sm text-slate">
            See also our{' '}
            <Link href="/privacy" className="text-clarus-navy hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-clarus-navy hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}
