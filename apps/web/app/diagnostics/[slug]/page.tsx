import { db, type DiagnosticCategory } from '@clarus-vitae/database';
import { Container, Breadcrumbs, PropertyCard } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatPriceRange } from '@/lib/properties';
import { diagnosticCategoryLabels, medicalDisclaimer } from '@/lib/treatments';

interface DiagnosticPageProps {
  params: Promise<{ slug: string }>;
}

async function getDiagnostic(slug: string) {
  const diagnostic = await db.diagnostic.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      properties: {
        include: {
          property: {
            select: {
              id: true,
              slug: true,
              name: true,
              city: true,
              country: true,
              region: true,
              tier: true,
              overallScore: true,
              priceMin: true,
              priceMax: true,
              currency: true,
              published: true,
              images: {
                where: { isFeatured: true },
                take: 1,
                select: {
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!diagnostic) {
    return null;
  }

  // Get related diagnostics
  const relatedDiagnostics = await db.diagnostic.findMany({
    where: {
      category: diagnostic.category,
      slug: { not: slug },
      published: true,
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      description: true,
      _count: {
        select: { properties: true },
      },
    },
  });

  return { diagnostic, relatedDiagnostics };
}

export async function generateMetadata({ params }: DiagnosticPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDiagnostic(slug);

  if (!data) {
    return {
      title: 'Diagnostic Not Found | Clarus Vitae',
    };
  }

  const { diagnostic } = data;
  const _categoryLabel = diagnosticCategoryLabels[diagnostic.category as DiagnosticCategory];
  const propertiesCount = diagnostic.properties.filter((p: any) => p.property?.published).length;

  return {
    title: `${diagnostic.name}: What It Measures & Where To Get It | Clarus Vitae`,
    description: `Learn about ${diagnostic.name} diagnostic testing: what it measures, how to interpret results, and find ${propertiesCount} premium properties offering this assessment.`,
    openGraph: {
      title: `${diagnostic.name}: What It Measures & Where To Get It | Clarus Vitae`,
      description: `Learn about ${diagnostic.name} diagnostic testing and find premium properties offering this assessment.`,
      type: 'article',
    },
  };
}

export default async function DiagnosticPage({ params }: DiagnosticPageProps) {
  const { slug } = await params;
  const data = await getDiagnostic(slug);

  if (!data) {
    notFound();
  }

  const { diagnostic, relatedDiagnostics } = data;

  const publishedProperties = diagnostic.properties
    .filter((pd: any) => pd.property?.published)
    .map((pd: any) => ({
      id: pd.property.id,
      slug: pd.property.slug,
      name: pd.property.name,
      location: {
        city: pd.property.city,
        country: pd.property.country,
        region: pd.property.region,
      },
      tier: pd.property.tier,
      score: pd.property.overallScore,
      pricing: {
        min: pd.property.priceMin,
        max: pd.property.priceMax,
        currency: pd.property.currency,
      },
      notes: pd.notes,
      featuredImage: pd.property.images[0] || null,
    }));

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Diagnostics', href: '/diagnostics' },
    { label: diagnosticCategoryLabels[diagnostic.category as DiagnosticCategory], href: `/diagnostics?category=${diagnostic.category}` },
    { label: diagnostic.name, href: `/diagnostics/${slug}` },
  ];

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Breadcrumbs */}
      <div className="border-b border-stone bg-white">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="py-4" />
        </Container>
      </div>

      {/* Hero Section */}
      <section className="border-b border-stone bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <span className="inline-flex items-center rounded-full bg-stone px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate">
            {diagnosticCategoryLabels[diagnostic.category as DiagnosticCategory]}
          </span>

          <h1 className="mt-4 font-display text-4xl font-medium text-clarus-navy md:text-5xl">
            {diagnostic.name}
          </h1>

          <p className="mt-6 text-lg text-slate leading-relaxed">{diagnostic.description}</p>

          <div className="mt-6 flex items-center gap-4 text-slate">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>
              Available at <strong className="text-clarus-navy">{publishedProperties.length}</strong>{' '}
              {publishedProperties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer - Top */}
      <section className="border-b border-stone bg-warm-gray py-4">
        <Container>
          <p className="text-center text-xs text-slate">{medicalDisclaimer}</p>
        </Container>
      </section>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="mx-auto max-w-4xl">
            {/* What It Measures */}
            <section>
              <h2 className="font-display text-2xl font-medium text-clarus-navy">What It Measures</h2>
              <div className="mt-4 rounded-lg border border-stone bg-white p-6">
                <p className="text-slate leading-relaxed whitespace-pre-line">
                  {diagnostic.whatItMeasures}
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Where To Get It */}
        <div className="mx-auto max-w-4xl border-t border-stone py-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Where To Get It</h2>
          <p className="mt-1 text-slate">
            {publishedProperties.length} {publishedProperties.length === 1 ? 'property offers' : 'properties offer'}{' '}
            {diagnostic.name}
          </p>

          {publishedProperties.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedProperties.slice(0, 6).map((property: any) => (
                <Link key={property.id} href={`/properties/${property.slug}`}>
                  <PropertyCard
                    name={property.name}
                    location={property.location.city}
                    country={property.location.country}
                    tier={property.tier}
                    score={property.score ?? 0}
                    imageUrl={property.featuredImage?.url}
                    priceRange={formatPriceRange(
                      property.pricing.min,
                      property.pricing.max,
                      property.pricing.currency
                    )}
                    href={`/properties/${property.slug}`}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-stone bg-warm-gray p-8 text-center">
              <p className="text-slate">
                We are currently researching properties that offer this diagnostic.
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* Related Diagnostics */}
      {relatedDiagnostics.length > 0 && (
        <section className="border-t border-stone bg-warm-gray py-12">
          <Container>
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Related Diagnostics
            </h2>
            <p className="mt-2 text-slate">
              Other {(diagnosticCategoryLabels[diagnostic.category as DiagnosticCategory] ?? 'similar').toLowerCase()} diagnostics you might consider:
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedDiagnostics.map((rd: any) => (
                <Link
                  key={rd.id}
                  href={`/diagnostics/${rd.slug}`}
                  className="group rounded-lg border border-stone bg-white p-6 transition-shadow hover:shadow-card-hover"
                >
                  <h3 className="font-medium text-clarus-navy group-hover:underline">
                    {rd.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate">{rd.description}</p>
                  <span className="mt-3 block text-xs text-slate">
                    {rd._count.properties} {rd._count.properties === 1 ? 'property' : 'properties'}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-stone bg-white py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Need Help Finding the Right Diagnostic?
            </h2>
            <p className="mt-4 text-slate">
              Our team can help you find the right property for {diagnostic.name} based on your
              specific health goals.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/inquire"
                className="inline-flex items-center gap-2 rounded-lg bg-clarus-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
              >
                Request a Consultation
              </a>
              <a
                href="/diagnostics"
                className="inline-flex items-center gap-2 rounded-lg border border-clarus-navy px-6 py-3 text-sm font-medium text-clarus-navy transition-colors hover:bg-stone"
              >
                Browse All Diagnostics
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
