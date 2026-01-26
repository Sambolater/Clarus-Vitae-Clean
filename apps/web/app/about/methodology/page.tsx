import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Clarus Index Methodology',
  description:
    'Our proprietary framework for evaluating the world\'s finest wellness destinations. Transparent scoring across five dimensions with tier-specific criteria.',
};

function SectionHeading({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="font-display text-2xl font-medium text-clarus-navy md:text-3xl"
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-xl font-medium text-clarus-navy">
      {children}
    </h3>
  );
}

function DimensionRow({
  name,
  weight,
  description,
}: {
  name: string;
  weight: number;
  description: string;
}) {
  return (
    <tr className="border-b border-stone">
      <td className="py-4 pr-4">
        <span className="font-medium text-clarus-navy">{name}</span>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="inline-flex h-8 w-12 items-center justify-center rounded bg-clarus-navy text-sm font-medium text-white">
          {weight}%
        </span>
      </td>
      <td className="py-4 pl-4 text-slate">{description}</td>
    </tr>
  );
}

function TierBadge({
  score,
  label,
  bgClass,
  textClass,
}: {
  score: string;
  label: string;
  bgClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${bgClass}`}>
      <div className="flex items-center justify-between">
        <span className={`font-display text-2xl ${textClass}`}>{score}</span>
        <span className={`text-sm font-medium uppercase tracking-wide ${textClass}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Hero Section */}
      <section className="border-b border-stone bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wide text-clarus-gold">
            Transparent Evaluation
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-clarus-navy md:text-5xl">
            The Clarus Index
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate leading-relaxed">
            Our proprietary framework for evaluating the world&apos;s finest wellness
            destinations. Unlike star ratings or crowd-sourced reviews, our scoring is
            based on expert assessment across dimensions that matter for transformative
            health outcomes.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <nav className="sticky top-0 z-10 border-b border-stone bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl overflow-x-auto px-6">
          <ul className="flex gap-8 py-4 text-sm">
            <li>
              <a href="#why-tiers" className="text-slate hover:text-clarus-navy">
                Why Different Tiers
              </a>
            </li>
            <li>
              <a href="#dimensions" className="text-slate hover:text-clarus-navy">
                Scoring Dimensions
              </a>
            </li>
            <li>
              <a href="#how-we-score" className="text-slate hover:text-clarus-navy">
                How We Score
              </a>
            </li>
            <li>
              <a href="#recognition" className="text-slate hover:text-clarus-navy">
                Recognition Awards
              </a>
            </li>
            <li>
              <a href="#independence" className="text-slate hover:text-clarus-navy">
                Our Independence
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Why Different Tiers */}
        <section id="why-tiers" className="scroll-mt-20">
          <SectionHeading>Why Different Tiers?</SectionHeading>
          <p className="mt-4 text-slate leading-relaxed">
            A medical longevity clinic and a luxury destination spa serve different purposes.
            Evaluating them on the same criteria would be meaningless. That&apos;s why we use
            tier-specific scoring that reflects what matters most for each type of wellness
            experience.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-stone p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-verification-green">
                Tier 1
              </span>
              <h4 className="mt-2 font-display text-lg font-medium text-clarus-navy">
                Medical Longevity & Clinical Wellness
              </h4>
              <p className="mt-2 text-sm text-slate">
                Full medical oversight, advanced diagnostics, longevity protocols.
                $20,000-$150,000+ programs.
              </p>
            </div>
            <div className="rounded-lg border border-stone p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-clarus-navy">
                Tier 2
              </span>
              <h4 className="mt-2 font-display text-lg font-medium text-clarus-navy">
                Integrated Wellness Retreats
              </h4>
              <p className="mt-2 text-sm text-slate">
                Medical consultations with holistic approaches. Structured programs
                with measurable outcomes. $5,000-$30,000 programs.
              </p>
            </div>
            <div className="rounded-lg border border-stone p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-clarus-gold">
                Tier 3
              </span>
              <h4 className="mt-2 font-display text-lg font-medium text-clarus-navy">
                Luxury Destination Wellness
              </h4>
              <p className="mt-2 text-sm text-slate">
                Exceptional spa and wellness facilities. Holistic focus on
                relaxation and rejuvenation. $3,000-$15,000 programs.
              </p>
            </div>
          </div>
        </section>

        {/* Scoring Dimensions */}
        <section id="dimensions" className="mt-20 scroll-mt-20">
          <SectionHeading>Scoring Dimensions by Tier</SectionHeading>
          <p className="mt-4 text-slate leading-relaxed">
            Each tier is evaluated on five dimensions, with weights reflecting what
            matters most for that type of wellness experience.
          </p>

          {/* Tier 1 */}
          <div className="mt-10">
            <SubHeading>Tier 1: Medical Longevity & Clinical Wellness</SubHeading>
            <p className="mt-2 text-sm text-slate">
              Properties with full medical oversight and advanced diagnostic capabilities.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-clarus-navy">
                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      Dimension
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate">
                      Weight
                    </th>
                    <th className="py-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      What It Measures
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <DimensionRow
                    name="Clinical Rigor"
                    weight={30}
                    description="Medical credentials, diagnostic depth, evidence-based protocols, physician-to-patient ratios"
                  />
                  <DimensionRow
                    name="Outcome Evidence"
                    weight={25}
                    description="Published results, guest-reported outcomes, follow-up protocols"
                  />
                  <DimensionRow
                    name="Program Depth"
                    weight={20}
                    description="Comprehensiveness, customization capabilities, duration options"
                  />
                  <DimensionRow
                    name="Experience Quality"
                    weight={15}
                    description="Facilities, service standards, accommodation, dining"
                  />
                  <DimensionRow
                    name="Value Alignment"
                    weight={10}
                    description="Price relative to outcomes delivered"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="mt-12">
            <SubHeading>Tier 2: Integrated Wellness Retreats</SubHeading>
            <p className="mt-2 text-sm text-slate">
              Properties combining clinical consultations with holistic wellness approaches.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-clarus-navy">
                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      Dimension
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate">
                      Weight
                    </th>
                    <th className="py-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      What It Measures
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <DimensionRow
                    name="Program Effectiveness"
                    weight={25}
                    description="Guest-reported outcomes, expert assessment of program design"
                  />
                  <DimensionRow
                    name="Holistic Integration"
                    weight={25}
                    description="How well clinical and wellness elements combine into cohesive experience"
                  />
                  <DimensionRow
                    name="Practitioner Quality"
                    weight={20}
                    description="Credentials, experience, guest feedback on individual practitioners"
                  />
                  <DimensionRow
                    name="Experience Quality"
                    weight={20}
                    description="Facilities, service standards, accommodation, dining"
                  />
                  <DimensionRow
                    name="Value Alignment"
                    weight={10}
                    description="Price relative to wellness value provided"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="mt-12">
            <SubHeading>Tier 3: Luxury Destination Wellness</SubHeading>
            <p className="mt-2 text-sm text-slate">
              Exceptional spa and wellness facilities worthy of destination travel.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-clarus-navy">
                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      Dimension
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate">
                      Weight
                    </th>
                    <th className="py-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-slate">
                      What It Measures
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <DimensionRow
                    name="Experience Quality"
                    weight={35}
                    description="Facilities, service excellence, ambiance, accommodation standards"
                  />
                  <DimensionRow
                    name="Wellness Offering Depth"
                    weight={25}
                    description="Range and quality of treatments, practitioner skill"
                  />
                  <DimensionRow
                    name="Transformative Potential"
                    weight={20}
                    description="Ability to create lasting positive change beyond immediate relaxation"
                  />
                  <DimensionRow
                    name="Setting & Environment"
                    weight={10}
                    description="Location quality, natural surroundings, sense of escape"
                  />
                  <DimensionRow
                    name="Value Alignment"
                    weight={10}
                    description="Price relative to luxury experience delivered"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Score Tiers */}
        <section className="mt-20">
          <SubHeading>Score Classification</SubHeading>
          <p className="mt-4 text-slate leading-relaxed">
            Overall scores are classified into tiers that indicate the level of excellence.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TierBadge
              score="90-100"
              label="Exceptional"
              bgClass="bg-clarus-navy"
              textClass="text-clarus-gold"
            />
            <TierBadge
              score="80-89"
              label="Distinguished"
              bgClass="bg-clarus-navy"
              textClass="text-white"
            />
            <TierBadge
              score="70-79"
              label="Notable"
              bgClass="bg-slate"
              textClass="text-white"
            />
            <TierBadge
              score="60-69"
              label="Curated"
              bgClass="bg-stone"
              textClass="text-clarus-navy"
            />
          </div>
        </section>

        {/* How We Score */}
        <section id="how-we-score" className="mt-20 scroll-mt-20">
          <SectionHeading>How We Score</SectionHeading>

          <div className="mt-8">
            <SubHeading>Data Sources</SubHeading>
            <ul className="mt-4 space-y-3">
              {[
                'Comprehensive property research and verification',
                'Verified guest outcome reports',
                'Direct property research and verification',
                'Medical credential verification',
                'Published clinical outcomes (where available)',
                'Proprietary dark data collection',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-4 w-4 flex-shrink-0 text-verification-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-slate">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <SubHeading>What We Don&apos;t Consider</SubHeading>
            <ul className="mt-4 space-y-3">
              {[
                'Advertising spend',
                'Partnership status (partners are held to same standards)',
                'Property age or brand name',
                'Celebrity endorsements',
                'Marketing materials or promotional content',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-4 w-4 flex-shrink-0 text-error-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-slate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recognition Awards */}
        <section id="recognition" className="mt-20 scroll-mt-20">
          <SectionHeading>Recognition Awards</SectionHeading>
          <p className="mt-4 text-slate leading-relaxed">
            Beyond overall scores, we recognize properties that demonstrate exceptional
            qualities in specific areas.
          </p>

          <div className="mt-8 space-y-6">
            <div className="rounded-lg border border-stone p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clarus-gold/10">
                  <svg
                    className="h-5 w-5 text-clarus-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h4 className="font-display text-lg font-medium text-clarus-navy">
                  Editor&apos;s Choice
                </h4>
              </div>
              <p className="mt-3 text-slate">
                Properties that excel in specific categories, such as &quot;Best for Executive
                Burnout,&quot; &quot;Best for Longevity,&quot; or &quot;Best for Post-Surgery
                Recovery.&quot; Selected by our editorial team based on deep expertise.
              </p>
            </div>

            <div className="rounded-lg border border-stone p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-verification-green/10">
                  <svg
                    className="h-5 w-5 text-verification-green"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="font-display text-lg font-medium text-clarus-navy">
                  Verified Excellence
                </h4>
              </div>
              <p className="mt-3 text-slate">
                Properties verified through comprehensive research and guest feedback.
                This designation indicates first-hand verification of the experience
                and outcomes claimed by the property.
              </p>
            </div>

            <div className="rounded-lg border border-stone p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clarus-navy/10">
                  <svg
                    className="h-5 w-5 text-clarus-navy"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                    <path d="M18 6l3-3M21 3v4M21 3h-4" />
                  </svg>
                </div>
                <h4 className="font-display text-lg font-medium text-clarus-navy">
                  Rising Star
                </h4>
              </div>
              <p className="mt-3 text-slate">
                Newer properties showing exceptional promise. These destinations may
                not yet have the track record of established leaders, but demonstrate
                innovation, quality, and potential that warrant attention.
              </p>
            </div>
          </div>
        </section>

        {/* Our Independence */}
        <section id="independence" className="mt-20 scroll-mt-20">
          <SectionHeading>Our Commitment to Independence</SectionHeading>
          <div className="mt-6 rounded-lg border-2 border-clarus-navy bg-clarus-navy/5 p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clarus-navy text-white">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-clarus-navy">
                    Properties cannot pay for higher scores.
                  </h4>
                  <p className="mt-1 text-sm text-slate">
                    No amount of sponsorship, partnership fees, or advertising will
                    influence our scoring methodology or individual property assessments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clarus-navy text-white">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-clarus-navy">
                    Editorial and partnerships teams operate independently.
                  </h4>
                  <p className="mt-1 text-sm text-slate">
                    Our scoring team has no knowledge of commercial relationships.
                    Partnership discussions never influence assessment processes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clarus-navy text-white">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-clarus-navy">
                    We re-evaluate scores regularly and will lower them.
                  </h4>
                  <p className="mt-1 text-sm text-slate">
                    Properties can lose their ranking if standards slip. We have downgraded
                    properties, removed recognition badges, and published negative updates
                    when warranted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clarus-navy text-white">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-clarus-navy">
                    All assessments use transparent, verifiable criteria.
                  </h4>
                  <p className="mt-1 text-sm text-slate">
                    Every evaluation carries the name and credentials of the team member
                    who conducted it. Anonymous claims have no place in our methodology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 border-t border-stone pt-12">
          <div className="text-center">
            <h3 className="font-display text-2xl font-medium text-clarus-navy">
              Ready to Find Your Retreat?
            </h3>
            <p className="mt-4 text-slate">
              Explore our curated selection of wellness destinations.
            </p>
            <Link
              href="/properties"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
            >
              Browse Retreats
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
