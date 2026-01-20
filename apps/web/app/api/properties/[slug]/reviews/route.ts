/**
 * GET /api/properties/[slug]/reviews
 *
 * Retrieves paginated reviews for a specific property with
 * filtering by verified status and sorting options.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, Prisma } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

interface ReviewsQueryParams {
  page: number;
  limit: number;
  sort: SortOption;
  verified?: boolean;
  teamOnly?: boolean;
}

interface Params {
  params: Promise<{ slug: string }>;
}

function parseQueryParams(request: NextRequest): ReviewsQueryParams {
  const { searchParams } = new URL(request.url);

  return {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: Math.min(
      searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10,
      50
    ),
    sort: (searchParams.get('sort') as SortOption) || 'newest',
    verified: searchParams.get('verified') === 'true' ? true : undefined,
    teamOnly: searchParams.get('team') === 'true' ? true : undefined,
  };
}

function buildOrderBy(sort: SortOption): Prisma.ReviewOrderByWithRelationInput {
  switch (sort) {
    case 'newest':
      return { createdAt: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'highest':
      return { overallRating: 'desc' };
    case 'lowest':
      return { overallRating: 'asc' };
    case 'helpful':
      return { helpfulCount: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const queryParams = parseQueryParams(request);

    // First find the property by slug
    const property = await db.property.findUnique({
      where: { slug, published: true },
      select: { id: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Build where clause for reviews
    const where: Prisma.ReviewWhereInput = {
      propertyId: property.id,
      status: 'APPROVED',
    };

    if (queryParams.verified) {
      where.verified = true;
    }

    if (queryParams.teamOnly) {
      where.isTeamReview = true;
    }

    const orderBy = buildOrderBy(queryParams.sort);
    const skip = (queryParams.page - 1) * queryParams.limit;

    // Execute count and data queries in parallel
    const [totalCount, reviews] = await Promise.all([
      db.review.count({ where }),
      db.review.findMany({
        where,
        orderBy,
        skip,
        take: queryParams.limit,
        include: {
          teamMember: {
            select: {
              name: true,
              title: true,
              photoUrl: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    // Transform reviews for response
    const transformedReviews = reviews.map((review) => ({
      id: review.id,

      // Reviewer info
      reviewer: {
        name: review.isTeamReview
          ? review.teamMember?.name || 'Clarus Team'
          : review.reviewerName || 'Anonymous',
        isTeamReview: review.isTeamReview,
        teamMember: review.teamMember
          ? {
              name: review.teamMember.name,
              title: review.teamMember.title,
              photoUrl: review.teamMember.photoUrl,
              slug: review.teamMember.slug,
            }
          : null,
      },

      // Visit context
      visitContext: {
        visitDate: review.visitDate,
        programType: review.programType,
        stayLengthDays: review.stayLengthDays,
        statedGoals: review.statedGoals,
      },

      // Ratings
      ratings: {
        overall: review.overallRating,
        service: review.serviceRating,
        facilities: review.facilitiesRating,
        dining: review.diningRating,
        value: review.valueRating,
      },

      // Outcome ratings (Tier 1 & 2)
      outcomes: {
        goalAchievement: review.goalAchievement,
        protocolQuality: review.protocolQualityRating,
        followupQuality: review.followupQualityRating,
        physicianEndorsement: review.physicianEndorsement,
      },

      // Measurable outcomes
      measurables: {
        bioAgeChange: review.bioAgeChange,
        weightChange: review.weightChange,
        energyImprovement: review.energyImprovement,
        sleepImprovement: review.sleepImprovement,
        specificOutcomes: review.specificOutcomes,
      },

      // Written review
      content: {
        text: review.reviewText,
        pros: review.pros,
        cons: review.cons,
      },

      // Verification
      verification: {
        isVerified: review.verified,
        verificationMethod: review.verificationMethod,
      },

      // Follow-ups
      followUps: {
        day30: review.followUp30Days,
        day90: review.followUp90Days,
        day180: review.followUp180Days,
      },

      // Property response
      propertyResponse: review.propertyResponse
        ? {
            text: review.propertyResponse,
            respondedAt: review.propertyRespondedAt,
          }
        : null,

      // Meta
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
    }));

    const totalPages = Math.ceil(totalCount / queryParams.limit);

    return NextResponse.json({
      reviews: transformedReviews,
      pagination: {
        page: queryParams.page,
        limit: queryParams.limit,
        totalCount,
        totalPages,
        hasNextPage: queryParams.page < totalPages,
        hasPreviousPage: queryParams.page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
