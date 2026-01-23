import { db } from '@clarus-vitae/database';
import { Container } from '@clarus-vitae/ui';
import Link from 'next/link';

import { SiteHeader } from './_components/SiteHeader';
import { SiteFooter } from './_components/SiteFooter';
import { HomeSearch } from './_components/HomeSearch';

interface FeaturedProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  tier: string;
  overallScore: number | null;
  priceMin: number;
  priceMax: number;
  currency: string;
  verifiedExcellence: boolean;
  images: Array<{ url: string; alt: string }>;
}

// Fetch featured properties from database
async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  const properties = await db.property.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: { overallScore: 'desc' },
    take: 3,
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      country: true,
      tier: true,
      overallScore: true,
      priceMin: true,
      priceMax: true,
      currency: true,
      verifiedExcellence: true,
      images: {
        where: { isFeatured: true },
        take: 1,
        select: { url: true, alt: true },
      },
    },
  });

  return properties as FeaturedProperty[];
}

const tierLabels: Record<string, string> = {
  TIER_1: 'MEDICAL LONGEVITY',
  TIER_2: 'INTEGRATIVE WELLNESS',
  TIER_3: 'LUXURY DESTINATION',
};

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="min-h-screen bg-clarus-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-white pb-16 pt-12 md:pb-24 md:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-medium tracking-tight text-clarus-navy md:text-5xl lg:text-display-h1">
              Clarity for Life&apos;s Most Important Decisions
            </h1>
            <p className="mt-6 text-lg text-slate leading-relaxed">
              The trusted research authority for premium wellness decisions. Proprietary
              intelligence on the world&apos;s most exceptional longevity clinics and wellness
              destinations.
            </p>

            {/* Search Component */}
            <div className="mt-10">
              <HomeSearch />
            </div>
          </div>
        </Container>
      </section>

      {/* Value Propositions - Navy Background */}
      <section className="bg-clarus-navy py-16 md:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* The Clarus Index */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <span className="font-display text-lg text-clarus-gold">94</span>
              </div>
              <h3 className="font-display text-lg text-white">The Clarus Index</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Proprietary scoring methodology evaluating clinical rigor, outcomes, and experience quality.
              </p>
            </div>

            {/* Editorial Independence */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <svg className="h-5 w-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-white">Editorial Independence</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                We never accept payment for placement. Every evaluation is objective and verified.
              </p>
            </div>

            {/* Expert Team */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <svg className="h-5 w-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-white">Expert Team</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Named advisors with clinical, hospitality, and research credentials behind every recommendation.
              </p>
            </div>

            {/* Privacy-First */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
                <svg className="h-5 w-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-white">Privacy-First</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Research Mode enables full access without accounts, cookies, or digital footprints.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Properties */}
      <section className="bg-clarus-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <h2 className="font-display text-3xl font-medium text-clarus-navy md:text-display-h2">
              Featured Properties
            </h2>
            <p className="mt-3 text-slate">
              Exceptional destinations evaluated by our advisory team
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <article
                key={property.id}
                className="group overflow-hidden rounded-lg border border-stone bg-white transition-shadow hover:shadow-card-hover"
              >
                {/* Image */}
                <div className="relative aspect-[3/2] bg-stone">
                  {property.images[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.images[0].alt || property.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone to-warm-gray">
                      <span className="text-xs uppercase tracking-wider text-slate/60">
                        Property Image
                      </span>
                    </div>
                  )}

                  {/* Verified Badge */}
                  {property.verifiedExcellence && (
                    <span className="absolute right-3 top-3 rounded bg-verification-green/90 px-2 py-1 text-xs font-medium text-white">
                      Verified
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-clarus-gold">
                    {tierLabels[property.tier]}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-clarus-navy">
                    {property.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    {property.city}, {property.country}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-stone pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs uppercase tracking-wide text-slate">Index</span>
                      <span className="font-display text-2xl text-clarus-gold">
                        {property.overallScore}
                      </span>
                    </div>
                    <Link
                      href={`/properties/${property.slug}`}
                      className="text-sm font-medium text-clarus-navy hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
            >
              Explore All Properties
            </Link>
          </div>
        </Container>
      </section>

      {/* How We're Different */}
      <section className="bg-clarus-navy py-16 md:py-24">
        <Container>
          <h2 className="text-center font-display text-3xl font-medium text-white md:text-display-h2">
            How We&apos;re Different
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-lg bg-white/5 p-6 md:p-8">
              <h3 className="font-display text-xl text-white">We Evaluate, Not Aggregate</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Unlike directories that list everything, we cover only ~200 exceptional
                properties globally. Each is personally assessed by our advisory team
                against rigorous criteria.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg bg-white/5 p-6 md:p-8">
              <h3 className="font-display text-xl text-white">Outcomes Over Amenities</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                We track what matters: physician ratios, biological age reduction data,
                return rates, post-program support. Not thread counts and spa menus.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg bg-white/5 p-6 md:p-8">
              <h3 className="font-display text-xl text-white">Human Expertise Behind Every Score</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Every Clarus Index score reflects real evaluation by named experts—
                physicians, researchers, and industry specialists who stake their
                reputation on accuracy.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-lg bg-white/5 p-6 md:p-8">
              <h3 className="font-display text-xl text-white">Your Privacy Is Non-Negotiable</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Research Mode provides full access without accounts. We never sell
                data, share with insurers, or retarget. Your health research remains
                your business.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </div>
  );
}
