import { db, type PropertyTier, type FocusArea } from '@clarus-vitae/database';
import { Container } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { JsonLd } from '@/components/JsonLd';
import { tierLabels, focusAreaLabels } from '@/lib/properties';
import {
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
} from '@/lib/structured-data';

import { SiteFooter } from '../../_components/SiteFooter';
import { SiteHeader } from '../../_components/SiteHeader';

import {
  PropertyHero,
  PropertyScoreSection,
  PropertyProgramsSection,
  PropertyTreatmentsSection,
  PropertyDarkDataSection,
  PropertyCulturalFitSection,
  PropertyReviewsSection,
  SimilarPropertiesSection,
} from './_components';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string) {
  const property = await db.property.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      images: {
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      },
      programs: {
        where: { published: true },
        orderBy: { price: 'asc' },
      },
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
            },
          },
        },
      },
      diagnostics: {
        include: {
          diagnostic: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              description: true,
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
            },
          },
        },
      },
      tierOneDetails: true,
      indexScores: {
        orderBy: { assessmentDate: 'desc' },
        take: 1,
      },
      reviews: {
        where: { status: 'APPROVED' },
        select: {
          overallRating: true,
          serviceRating: true,
          facilitiesRating: true,
          diningRating: true,
          valueRating: true,
          goalAchievement: true,
        },
      },
    },
  });

  if (!property) {
    return null;
  }

  // Get similar properties
  const similarProperties = await db.property.findMany({
    where: {
      published: true,
      id: { not: property.id },
      OR: [
        { tier: property.tier },
        { country: property.country },
        { focusAreas: { hasSome: property.focusAreas } },
      ],
    },
    take: 4,
    orderBy: { overallScore: 'desc' },
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

  return { property, similarProperties };
}

function calculateReviewStats(reviews: Array<{
  overallRating: number;
  serviceRating: number | null;
  facilitiesRating: number | null;
  diningRating: number | null;
  valueRating: number | null;
  goalAchievement: string | null;
}>) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: null,
      ratings: null,
      outcomeStats: null,
    };
  }

  const totalReviews = reviews.length;
  const avgOverall = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;

  const serviceRatings = reviews.filter((r) => r.serviceRating !== null);
  const avgService = serviceRatings.length > 0
    ? serviceRatings.reduce((sum, r) => sum + r.serviceRating!, 0) / serviceRatings.length
    : null;

  const facilitiesRatings = reviews.filter((r) => r.facilitiesRating !== null);
  const avgFacilities = facilitiesRatings.length > 0
    ? facilitiesRatings.reduce((sum, r) => sum + r.facilitiesRating!, 0) / facilitiesRatings.length
    : null;

  const diningRatings = reviews.filter((r) => r.diningRating !== null);
  const avgDining = diningRatings.length > 0
    ? diningRatings.reduce((sum, r) => sum + r.diningRating!, 0) / diningRatings.length
    : null;

  const valueRatings = reviews.filter((r) => r.valueRating !== null);
  const avgValue = valueRatings.length > 0
    ? valueRatings.reduce((sum, r) => sum + r.valueRating!, 0) / valueRatings.length
    : null;

  const outcomeReviews = reviews.filter((r) => r.goalAchievement !== null);
  const outcomeStats = outcomeReviews.length > 0
    ? {
        totalWithOutcomes: outcomeReviews.length,
        fullyAchieved: outcomeReviews.filter((r) => r.goalAchievement === 'FULLY').length,
        partiallyAchieved: outcomeReviews.filter((r) => r.goalAchievement === 'PARTIALLY').length,
        notAchieved: outcomeReviews.filter((r) => r.goalAchievement === 'NOT_ACHIEVED').length,
      }
    : null;

  return {
    totalReviews,
    averageRating: Math.round(avgOverall * 10) / 10,
    ratings: {
      overall: Math.round(avgOverall * 10) / 10,
      service: avgService ? Math.round(avgService * 10) / 10 : null,
      facilities: avgFacilities ? Math.round(avgFacilities * 10) / 10 : null,
      dining: avgDining ? Math.round(avgDining * 10) / 10 : null,
      value: avgValue ? Math.round(avgValue * 10) / 10 : null,
    },
    outcomeStats,
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProperty(slug);

  if (!data) {
    return {
      title: 'Property Not Found | Clarus Vitae',
    };
  }

  const { property } = data;
  const scoreText = property.overallScore
    ? `Clarus Index score ${property.overallScore}/100.`
    : '';
  const tierText = tierLabels[property.tier as PropertyTier];

  return {
    title: `${property.name} Review & Analysis | Clarus Vitae`,
    description: `${property.name} in ${property.city}, ${property.country}: ${scoreText} ${tierText} wellness destination. Programs from $${property.priceMin.toLocaleString()}. Independent analysis and verified reviews.`,
    openGraph: {
      title: `${property.name} Review & Analysis | Clarus Vitae`,
      description: `${property.name} in ${property.city}, ${property.country}: ${scoreText} ${tierText} wellness destination.`,
      type: 'article',
      images: property.images[0]
        ? [
            {
              url: property.images[0].url,
              width: property.images[0].width,
              height: property.images[0].height,
              alt: property.images[0].alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const data = await getProperty(slug);

  if (!data) {
    notFound();
  }

  const { property, similarProperties } = data;
  const reviewStats = calculateReviewStats(property.reviews);

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Retreats', href: '/properties' },
    { label: property.name, href: `/properties/${slug}` },
  ];

  // Generate structured data
  const propertyStructuredData = generatePropertyStructuredData({
    name: property.name,
    description: property.description.substring(0, 500),
    slug,
    city: property.city,
    country: property.country,
    region: property.region,
    latitude: property.latitude,
    longitude: property.longitude,
    priceMin: property.priceMin,
    priceMax: property.priceMax,
    currency: property.currency,
    tier: property.tier,
    overallScore: property.overallScore,
    reviewCount: reviewStats.totalReviews,
    averageRating: reviewStats.averageRating,
    website: property.website,
    phone: property.contactPhone,
    featuredImageUrl: property.images[0]?.url,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href,
    }))
  );

  return (
    <div className="min-h-screen bg-clarus-white">
      <SiteHeader />

      {/* Structured Data for SEO */}
      <JsonLd data={[propertyStructuredData, breadcrumbStructuredData]} />

      {/* Hero Section */}
      <PropertyHero
        name={property.name}
        city={property.city}
        country={property.country}
        tier={property.tier}
        score={property.overallScore}
        images={property.images}
        pricing={{
          min: property.priceMin,
          max: property.priceMax,
          currency: property.currency,
        }}
        foundedYear={property.foundedYear}
        capacity={property.capacity}
        verifiedExcellence={property.verifiedExcellence}
        editorChoice={property.editorChoice}
        slug={slug}
      />

      {/* Main Content */}
      <Container>
        {/* Editorial Assessment */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              What Makes This Property Notable
            </h2>
            <div className="prose prose-slate mt-6 max-w-none">
              <p className="text-slate leading-relaxed">{property.description}</p>
            </div>

            {/* Focus Areas */}
            {property.focusAreas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-clarus-navy">Focus Areas</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {property.focusAreas.map((area: any) => (
                    <span
                      key={area}
                      className="rounded-md bg-stone px-3 py-1 text-sm text-slate"
                    >
                      {focusAreaLabels[area as FocusArea]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Clarus Index Score */}
        <div className="border-t border-stone">
          <PropertyScoreSection
            tier={property.tier}
            scores={{
              overall: property.overallScore,
              clinicalRigor: property.clinicalRigorScore,
              outcomeEvidence: property.outcomeEvidenceScore,
              programDepth: property.programDepthScore,
              experienceQuality: property.experienceQualityScore,
              valueAlignment: property.valueAlignmentScore,
              latestAssessment: property.indexScores[0]
                ? {
                    assessmentDate: property.indexScores[0].assessmentDate,
                    assessedBy: property.indexScores[0].assessedBy,
                    methodology: property.indexScores[0].methodology,
                  }
                : null,
            }}
          />
        </div>

        {/* Programs */}
        <div className="border-t border-stone">
          <PropertyProgramsSection
            programs={property.programs}
            propertySlug={slug}
          />
        </div>

        {/* Treatments & Diagnostics (Tier 1 & 2, only when data exists) */}
        {(property.tier === 'TIER_1' || property.tier === 'TIER_2') &&
          (property.treatments.length > 0 || property.diagnostics.length > 0 || property.equipment.length > 0) && (
          <div className="border-t border-stone">
            <PropertyTreatmentsSection
              treatments={property.treatments.map((pt: any) => ({
                id: pt.treatment.id,
                slug: pt.treatment.slug,
                name: pt.treatment.name,
                category: pt.treatment.category,
                evidenceLevel: pt.treatment.evidenceLevel,
                description: pt.treatment.description,
                priceAtProperty: pt.priceAtProperty,
                notes: pt.notes,
              }))}
              diagnostics={property.diagnostics.map((pd: any) => ({
                id: pd.diagnostic.id,
                slug: pd.diagnostic.slug,
                name: pd.diagnostic.name,
                category: pd.diagnostic.category,
                description: pd.diagnostic.description,
                notes: pd.notes,
              }))}
              equipment={property.equipment.map((pe: any) => ({
                id: pe.equipment.id,
                slug: pe.equipment.slug,
                name: pe.equipment.name,
                brand: pe.equipment.brand,
                model: pe.equipment.model,
                category: pe.equipment.category,
                installationYear: pe.installationYear,
                notes: pe.notes,
              }))}
              currency={property.currency}
            />
          </div>
        )}
      </Container>

      {/* Dark Data Section (full-width background) */}
      <PropertyDarkDataSection
        darkData={{
          physicianPatientRatio: property.physicianPatientRatio,
          avgBookingLeadTime: property.avgBookingLeadTime,
          returnGuestPercentage: property.returnGuestPercentage,
          staffTenure: property.staffTenure,
          actualCustomization: property.actualCustomization,
          postVisitFollowup: property.postVisitFollowup,
          discretionLevel: property.discretionLevel,
        }}
      />

      <Container>
        {/* Cultural Fit */}
        <PropertyCulturalFitSection
          culturalFit={{
            genderSeparatedFacilities: property.genderSeparatedFacilities,
            religiousDietaryOptions: property.religiousDietaryOptions,
            privacyArchitecture: property.privacyArchitecture,
            prayerFacilities: property.prayerFacilities,
            languagesMedical: property.languagesMedical,
            languagesService: property.languagesService,
            soloTravelerFriendly: property.soloTravelerFriendly,
            lgbtqWelcoming: property.lgbtqWelcoming,
          }}
        />

        {/* Practical Information */}
        <section className="border-t border-stone py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Practical Information
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* Location */}
              <div className="rounded-lg border border-stone bg-white p-6">
                <h3 className="text-sm font-medium text-clarus-navy">Location</h3>
                <p className="mt-2 text-slate">
                  {property.city}, {property.region && `${property.region}, `}
                  {property.country}
                </p>
                {property.nearestAirport && (
                  <p className="mt-2 text-sm text-slate">
                    Nearest airport: {property.nearestAirport}
                  </p>
                )}
                {property.transferTime && (
                  <p className="text-sm text-slate">
                    Transfer time: {property.transferTime}
                  </p>
                )}
              </div>

              {/* Accommodation */}
              {(property.accommodationType || property.capacity) && (
                <div className="rounded-lg border border-stone bg-white p-6">
                  <h3 className="text-sm font-medium text-clarus-navy">Accommodation</h3>
                  {property.accommodationType && (
                    <p className="mt-2 text-slate">{property.accommodationType}</p>
                  )}
                  {property.capacity && (
                    <p className="mt-1 text-sm text-slate">{property.capacity} rooms</p>
                  )}
                </div>
              )}

              {/* Dining */}
              {property.diningDescription && (
                <div className="rounded-lg border border-stone bg-white p-6">
                  <h3 className="text-sm font-medium text-clarus-navy">Dining</h3>
                  <p className="mt-2 text-sm text-slate">{property.diningDescription}</p>
                </div>
              )}

              {/* Facilities */}
              {property.facilitiesDescription && (
                <div className="rounded-lg border border-stone bg-white p-6">
                  <h3 className="text-sm font-medium text-clarus-navy">Facilities</h3>
                  <p className="mt-2 text-sm text-slate">{property.facilitiesDescription}</p>
                </div>
              )}

              {/* Contact */}
              {property.website && (
                <div className="rounded-lg border border-stone bg-white p-6">
                  <h3 className="text-sm font-medium text-clarus-navy">Website</h3>
                  <a
                    href={property.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-clarus-navy underline hover:no-underline"
                  >
                    Visit official website
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <div className="border-t border-stone">
          <PropertyReviewsSection
            propertySlug={slug}
            tier={property.tier}
            reviewStats={reviewStats}
          />
        </div>
      </Container>

      {/* Similar Properties (full-width background) */}
      <SimilarPropertiesSection
        properties={similarProperties.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          city: p.city,
          country: p.country,
          tier: p.tier,
          score: p.overallScore,
          pricing: {
            min: p.priceMin,
            max: p.priceMax,
            currency: p.currency,
          },
          featuredImage: p.images[0] || null,
        }))}
        currentPropertySlug={slug}
      />

      <SiteFooter />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone bg-white p-4 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-clarus-navy">
              From ${property.priceMin.toLocaleString()}
            </p>
            <p className="text-xs text-slate">per program</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/inquire/${slug}`}
              className="rounded-lg bg-clarus-navy px-4 py-2 text-sm font-medium text-white"
            >
              Inquire
            </a>
            <a
              href={`/compare?add=${slug}`}
              className="rounded-lg border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy"
            >
              Compare
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
