/**
 * GET /api/properties/[slug]
 *
 * Retrieves full property details including programs, treatments,
 * diagnostics, reviews summary, and dark data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

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
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Calculate review statistics
    const reviewStats = calculateReviewStats(property.reviews);

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

    // Transform the response
    const transformedProperty = {
      id: property.id,
      slug: property.slug,
      name: property.name,
      description: property.description,

      // Location
      location: {
        city: property.city,
        country: property.country,
        region: property.region,
        coordinates: property.latitude && property.longitude
          ? { latitude: property.latitude, longitude: property.longitude }
          : null,
        nearestAirport: property.nearestAirport,
        transferTime: property.transferTime,
      },

      // Classification
      tier: property.tier,
      approach: property.approach,
      focusAreas: property.focusAreas,

      // Pricing
      pricing: {
        min: property.priceMin,
        max: property.priceMax,
        currency: property.currency,
      },

      // Details
      details: {
        website: property.website,
        foundedYear: property.foundedYear,
        capacity: property.capacity,
        accommodationType: property.accommodationType,
        diningDescription: property.diningDescription,
        facilitiesDescription: property.facilitiesDescription,
        setting: property.setting,
      },

      // Clarus Index Scores
      scores: {
        overall: property.overallScore,
        clinicalRigor: property.clinicalRigorScore,
        outcomeEvidence: property.outcomeEvidenceScore,
        programDepth: property.programDepthScore,
        experienceQuality: property.experienceQualityScore,
        valueAlignment: property.valueAlignmentScore,
        latestAssessment: property.indexScores[0] || null,
      },

      // Dark Data (Proprietary Intelligence)
      darkData: {
        physicianPatientRatio: property.physicianPatientRatio,
        avgBookingLeadTime: property.avgBookingLeadTime,
        returnGuestPercentage: property.returnGuestPercentage,
        staffTenure: property.staffTenure,
        actualCustomization: property.actualCustomization,
        postVisitFollowup: property.postVisitFollowup,
        discretionLevel: property.discretionLevel,
      },

      // Cultural Fit
      culturalFit: {
        genderSeparatedFacilities: property.genderSeparatedFacilities,
        religiousDietaryOptions: property.religiousDietaryOptions,
        privacyArchitecture: property.privacyArchitecture,
        prayerFacilities: property.prayerFacilities,
        languagesMedical: property.languagesMedical,
        languagesService: property.languagesService,
        soloTravelerFriendly: property.soloTravelerFriendly,
        lgbtqWelcoming: property.lgbtqWelcoming,
      },

      // Badges
      badges: {
        verifiedExcellence: property.verifiedExcellence,
        editorChoice: property.editorChoice,
        risingStar: property.risingStar,
        verifiedByProperty: property.verifiedByProperty,
      },

      // Tier 1 Medical Details
      medicalDetails: property.tierOneDetails
        ? {
            medicalDirector: property.tierOneDetails.medicalDirector,
            medicalDirectorCreds: property.tierOneDetails.medicalDirectorCreds,
            medicalTeamSize: property.tierOneDetails.medicalTeamSize,
            certifications: property.tierOneDetails.certifications,
            hospitalAffiliations: property.tierOneDetails.hospitalAffiliations,
            researchPublications: property.tierOneDetails.researchPublications,
          }
        : null,

      // Images
      images: property.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        aspectRatio: img.aspectRatio,
        category: img.category,
        isFeatured: img.isFeatured,
      })),

      // Programs
      programs: property.programs.map((program) => ({
        id: program.id,
        name: program.name,
        description: program.description,
        durationDays: program.durationDays,
        price: program.price,
        currency: program.currency,
        focusAreas: program.focusAreas,
        inclusions: program.inclusions,
        exclusions: program.exclusions,
        typicalSchedule: program.typicalSchedule,
      })),

      // Treatments
      treatments: property.treatments.map((pt) => ({
        id: pt.treatment.id,
        slug: pt.treatment.slug,
        name: pt.treatment.name,
        category: pt.treatment.category,
        evidenceLevel: pt.treatment.evidenceLevel,
        description: pt.treatment.description,
        priceAtProperty: pt.priceAtProperty,
        notes: pt.notes,
      })),

      // Diagnostics
      diagnostics: property.diagnostics.map((pd) => ({
        id: pd.diagnostic.id,
        slug: pd.diagnostic.slug,
        name: pd.diagnostic.name,
        category: pd.diagnostic.category,
        description: pd.diagnostic.description,
        notes: pd.notes,
      })),

      // Equipment
      equipment: property.equipment.map((pe) => ({
        id: pe.equipment.id,
        slug: pe.equipment.slug,
        name: pe.equipment.name,
        brand: pe.equipment.brand,
        model: pe.equipment.model,
        category: pe.equipment.category,
        installationYear: pe.installationYear,
        notes: pe.notes,
      })),

      // Review Statistics
      reviewStats,

      // Similar Properties
      similarProperties: similarProperties.map((p) => ({
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
      })),

      // Metadata
      updatedAt: property.updatedAt,
    };

    return NextResponse.json(transformedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

interface ReviewData {
  overallRating: number;
  serviceRating: number | null;
  facilitiesRating: number | null;
  diningRating: number | null;
  valueRating: number | null;
  goalAchievement: string | null;
}

function calculateReviewStats(reviews: ReviewData[]) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: null,
      ratings: null,
      outcomeStats: null,
    };
  }

  const totalReviews = reviews.length;

  // Calculate average ratings
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

  // Calculate outcome stats
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
