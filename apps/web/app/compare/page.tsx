import { db } from '@clarus-vitae/database';
import { Container, Breadcrumbs } from '@clarus-vitae/ui';
import type { Metadata } from 'next';

import { ComparisonPageClient } from './_components/ComparisonPageClient';

interface ComparePageProps {
  searchParams: Promise<{
    properties?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ComparePageProps): Promise<Metadata> {
  const params = await searchParams;
  const slugs = params.properties?.split(',').filter(Boolean) || [];

  if (slugs.length === 0) {
    return {
      title: 'Compare Properties | Clarus Vitae',
      description:
        'Compare wellness properties side-by-side with Clarus Index scores, pricing, treatments, and detailed assessments.',
    };
  }

  // Fetch property names for metadata
  const properties = await db.property.findMany({
    where: {
      slug: { in: slugs.slice(0, 4) },
      published: true,
    },
    select: { name: true },
  });

  const names = properties.map((p: { name: string }) => p.name).join(' vs ');

  return {
    title: `${names} - Compare | Clarus Vitae`,
    description: `Side-by-side comparison of ${names}. Compare Clarus Index scores, pricing, treatments, and cultural fit.`,
  };
}

async function getComparisonData(slugs: string[]) {
  if (slugs.length === 0) {
    return { properties: [], popularComparisons: [] };
  }

  const properties = await db.property.findMany({
    where: {
      slug: { in: slugs },
      published: true,
    },
    include: {
      images: {
        where: { isFeatured: true },
        take: 1,
        select: {
          url: true,
          alt: true,
        },
      },
      treatments: {
        include: {
          treatment: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
            },
          },
        },
      },
      programs: {
        where: { published: true },
        select: {
          price: true,
          durationDays: true,
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        select: {
          overallRating: true,
          goalAchievement: true,
        },
      },
    },
  });

  // Sort to match requested order
  const sortedProperties = slugs
    .map((slug: string) => properties.find((p: typeof properties[0]) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return {
    properties: sortedProperties,
    popularComparisons: [], // Could be populated from analytics
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const slugs = params.properties?.split(',').filter(Boolean).slice(0, 4) || [];
  const { properties } = await getComparisonData(slugs);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Compare', href: '/compare' },
  ];

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Breadcrumbs */}
      <div className="border-b border-stone bg-white">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="py-4" />
        </Container>
      </div>

      {/* Page Header */}
      <div className="border-b border-stone bg-white py-8">
        <Container>
          <h1 className="font-display text-3xl font-medium text-clarus-navy sm:text-4xl">
            Compare Properties
          </h1>
          <p className="mt-2 text-slate">
            Evaluate wellness destinations side-by-side across Clarus Index scores, pricing,
            treatments, and more.
          </p>
        </Container>
      </div>

      {/* Comparison Content - Client Component */}
      <ComparisonPageClient
        initialProperties={properties.map((p: typeof properties[0]) => {
          type ReviewType = typeof p.reviews[0];
          type ProgramType = typeof p.programs[0];
          const reviewCount = p.reviews.length;
          const avgRating =
            reviewCount > 0
              ? p.reviews.reduce((sum: number, r: ReviewType) => sum + r.overallRating, 0) / reviewCount
              : null;
          const goalsAchieved = p.reviews.filter((r: ReviewType) => r.goalAchievement === 'FULLY').length;
          const goalsPartial = p.reviews.filter((r: ReviewType) => r.goalAchievement === 'PARTIALLY').length;
          const goalsTotal = p.reviews.filter((r: ReviewType) => r.goalAchievement !== null).length;
          const goalAchievementRate =
            goalsTotal > 0 ? Math.round(((goalsAchieved + goalsPartial * 0.5) / goalsTotal) * 100) : null;

          const programPrices = p.programs.map((prog: ProgramType) => prog.price);
          const durationDays = p.programs.map((prog: ProgramType) => prog.durationDays);

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            tier: p.tier,
            approach: p.approach,
            city: p.city,
            country: p.country,
            region: p.region,
            nearestAirport: p.nearestAirport,
            transferTime: p.transferTime,
            priceMin: p.priceMin,
            priceMax: p.priceMax,
            currency: p.currency,
            overallScore: p.overallScore,
            clinicalRigorScore: p.clinicalRigorScore,
            outcomeEvidenceScore: p.outcomeEvidenceScore,
            programDepthScore: p.programDepthScore,
            experienceQualityScore: p.experienceQualityScore,
            valueAlignmentScore: p.valueAlignmentScore,
            verifiedExcellence: p.verifiedExcellence,
            editorChoice: p.editorChoice,
            risingStar: p.risingStar,
            focusAreas: p.focusAreas,
            darkData: {
              physicianPatientRatio: p.physicianPatientRatio,
              avgBookingLeadTime: p.avgBookingLeadTime,
              returnGuestPercentage: p.returnGuestPercentage,
              staffTenure: p.staffTenure,
              actualCustomization: p.actualCustomization,
              postVisitFollowup: p.postVisitFollowup,
              discretionLevel: p.discretionLevel,
            },
            cultural: {
              genderSeparatedFacilities: p.genderSeparatedFacilities,
              religiousDietaryOptions: p.religiousDietaryOptions,
              privacyArchitecture: p.privacyArchitecture,
              languagesMedical: p.languagesMedical,
              languagesService: p.languagesService,
              soloTravelerFriendly: p.soloTravelerFriendly,
              lgbtqWelcoming: p.lgbtqWelcoming,
            },
            treatments: p.treatments.map((pt: typeof p.treatments[0]) => ({
              id: pt.treatment.id,
              slug: pt.treatment.slug,
              name: pt.treatment.name,
              category: pt.treatment.category,
              isSignature: pt.notes?.toLowerCase().includes('signature') || false,
            })),
            programsCount: p.programs.length,
            programPriceRange: {
              min: programPrices.length > 0 ? Math.min(...programPrices) : null,
              max: programPrices.length > 0 ? Math.max(...programPrices) : null,
            },
            durationRange: {
              min: durationDays.length > 0 ? Math.min(...durationDays) : null,
              max: durationDays.length > 0 ? Math.max(...durationDays) : null,
            },
            reviews: {
              count: reviewCount,
              averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
              goalAchievementRate,
            },
            heroImage: p.images[0] || null,
            foundedYear: p.foundedYear,
            capacity: p.capacity,
            website: p.website,
          };
        })}
        requestedSlugs={slugs}
      />
    </main>
  );
}
