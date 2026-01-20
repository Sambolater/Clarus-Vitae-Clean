/**
 * Reviews API
 *
 * POST /api/reviews - Submit a new review
 * GET /api/reviews - Get recent reviews across all properties
 */

import { createReview, getReviewAggregation } from '@clarus-vitae/database';
import { db } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';
import type { ReviewSubmissionData } from '@clarus-vitae/types';

export const dynamic = 'force-dynamic';

// ============================================
// POST - Submit a new review
// ============================================

interface SubmitReviewBody {
  propertyId: string;
  programId?: string;
  visitDate: string;
  stayDuration: number;
  programType: string;
  statedGoals?: string[];
  isFirstVisit?: boolean;
  ratingOverall: number;
  outcomeRatings?: {
    goalAchievement: number;
    protocolQuality: number;
    followupQuality: number;
    physicianEndorsement: number;
  };
  experienceRatings?: {
    facilities: number;
    service: number;
    food: number;
    value: number;
  };
  title?: string;
  reviewText: string;
  pros?: string[];
  cons?: string[];
  outcomes?: {
    biomarkers?: Array<{
      name: string;
      before: number;
      after: number;
      unit: string;
    }>;
    biologicalAgeChange?: number;
    weightChange?: number;
    energyLevelChange?: number;
    sleepQualityChange?: number;
    stressLevelChange?: number;
    painLevelChange?: number;
    customOutcomes?: Array<{
      description: string;
      change: string;
    }>;
  };
  displayNamePreference: 'initials' | 'verified_guest' | 'custom';
  customDisplayName?: string;
  email: string;
  publishConsent: boolean;
  followUpConsent: boolean;
  genuineExperienceConfirm: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitReviewBody;

    // Validate required fields
    if (!body.propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (!body.reviewText || body.reviewText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Review text must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Valid email is required for verification' },
        { status: 400 }
      );
    }

    if (!body.publishConsent || !body.genuineExperienceConfirm) {
      return NextResponse.json(
        { error: 'Required consents must be provided' },
        { status: 400 }
      );
    }

    if (body.ratingOverall < 1 || body.ratingOverall > 5) {
      return NextResponse.json(
        { error: 'Overall rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: body.propertyId },
      select: { id: true, name: true, tier: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Prepare submission data
    const submissionData: ReviewSubmissionData = {
      propertyId: body.propertyId,
      programId: body.programId,
      visitDate: new Date(body.visitDate),
      stayDuration: body.stayDuration,
      programType: body.programType,
      statedGoals: body.statedGoals,
      isFirstVisit: body.isFirstVisit,
      ratingOverall: body.ratingOverall,
      outcomeRatings: body.outcomeRatings,
      experienceRatings: body.experienceRatings,
      title: body.title,
      reviewText: body.reviewText.trim(),
      pros: body.pros?.filter((p) => p.trim()),
      cons: body.cons?.filter((c) => c.trim()),
      outcomes: body.outcomes,
      displayNamePreference: body.displayNamePreference,
      customDisplayName: body.customDisplayName,
      email: body.email,
      publishConsent: body.publishConsent,
      followUpConsent: body.followUpConsent,
      genuineExperienceConfirm: body.genuineExperienceConfirm,
    };

    // Create the review
    const result = await createReview(submissionData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviewId: result.reviewId,
      message:
        'Review submitted successfully. Please check your email to verify your review.',
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get recent reviews across properties
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      db.review.findMany({
        where: {
          status: 'APPROVED',
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              slug: true,
              tier: true,
              city: true,
              country: true,
            },
          },
          teamMember: {
            select: {
              name: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      db.review.count({
        where: { status: 'APPROVED' },
      }),
    ]);

    const transformedReviews = reviews.map((review) => ({
      id: review.id,
      property: {
        id: review.property.id,
        name: review.property.name,
        slug: review.property.slug,
        tier: review.property.tier,
        location: `${review.property.city}, ${review.property.country}`,
      },
      reviewer: {
        name: review.isTeamReview
          ? review.teamMember?.name || 'Clarus Team'
          : review.reviewerName || 'Verified Guest',
        isTeamReview: review.isTeamReview,
      },
      rating: review.overallRating,
      goalAchievement: review.goalAchievement,
      excerpt:
        review.reviewText.length > 200
          ? review.reviewText.substring(0, 200) + '...'
          : review.reviewText,
      verified: review.verified,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reviews: transformedReviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
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

// ============================================
// Helper Functions
// ============================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
