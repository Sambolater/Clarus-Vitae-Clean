import { db, type TreatmentCategory, type EvidenceLevel } from '@clarus-vitae/database';
import { Container, Breadcrumbs } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  treatmentCategoryLabels,
  evidenceLevelLabels,
  medicalDisclaimer,
} from '@/lib/treatments';

import {
  TreatmentHero,
  TreatmentInfoSections,
  WhereToGetIt,
  EquipmentSection,
  RelatedTreatments,
} from './_components';

interface TreatmentPageProps {
  params: Promise<{ slug: string }>;
}

async function getTreatment(slug: string) {
  const treatment = await db.treatment.findUnique({
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
      equipment: {
        include: {
          equipment: {
            select: {
              id: true,
              slug: true,
              name: true,
              brand: true,
              model: true,
              category: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!treatment) {
    return null;
  }

  // Get related treatments (same category)
  const relatedTreatments = await db.treatment.findMany({
    where: {
      category: treatment.category,
      slug: { not: slug },
      published: true,
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      evidenceLevel: true,
      description: true,
      _count: {
        select: { properties: true },
      },
    },
  });

  return { treatment, relatedTreatments };
}

export async function generateMetadata({ params }: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTreatment(slug);

  if (!data) {
    return {
      title: 'Treatment Not Found | Clarus Vitae',
    };
  }

  const { treatment } = data;
  const evidenceLabel = evidenceLevelLabels[treatment.evidenceLevel as EvidenceLevel];
  const propertiesCount = treatment.properties.filter((p: any) => p.property?.published).length;

  return {
    title: `${treatment.name}: What It Is, Evidence & Where To Get It | Clarus Vitae`,
    description: `Learn about ${treatment.name}: how it works, research evidence (${evidenceLabel}), and find ${propertiesCount} premium properties offering this treatment worldwide.`,
    openGraph: {
      title: `${treatment.name}: What It Is, Evidence & Where To Get It | Clarus Vitae`,
      description: `Learn about ${treatment.name}: how it works, research evidence (${evidenceLabel}), and find premium properties offering this treatment.`,
      type: 'article',
    },
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const { slug } = await params;
  const data = await getTreatment(slug);

  if (!data) {
    notFound();
  }

  const { treatment, relatedTreatments } = data;

  // Filter to only published properties
  const publishedProperties = treatment.properties
    .filter((pt: any) => pt.property?.published)
    .map((pt: any) => ({
      id: pt.property.id,
      slug: pt.property.slug,
      name: pt.property.name,
      location: {
        city: pt.property.city,
        country: pt.property.country,
        region: pt.property.region,
      },
      tier: pt.property.tier,
      score: pt.property.overallScore,
      pricing: {
        min: pt.property.priceMin,
        max: pt.property.priceMax,
        currency: pt.property.currency,
      },
      priceAtProperty: pt.priceAtProperty,
      notes: pt.notes,
      featuredImage: pt.property.images[0] || null,
    }));

  const transformedRelated = relatedTreatments.map((rt: any) => ({
    id: rt.id,
    slug: rt.slug,
    name: rt.name,
    category: rt.category,
    evidenceLevel: rt.evidenceLevel,
    description: rt.description.substring(0, 100) + (rt.description.length > 100 ? '...' : ''),
    propertiesCount: rt._count.properties,
  }));

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Treatments', href: '/treatments' },
    { label: treatmentCategoryLabels[treatment.category as TreatmentCategory], href: `/treatments?category=${treatment.category}` },
    { label: treatment.name, href: `/treatments/${slug}` },
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
      <TreatmentHero
        name={treatment.name}
        category={treatment.category}
        evidenceLevel={treatment.evidenceLevel}
        description={treatment.description}
        propertiesCount={publishedProperties.length}
        priceRangeMin={treatment.priceRangeMin}
        priceRangeMax={treatment.priceRangeMax}
        aliases={treatment.aliases}
      />

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
            <TreatmentInfoSections
              howItWorks={treatment.howItWorks}
              whatItAddresses={treatment.whatItAddresses}
              typicalProtocol={treatment.typicalProtocol}
              evidenceSummary={treatment.evidenceSummary}
              potentialRisks={treatment.potentialRisks}
              contraindications={treatment.contraindications}
            />
          </div>
        </div>

        {/* Equipment Section */}
        {treatment.equipment.length > 0 && (
          <div className="mx-auto max-w-4xl border-t border-stone">
            <EquipmentSection
              equipment={treatment.equipment.map((te: any) => ({
                id: te.equipment.id,
                slug: te.equipment.slug,
                name: te.equipment.name,
                brand: te.equipment.brand,
                model: te.equipment.model,
                category: te.equipment.category,
                description: te.equipment.description,
              }))}
            />
          </div>
        )}

        {/* Medical Disclaimer - Before Properties */}
        <div className="mx-auto max-w-4xl border-t border-stone py-8">
          <div className="rounded-lg border border-stone bg-warm-gray p-6">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-slate"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-slate">{medicalDisclaimer}</p>
            </div>
          </div>
        </div>

        {/* Where To Get It */}
        <div className="mx-auto max-w-4xl border-t border-stone">
          <WhereToGetIt
            properties={publishedProperties}
            treatmentName={treatment.name}
            treatmentSlug={slug}
          />
        </div>
      </Container>

      {/* Related Treatments (full-width background) */}
      <RelatedTreatments
        treatments={transformedRelated}
        currentTreatmentName={treatment.name}
      />

      {/* Bottom CTA Section */}
      <section className="border-t border-stone bg-white py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Ready to Explore Your Options?
            </h2>
            <p className="mt-4 text-slate">
              Our team can help you find the right property for {treatment.name} based on your
              specific health goals and preferences.
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
                Browse All Treatments
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
