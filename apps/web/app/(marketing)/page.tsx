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
            The trusted research authority for premium wellness decisions. Proprietary
            intelligence on the world&apos;s most exceptional longevity clinics and wellness
            destinations.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-clarus-navy transition-all hover:bg-white/90 hover:scale-105 shadow-lg"
            >
              Explore Properties
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

            {/* Expert Team */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="font-display text-base md:text-lg font-medium text-white mb-2">
                Expert Team
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Named advisors with clinical, hospitality, and research credentials behind every recommendation.
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
              Exceptional destinations evaluated by our advisory team
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
                properties globally. Each is personally assessed by our advisory team
                against rigorous criteria.
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

            {/* Human Expertise Behind Every Score */}
            <div className="bg-white/5 rounded-lg p-6 md:p-8 border border-white/10">
              <h3 className="font-display text-lg font-medium text-white mb-3">
                Human Expertise Behind Every Score
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every Clarus Index score reflects real evaluation by named experts—
                physicians, researchers, and industry specialists who stake their
                reputation on accuracy.
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
