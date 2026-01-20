import { db } from '@clarus-vitae/database';
import { Container, Breadcrumbs, PropertyCard, TreatmentCard } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatPriceRange } from '@/lib/properties';
import { equipmentCategoryLabels, treatmentCategoryLabels } from '@/lib/treatments';

interface EquipmentPageProps {
  params: Promise<{ slug: string }>;
}

async function getEquipment(slug: string) {
  const equipment = await db.equipment.findUnique({
    where: { slug },
    include: {
      treatments: {
        include: {
          treatment: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              evidenceLevel: true,
              description: true,
              published: true,
              _count: {
                select: { properties: true },
              },
            },
          },
        },
      },
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

  if (!equipment) {
    return null;
  }

  // Get related equipment
  const relatedEquipment = await db.equipment.findMany({
    where: {
      category: equipment.category,
      slug: { not: slug },
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      model: true,
      category: true,
      description: true,
      _count: {
        select: { properties: true },
      },
    },
  });

  return { equipment, relatedEquipment };
}

export async function generateMetadata({ params }: EquipmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEquipment(slug);

  if (!data) {
    return {
      title: 'Equipment Not Found | Clarus Vitae',
    };
  }

  const { equipment } = data;
  const _categoryLabel = equipmentCategoryLabels[equipment.category];
  const propertiesCount = equipment.properties.filter((p: any) => p.property?.published).length;
  const brandModel = [equipment.brand, equipment.model].filter(Boolean).join(' ');

  return {
    title: `${equipment.name}${brandModel ? ` (${brandModel})` : ''} | Clarus Vitae`,
    description: `Learn about ${equipment.name}: capabilities, related treatments, and find ${propertiesCount} premium properties with this equipment.`,
    openGraph: {
      title: `${equipment.name} | Clarus Vitae`,
      description: `Learn about ${equipment.name} and find premium properties with this equipment.`,
      type: 'article',
    },
  };
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
  const { slug } = await params;
  const data = await getEquipment(slug);

  if (!data) {
    notFound();
  }

  const { equipment, relatedEquipment } = data;

  const publishedProperties = equipment.properties
    .filter((pe: any) => pe.property?.published)
    .map((pe: any) => ({
      id: pe.property.id,
      slug: pe.property.slug,
      name: pe.property.name,
      location: {
        city: pe.property.city,
        country: pe.property.country,
        region: pe.property.region,
      },
      tier: pe.property.tier,
      score: pe.property.overallScore,
      pricing: {
        min: pe.property.priceMin,
        max: pe.property.priceMax,
        currency: pe.property.currency,
      },
      installationYear: pe.installationYear,
      notes: pe.notes,
      featuredImage: pe.property.images[0] || null,
    }));

  const publishedTreatments = equipment.treatments
    .filter((te: any) => te.treatment?.published)
    .map((te: any) => ({
      id: te.treatment.id,
      slug: te.treatment.slug,
      name: te.treatment.name,
      category: te.treatment.category,
      evidenceLevel: te.treatment.evidenceLevel,
      description: te.treatment.description,
      propertiesCount: te.treatment._count.properties,
    }));

  const brandModel = [equipment.brand, equipment.model].filter(Boolean).join(' ');

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Treatments', href: '/treatments' },
    { label: 'Equipment', href: '/treatments' },
    { label: equipment.name, href: `/equipment/${slug}` },
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
            {equipmentCategoryLabels[equipment.category]}
          </span>

          <h1 className="mt-4 font-display text-4xl font-medium text-clarus-navy md:text-5xl">
            {equipment.name}
          </h1>

          {brandModel && (
            <p className="mt-2 text-lg text-slate">{brandModel}</p>
          )}

          <p className="mt-6 text-lg text-slate leading-relaxed">{equipment.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-slate">
            <div className="flex items-center gap-2">
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
            {publishedTreatments.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span>
                  Used in <strong className="text-clarus-navy">{publishedTreatments.length}</strong>{' '}
                  {publishedTreatments.length === 1 ? 'treatment' : 'treatments'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="mx-auto max-w-4xl">
            {/* Capabilities */}
            {equipment.capabilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-medium text-clarus-navy">Capabilities</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {equipment.capabilities.map((capability: any, index: any) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 rounded-lg border border-stone bg-white p-4"
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-verification-green"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-slate">{capability}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Related Treatments */}
        {publishedTreatments.length > 0 && (
          <div className="mx-auto max-w-4xl border-t border-stone py-12">
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Treatments Using This Equipment
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {publishedTreatments.map((treatment: any) => (
                <Link key={treatment.id} href={`/treatments/${treatment.slug}`}>
                  <TreatmentCard
                    name={treatment.name}
                    category={treatmentCategoryLabels[treatment.category] ?? 'Treatment'}
                    evidenceLevel={treatment.evidenceLevel}
                    description={treatment.description.substring(0, 100) + '...'}
                    propertiesCount={treatment.propertiesCount}
                    href={`/treatments/${treatment.slug}`}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Properties With This Equipment */}
        <div className="mx-auto max-w-4xl border-t border-stone py-12">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Properties With This Equipment
          </h2>
          <p className="mt-1 text-slate">
            {publishedProperties.length} {publishedProperties.length === 1 ? 'property has' : 'properties have'}{' '}
            {equipment.name}
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
                We are currently researching properties with this equipment.
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* Related Equipment */}
      {relatedEquipment.length > 0 && (
        <section className="border-t border-stone bg-warm-gray py-12">
          <Container>
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Related Equipment
            </h2>
            <p className="mt-2 text-slate">
              Other {(equipmentCategoryLabels[equipment.category] ?? 'similar').toLowerCase()} equipment:
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedEquipment.map((re: any) => (
                <Link
                  key={re.id}
                  href={`/equipment/${re.slug}`}
                  className="group rounded-lg border border-stone bg-white p-6 transition-shadow hover:shadow-card-hover"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-slate">
                    {equipmentCategoryLabels[re.category]}
                  </span>
                  <h3 className="mt-1 font-medium text-clarus-navy group-hover:underline">
                    {re.name}
                  </h3>
                  {(re.brand || re.model) && (
                    <p className="mt-1 text-sm text-slate">
                      {[re.brand, re.model].filter(Boolean).join(' ')}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-slate">{re.description}</p>
                  <span className="mt-3 block text-xs text-slate">
                    {re._count.properties} {re._count.properties === 1 ? 'property' : 'properties'}
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
              Looking for Properties With Specific Equipment?
            </h2>
            <p className="mt-4 text-slate">
              Our team can help you find properties with the specific equipment and technology
              you need for your health goals.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/inquire"
                className="inline-flex items-center gap-2 rounded-lg bg-clarus-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
              >
                Request a Consultation
              </a>
              <a
                href="/treatments"
                className="inline-flex items-center gap-2 rounded-lg border border-clarus-navy px-6 py-3 text-sm font-medium text-clarus-navy transition-colors hover:bg-stone"
              >
                Browse Treatments
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
