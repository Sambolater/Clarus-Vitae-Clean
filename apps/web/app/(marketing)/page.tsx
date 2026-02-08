import { db } from '@clarus-vitae/database';
import Link from 'next/link';

// Force dynamic rendering - database access at runtime
export const dynamic = 'force-dynamic';

// Type for featured property
interface FeaturedProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  tier: string;
  overallScore: number | null;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
}

// Fetch featured properties for the homepage
async function getFeaturedProperties(): Promise<FeaturedProperty[]> {
  const properties = await db.property.findMany({
    where: { published: true },
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
      images: {
        where: { isFeatured: true },
        take: 1,
        select: {
          url: true,
          alt: true,
        },
      },
    },
  });
  return properties;
}

// Tier label mapping
const tierLabels: Record<string, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrative Wellness',
  TIER_3: 'Luxury Destination',
};

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Luxury Background */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 md:py-44 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1619166272697-07b9aac1116a?w=1920&q=80)',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-clarus-navy/70 via-clarus-navy/50 to-clarus-navy/70" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-[56px] leading-tight drop-shadow-lg">
            Clarity for Life&apos;s Most Important Decisions
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow">
            Independent research on premium wellness destinations. Comprehensive
            intelligence on the world&apos;s most exceptional longevity clinics and wellness
            retreats.
          </p>

          {/* Navigation Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-clarus-navy shadow-lg transition-all hover:bg-white/90 hover:scale-105"
            >
              Explore Retreats
            </Link>
            <Link
              href="/treatments"
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white/80 px-8 text-sm font-medium text-white transition-all hover:bg-white/10 hover:scale-105"
            >
              Browse Treatments
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars Section - Navy Background */}
      <section className="px-6 py-16 md:py-20 bg-clarus-navy">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* The Clarus Index */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/30 flex items-center justify-center">
                <span className="text-white text-sm font-display">94</span>
              </div>
              <h3 className="font-display text-base md:text-lg font-medium text-white mb-2">
                The Clarus Index
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Proprietary scoring methodology evaluating clinical rigor, outcomes, and experience quality.
              </p>
            </div>

            {/* Editorial Independence */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h3 className="font-display text-base md:text-lg font-medium text-white mb-2">
                Editorial Independence
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We never accept payment for placement. Every evaluation is objective and verified.
              </p>
            </div>

            {/* Evidence-Based */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="font-display text-base md:text-lg font-medium text-white mb-2">
                Evidence-Based
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every recommendation backed by verified outcomes, clinical data, and transparent methodology.
              </p>
            </div>

            {/* Privacy-First */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="font-display text-base md:text-lg font-medium text-white mb-2">
                Privacy-First
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Research Mode enables full access without accounts, cookies, or digital footprints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="px-6 py-16 md:py-24 bg-clarus-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-medium text-clarus-navy">
              Featured Properties
            </h2>
            <p className="mt-3 text-slate">
              Exceptional destinations evaluated against rigorous criteria
            </p>
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group block bg-white rounded-lg border border-stone overflow-hidden transition-shadow hover:shadow-card-hover"
              >
                {/* Image */}
                <div className="aspect-[3/2] bg-stone relative overflow-hidden">
                  {property.images[0]?.url ? (
                    <img
                      src={property.images[0].url}
                      alt={property.images[0].alt || property.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate/50 text-sm">Image coming soon</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tier Label */}
                  <div className="text-[11px] font-medium tracking-wide uppercase text-clarus-gold mb-1">
                    {tierLabels[property.tier] || property.tier}
                  </div>

                  {/* Property Name */}
                  <h3 className="font-display text-lg font-medium text-clarus-navy group-hover:text-clarus-navy/80">
                    {property.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-slate mt-1">
                    {property.city}, {property.country}
                  </p>

                  {/* Footer with Score */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[11px] uppercase tracking-wide text-slate">Index</span>
                      <span className="font-display text-xl text-clarus-gold">{property.overallScore}</span>
                    </div>
                    <span className="text-sm text-clarus-navy font-medium group-hover:underline">
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md border border-clarus-navy px-8 text-sm font-medium text-clarus-navy transition-colors hover:bg-clarus-navy hover:text-white"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* How We're Different Section - Navy Background */}
      <section className="px-6 py-16 md:py-24 bg-clarus-navy">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-white text-center mb-12">
            How We&apos;re Different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* We Evaluate, Not Aggregate */}
            <div className="bg-white/5 rounded-lg p-6 md:p-8 border border-white/10">
              <h3 className="font-display text-lg font-medium text-white mb-3">
                We Evaluate, Not Aggregate
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Unlike directories that list everything, we cover only ~200 exceptional
                properties globally. Each is evaluated against rigorous criteria
                for outcomes, credentials, and guest experience.
              </p>
            </div>

            {/* Outcomes Over Amenities */}
            <div className="bg-white/5 rounded-lg p-6 md:p-8 border border-white/10">
              <h3 className="font-display text-lg font-medium text-white mb-3">
                Outcomes Over Amenities
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We track what matters: physician ratios, biological age reduction data,
                return rates, post-program support. Not thread counts and spa menus.
              </p>
            </div>

            {/* Transparent Methodology */}
            <div className="bg-white/5 rounded-lg p-6 md:p-8 border border-white/10">
              <h3 className="font-display text-lg font-medium text-white mb-3">
                Transparent Methodology
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every Clarus Index score is based on verifiable data—clinical outcomes,
                guest feedback, facility credentials, and program efficacy. No black boxes.
              </p>
            </div>

            {/* Your Privacy Is Non-Negotiable */}
            <div className="bg-white/5 rounded-lg p-6 md:p-8 border border-white/10">
              <h3 className="font-display text-lg font-medium text-white mb-3">
                Your Privacy Is Non-Negotiable
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Research Mode provides full access without accounts. We never sell
                data, share with insurers, or retarget. Your health research remains
                your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="px-6 py-6 bg-clarus-white border-t border-stone">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate hover:text-clarus-navy">Privacy</Link>
            <Link href="/terms" className="text-slate hover:text-clarus-navy">Terms</Link>
            <Link href="/about/methodology" className="text-slate hover:text-clarus-navy">Methodology</Link>
            <Link href="/inquire" className="text-slate hover:text-clarus-navy">Contact</Link>
          </div>
          <p className="text-sm text-slate">
            © {new Date().getFullYear()} Clarus Vitae. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
