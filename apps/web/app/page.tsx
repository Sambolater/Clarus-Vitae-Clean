import { HomeSearch } from './_components/HomeSearch';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 md:py-32 bg-gradient-to-b from-white to-stone/30">
        <div className="max-w-4xl text-center">
          <h1 className="font-display text-4xl font-medium tracking-tight text-clarus-navy md:text-5xl lg:text-6xl">
            The Wellness Industry Has a Trust Problem.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl mx-auto">
            We solve it with verified intelligence, transparent methodology, and experts who put
            their names behind every assessment.
          </p>

          {/* Search Component */}
          <div className="mt-10">
            <HomeSearch />
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="px-6 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center font-display text-2xl md:text-3xl font-medium text-clarus-navy mb-12">
            Why Trust Clarus Vitae
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-clarus-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-medium text-clarus-navy mb-2">
                Verified Excellence
              </h3>
              <p className="text-slate text-sm leading-relaxed">
                Every property is personally assessed by our expert team. No pay-to-play rankings.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-clarus-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-medium text-clarus-navy mb-2">
                The Clarus Index
              </h3>
              <p className="text-slate text-sm leading-relaxed">
                Our proprietary scoring system evaluates clinical rigor, outcomes, and value alignment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-clarus-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-medium text-clarus-navy mb-2">
                Privacy First
              </h3>
              <p className="text-slate text-sm leading-relaxed">
                No tracking, no cookies, no footprint. Your wellness journey stays private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Teaser */}
      <section className="px-6 py-16 md:py-24 bg-stone/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-clarus-navy mb-4">
            Exceptional Wellness Destinations
          </h2>
          <p className="text-slate mb-8 max-w-2xl mx-auto">
            From world-leading medical longevity clinics to transformative integrated wellness retreats,
            discover properties that meet our rigorous standards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/properties?tier=TIER_1"
              className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
            >
              Tier 1: Medical Longevity
            </a>
            <a
              href="/properties?tier=TIER_2"
              className="inline-flex h-12 items-center justify-center rounded-md border border-clarus-navy px-8 text-sm font-medium text-clarus-navy transition-colors hover:bg-white"
            >
              Tier 2: Integrated Wellness
            </a>
          </div>
        </div>
      </section>

      {/* Treatments Teaser */}
      <section className="px-6 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-clarus-navy mb-4">
            Evidence-Based Treatments
          </h2>
          <p className="text-slate mb-8 max-w-2xl mx-auto">
            Navigate the world of wellness treatments with clear evidence levels, honest assessments,
            and practical guidance on what actually works.
          </p>
          <a
            href="/treatments"
            className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
          >
            Explore Treatments
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24 bg-clarus-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-4">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re seeking cutting-edge longevity protocols or a transformative retreat experience,
            we&apos;ll help you find the perfect destination.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-clarus-navy transition-colors hover:bg-white/90"
            >
              Browse All Properties
            </a>
            <a
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Learn About Our Process
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
