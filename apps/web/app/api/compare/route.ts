/**
 * GET /api/compare
 *
 * Fetches detailed property data for comparison.
 * Accepts property slugs as a comma-separated list.
 */

import { db } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Maximum properties allowed in comparison
const MAX_COMPARISON_ITEMS = 4;

interface PropertyForComparison {
  id: string;
  slug: string;
  name: string;
  tier: string;
  approach: string | null;

  // Location
  city: string;
  country: string;
  region: string | null;
  nearestAirport: string | null;
  transferTime: string | null;

  // Pricing
  priceMin: number;
  priceMax: number;
  currency: string;

  // Scores
  overallScore: number | null;
  clinicalRigorScore: number | null;
  outcomeEvidenceScore: number | null;
  programDepthScore: number | null;
  experienceQualityScore: number | null;
  valueAlignmentScore: number | null;

  // Recognition
  verifiedExcellence: boolean;
  editorChoice: string | null;
  risingStar: boolean;

  // Focus areas
  focusAreas: string[];

  // Dark data
  darkData: {
    physicianPatientRatio: string | null;
    avgBookingLeadTime: string | null;
    returnGuestPercentage: number | null;
    staffTenure: string | null;
    actualCustomization: string | null;
    postVisitFollowup: string | null;
    discretionLevel: string | null;
  };

  // Cultural fit
  cultural: {
    genderSeparatedFacilities: string | null;
    religiousDietaryOptions: string[];
    privacyArchitecture: string | null;
    languagesMedical: string[];
    languagesService: string[];
    soloTravelerFriendly: string | null;
    lgbtqWelcoming: string | null;
  };

  // Treatments
  treatments: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    isSignature: boolean;
  }>;

  // Programs summary
  programsCount: number;
  programPriceRange: {
    min: number | null;
    max: number | null;
  };

  // Reviews summary
  reviews: {
    count: number;
    averageRating: number | null;
    goalAchievementRate: number | null;
  };

  // Media
  heroImage: {
    url: string;
    alt: string;
  } | null;

  // Additional details
  foundedYear: number | null;
  capacity: number | null;
  website: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertiesParam = searchParams.get('properties');

    if (!propertiesParam) {
      return NextResponse.json(
        { error: 'Missing properties parameter' },
        { status: 400 }
      );
    }

    const slugs = propertiesParam.split(',').filter(Boolean).slice(0, MAX_COMPARISON_ITEMS);

    if (slugs.length === 0) {
      return NextResponse.json(
        { error: 'No valid property slugs provided' },
        { status: 400 }
      );
    }

    // Fetch properties with all comparison data
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

    // Sort properties to match the order of slugs provided
    const sortedProperties = slugs
      .map((slug: string) => properties.find((p: typeof properties[0]) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    // Transform to comparison format
    const comparisonProperties: PropertyForComparison[] = sortedProperties.map((property) => {
      // Calculate review stats
      type ReviewType = typeof property.reviews[0];
      const reviewCount = property.reviews.length;
      const averageRating = reviewCount > 0
        ? property.reviews.reduce((sum: number, r: ReviewType) => sum + r.overallRating, 0) / reviewCount
        : null;
      const goalsAchieved = property.reviews.filter((r: ReviewType) => r.goalAchievement === 'FULLY').length;
      const goalsPartial = property.reviews.filter((r: ReviewType) => r.goalAchievement === 'PARTIALLY').length;
      const goalsTotal = property.reviews.filter((r: ReviewType) => r.goalAchievement !== null).length;
      const goalAchievementRate = goalsTotal > 0
        ? Math.round(((goalsAchieved + goalsPartial * 0.5) / goalsTotal) * 100)
        : null;

      // Calculate program price range
      type ProgramType = typeof property.programs[0];
      const programPrices = property.programs.map((p: ProgramType) => p.price);
      const programPriceMin = programPrices.length > 0 ? Math.min(...programPrices) : null;
      const programPriceMax = programPrices.length > 0 ? Math.max(...programPrices) : null;

      return {
        id: property.id,
        slug: property.slug,
        name: property.name,
        tier: property.tier,
        approach: property.approach,

        city: property.city,
        country: property.country,
        region: property.region,
        nearestAirport: property.nearestAirport,
        transferTime: property.transferTime,

        priceMin: property.priceMin,
        priceMax: property.priceMax,
        currency: property.currency,

        overallScore: property.overallScore,
        clinicalRigorScore: property.clinicalRigorScore,
        outcomeEvidenceScore: property.outcomeEvidenceScore,
        programDepthScore: property.programDepthScore,
        experienceQualityScore: property.experienceQualityScore,
        valueAlignmentScore: property.valueAlignmentScore,

        verifiedExcellence: property.verifiedExcellence,
        editorChoice: property.editorChoice,
        risingStar: property.risingStar,

        focusAreas: property.focusAreas,

        darkData: {
          physicianPatientRatio: property.physicianPatientRatio,
          avgBookingLeadTime: property.avgBookingLeadTime,
          returnGuestPercentage: property.returnGuestPercentage,
          staffTenure: property.staffTenure,
          actualCustomization: property.actualCustomization,
          postVisitFollowup: property.postVisitFollowup,
          discretionLevel: property.discretionLevel,
        },

        cultural: {
          genderSeparatedFacilities: property.genderSeparatedFacilities,
          religiousDietaryOptions: property.religiousDietaryOptions,
          privacyArchitecture: property.privacyArchitecture,
          languagesMedical: property.languagesMedical,
          languagesService: property.languagesService,
          soloTravelerFriendly: property.soloTravelerFriendly,
          lgbtqWelcoming: property.lgbtqWelcoming,
        },

        treatments: property.treatments.map((pt: typeof property.treatments[0]) => ({
          id: pt.treatment.id,
          slug: pt.treatment.slug,
          name: pt.treatment.name,
          category: pt.treatment.category,
          isSignature: pt.notes?.toLowerCase().includes('signature') || false,
        })),

        programsCount: property.programs.length,
        programPriceRange: {
          min: programPriceMin,
          max: programPriceMax,
        },

        reviews: {
          count: reviewCount,
          averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
          goalAchievementRate,
        },

        heroImage: property.images[0] || null,

        foundedYear: property.foundedYear,
        capacity: property.capacity,
        website: property.website,
      };
    });

    return NextResponse.json({
      properties: comparisonProperties,
      meta: {
        requestedSlugs: slugs,
        returnedCount: comparisonProperties.length,
        maxItems: MAX_COMPARISON_ITEMS,
      },
    });
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}
