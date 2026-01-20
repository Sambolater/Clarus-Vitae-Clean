/**
 * Review Service
 *
 * Service for managing outcome-focused reviews.
 * Handles review submission, verification, follow-ups, and aggregation.
 */

import type {
  ReviewSubmissionData,
  FollowUpSubmissionData,
  ReviewAggregation,
  ReviewFilters,
  MeasurableOutcomes,
} from '@clarus-vitae/types';

import { db } from '../client';

// ============================================
// REVIEW SUBMISSION
// ============================================

export interface CreateReviewResult {
  success: boolean;
  reviewId?: string;
  verificationToken?: string;
  error?: string;
}

/**
 * Create a new review from submission data.
 * Returns a verification token for email verification.
 */
export async function createReview(
  data: ReviewSubmissionData
): Promise<CreateReviewResult> {
  try {
    // Generate display name based on preference
    let reviewerName: string;
    switch (data.displayNamePreference) {
      case 'initials': {
        // Extract initials from email or use "Anonymous"
        const emailName = data.email.split('@')[0] || 'anonymous';
        reviewerName = emailName
          .split(/[._-]/)
          .map((part) => part.charAt(0).toUpperCase())
          .join('') + '.';
        break;
      }
      case 'verified_guest':
        reviewerName = 'Verified Guest';
        break;
      case 'custom':
        reviewerName = data.customDisplayName || 'Anonymous';
        break;
      default:
        reviewerName = 'Anonymous';
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    const review = await db.review.create({
      data: {
        propertyId: data.propertyId,
        reviewerName,
        visitDate: data.visitDate,
        programType: data.programType,
        stayLengthDays: data.stayDuration,
        statedGoals: data.statedGoals || [],

        // Ratings
        overallRating: data.ratingOverall,
        serviceRating: data.experienceRatings?.service,
        facilitiesRating: data.experienceRatings?.facilities,
        diningRating: data.experienceRatings?.food,
        valueRating: data.experienceRatings?.value,

        // Outcome ratings (for Tier 1 & 2)
        goalAchievement: data.outcomeRatings
          ? mapGoalAchievement(data.outcomeRatings.goalAchievement)
          : null,
        protocolQualityRating: data.outcomeRatings?.protocolQuality,
        followupQualityRating: data.outcomeRatings?.followupQuality,
        physicianEndorsement: data.outcomeRatings
          ? mapPhysicianEndorsement(data.outcomeRatings.physicianEndorsement)
          : null,

        // Measurable outcomes
        bioAgeChange: data.outcomes?.biologicalAgeChange,
        weightChange: data.outcomes?.weightChange,
        energyImprovement: scaleToTen(data.outcomes?.energyLevelChange),
        sleepImprovement: scaleToTen(data.outcomes?.sleepQualityChange),
        specificOutcomes: data.outcomes
          ? JSON.stringify(serializeOutcomes(data.outcomes))
          : null,

        // Written content
        reviewText: data.reviewText,
        pros: data.pros || [],
        cons: data.cons || [],

        // Verification - pending until email confirmed
        verified: false,
        verificationMethod: 'email',

        // Status
        status: 'PENDING',
      },
    });

    return {
      success: true,
      reviewId: review.id,
      verificationToken,
    };
  } catch (error) {
    console.error('Failed to create review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// REVIEW VERIFICATION
// ============================================

/**
 * Verify a review using the verification token.
 */
export async function verifyReview(
  reviewId: string,
  method: 'email' | 'booking_confirmation' | 'property_confirm' = 'email'
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.review.update({
      where: { id: reviewId },
      data: {
        verified: true,
        verificationMethod: method,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to verify review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// REVIEW MODERATION
// ============================================

export type ModerationAction = 'approve' | 'reject' | 'flag';

/**
 * Moderate a review (approve, reject, or flag).
 */
export async function moderateReview(
  reviewId: string,
  action: ModerationAction,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const statusMap: Record<ModerationAction, 'APPROVED' | 'REJECTED' | 'FLAGGED'> = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      flag: 'FLAGGED',
    };

    await db.review.update({
      where: { id: reviewId },
      data: {
        status: statusMap[action],
        moderationNotes: notes,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to moderate review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// FOLLOW-UP REVIEWS
// ============================================

/**
 * Add a follow-up review (30, 90, or 180 days).
 */
export async function addFollowUp(
  data: FollowUpSubmissionData
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, string> = {};

    const followUpContent = JSON.stringify({
      resultsSustained: data.resultsSustained,
      notes: data.notes,
      updatedOutcomes: data.updatedOutcomes,
      submittedAt: new Date().toISOString(),
    });

    switch (data.followUpPeriod) {
      case '30':
        updateData.followUp30Days = followUpContent;
        break;
      case '90':
        updateData.followUp90Days = followUpContent;
        break;
      case '180':
        updateData.followUp180Days = followUpContent;
        break;
    }

    await db.review.update({
      where: { id: data.reviewId },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to add follow-up:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get reviews eligible for follow-up reminders.
 */
export async function getReviewsForFollowUp(period: '30' | '90' | '180'): Promise<
  Array<{
    id: string;
    propertyId: string;
    reviewerName: string | null;
    visitDate: Date;
  }>
> {
  const daysAgo = parseInt(period);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysAgo);

  // Get reviews from around that time that haven't had follow-ups yet
  const startDate = new Date(targetDate);
  startDate.setDate(startDate.getDate() - 3);
  const endDate = new Date(targetDate);
  endDate.setDate(endDate.getDate() + 3);

  // Build the follow-up field condition based on period
  const followUpCondition =
    period === '30'
      ? { followUp30Days: null }
      : period === '90'
        ? { followUp90Days: null }
        : { followUp180Days: null };

  const reviews = await db.review.findMany({
    where: {
      status: 'APPROVED',
      visitDate: {
        gte: startDate,
        lte: endDate,
      },
      ...followUpCondition,
    },
    select: {
      id: true,
      propertyId: true,
      reviewerName: true,
      visitDate: true,
    },
  });

  return reviews;
}

// ============================================
// REVIEW AGGREGATION
// ============================================

/**
 * Get aggregated review statistics for a property.
 */
export async function getReviewAggregation(
  propertyId: string
): Promise<ReviewAggregation | null> {
  const reviews = await db.review.findMany({
    where: {
      propertyId,
      status: 'APPROVED',
    },
  });

  if (reviews.length === 0) {
    return null;
  }

  type ReviewItem = typeof reviews[number];
  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter((r: ReviewItem) => r.verified).length;
  const teamReviewCount = reviews.filter((r: ReviewItem) => r.isTeamReview).length;

  // Calculate overall average
  const overallSum = reviews.reduce((sum: number, r: ReviewItem) => sum + r.overallRating, 0);
  const overallAverage = Number((overallSum / totalReviews).toFixed(1));

  // Calculate experience averages
  const facilitiesRatings = reviews.filter((r: ReviewItem) => r.facilitiesRating !== null);
  const serviceRatings = reviews.filter((r: ReviewItem) => r.serviceRating !== null);
  const diningRatings = reviews.filter((r: ReviewItem) => r.diningRating !== null);
  const valueRatings = reviews.filter((r: ReviewItem) => r.valueRating !== null);

  const facilitiesAvg =
    facilitiesRatings.length > 0
      ? Number(
          (
            facilitiesRatings.reduce((sum: number, r: ReviewItem) => sum + (r.facilitiesRating || 0), 0) /
            facilitiesRatings.length
          ).toFixed(1)
        )
      : undefined;

  const serviceAvg =
    serviceRatings.length > 0
      ? Number(
          (
            serviceRatings.reduce((sum: number, r: ReviewItem) => sum + (r.serviceRating || 0), 0) /
            serviceRatings.length
          ).toFixed(1)
        )
      : undefined;

  const foodAvg =
    diningRatings.length > 0
      ? Number(
          (
            diningRatings.reduce((sum: number, r: ReviewItem) => sum + (r.diningRating || 0), 0) /
            diningRatings.length
          ).toFixed(1)
        )
      : undefined;

  const valueAvg =
    valueRatings.length > 0
      ? Number(
          (
            valueRatings.reduce((sum: number, r: ReviewItem) => sum + (r.valueRating || 0), 0) /
            valueRatings.length
          ).toFixed(1)
        )
      : undefined;

  // Calculate outcome averages
  const protocolRatings = reviews.filter((r: ReviewItem) => r.protocolQualityRating !== null);
  const followupRatings = reviews.filter((r: ReviewItem) => r.followupQualityRating !== null);

  const protocolQualityAvg =
    protocolRatings.length > 0
      ? Number(
          (
            protocolRatings.reduce((sum: number, r: ReviewItem) => sum + (r.protocolQualityRating || 0), 0) /
            protocolRatings.length
          ).toFixed(1)
        )
      : undefined;

  const followupQualityAvg =
    followupRatings.length > 0
      ? Number(
          (
            followupRatings.reduce((sum: number, r: ReviewItem) => sum + (r.followupQualityRating || 0), 0) /
            followupRatings.length
          ).toFixed(1)
        )
      : undefined;

  // Goal achievement distribution
  const goalAchievementDistribution = {
    fully: reviews.filter((r: ReviewItem) => r.goalAchievement === 'FULLY').length,
    partially: reviews.filter((r: ReviewItem) => r.goalAchievement === 'PARTIALLY').length,
    notAchieved: reviews.filter((r: ReviewItem) => r.goalAchievement === 'NOT_ACHIEVED').length,
  };

  // Calculate goal achievement average (FULLY=5, PARTIALLY=3, NOT_ACHIEVED=1)
  const goalAchievementReviews = reviews.filter((r: ReviewItem) => r.goalAchievement !== null);
  const goalAchievementAvg =
    goalAchievementReviews.length > 0
      ? Number(
          (
            goalAchievementReviews.reduce((sum: number, r: ReviewItem) => {
              if (r.goalAchievement === 'FULLY') return sum + 5;
              if (r.goalAchievement === 'PARTIALLY') return sum + 3;
              return sum + 1;
            }, 0) / goalAchievementReviews.length
          ).toFixed(1)
        )
      : undefined;

  // Physician endorsement average
  const physicianReviews = reviews.filter((r: ReviewItem) => r.physicianEndorsement !== null);
  const physicianEndorsementAvg =
    physicianReviews.length > 0
      ? Number(
          (
            physicianReviews.reduce((sum: number, r: ReviewItem) => {
              if (r.physicianEndorsement === 'YES') return sum + 5;
              if (r.physicianEndorsement === 'PROBABLY') return sum + 4;
              if (r.physicianEndorsement === 'UNSURE') return sum + 2;
              return sum + 1;
            }, 0) / physicianReviews.length
          ).toFixed(1)
        )
      : undefined;

  // Follow-up data
  const thirtyDayFollowUps = reviews.filter((r: ReviewItem) => r.followUp30Days !== null);
  const ninetyDayFollowUps = reviews.filter((r: ReviewItem) => r.followUp90Days !== null);
  const oneEightyDayFollowUps = reviews.filter((r: ReviewItem) => r.followUp180Days !== null);

  const followUpData = {
    thirtyDayCount: thirtyDayFollowUps.length,
    thirtyDayFullySustained: countFullySustained(thirtyDayFollowUps, 'followUp30Days'),
    ninetyDayCount: ninetyDayFollowUps.length,
    ninetyDayFullySustained: countFullySustained(ninetyDayFollowUps, 'followUp90Days'),
    oneEightyDayCount: oneEightyDayFollowUps.length,
    oneEightyDayFullySustained: countFullySustained(oneEightyDayFollowUps, 'followUp180Days'),
  };

  return {
    totalReviews,
    verifiedCount,
    teamReviewCount,
    overallAverage,
    goalAchievementAvg,
    protocolQualityAvg,
    followupQualityAvg,
    physicianEndorsementAvg,
    facilitiesAvg,
    serviceAvg,
    foodAvg,
    valueAvg,
    followUpData,
    goalAchievementDistribution,
  };
}

// ============================================
// REVIEW QUERIES
// ============================================

/**
 * Get reviews for a property with filtering and sorting.
 */
export async function getPropertyReviews(
  propertyId: string,
  filters?: Partial<ReviewFilters>,
  pagination?: { page: number; limit: number }
) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {
    propertyId,
    status: 'APPROVED',
  };

  if (filters?.verifiedOnly) {
    where.verified = true;
  }

  if (filters?.teamReviewsOnly) {
    where.isTeamReview = true;
  }

  if (filters?.programType) {
    where.programType = filters.programType;
  }

  if (filters?.ratingMin) {
    where.overallRating = { gte: filters.ratingMin };
  }

  if (filters?.timeframe) {
    const now = new Date();
    const cutoffDate = new Date();
    switch (filters.timeframe) {
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case '2years':
        cutoffDate.setFullYear(now.getFullYear() - 2);
        break;
    }
    if (filters.timeframe !== 'all') {
      where.visitDate = { gte: cutoffDate };
    }
  }

  if (filters?.hasOutcomes) {
    where.specificOutcomes = { not: null };
  }

  // Build orderBy
  let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
  switch (filters?.sortBy) {
    case 'highest_rating':
      orderBy = { overallRating: 'desc' };
      break;
    case 'lowest_rating':
      orderBy = { overallRating: 'asc' };
      break;
    case 'most_helpful':
      orderBy = { helpfulCount: 'desc' };
      break;
    case 'recent':
    default:
      orderBy = { createdAt: 'desc' };
  }

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        property: {
          select: {
            name: true,
            slug: true,
            tier: true,
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
    db.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single review by ID with full details.
 */
export async function getReviewById(reviewId: string) {
  return db.review.findUnique({
    where: { id: reviewId },
    include: {
      property: {
        select: {
          name: true,
          slug: true,
          tier: true,
        },
      },
      teamMember: {
        select: {
          name: true,
          title: true,
          slug: true,
          credentials: true,
        },
      },
    },
  });
}

/**
 * Mark a review as helpful.
 */
export async function markReviewHelpful(
  reviewId: string
): Promise<{ success: boolean; newCount: number }> {
  const review = await db.review.update({
    where: { id: reviewId },
    data: {
      helpfulCount: {
        increment: 1,
      },
    },
    select: { helpfulCount: true },
  });

  return {
    success: true,
    newCount: review.helpfulCount,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateVerificationToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function mapGoalAchievement(rating: number): 'FULLY' | 'PARTIALLY' | 'NOT_ACHIEVED' {
  if (rating >= 4) return 'FULLY';
  if (rating >= 3) return 'PARTIALLY';
  return 'NOT_ACHIEVED';
}

function mapPhysicianEndorsement(rating: number): 'YES' | 'PROBABLY' | 'UNSURE' | 'NO' {
  if (rating >= 5) return 'YES';
  if (rating >= 4) return 'PROBABLY';
  if (rating >= 2) return 'UNSURE';
  return 'NO';
}

function scaleToTen(value: number | undefined): number | undefined {
  if (value === undefined) return undefined;
  // Convert -5 to +5 scale to 1-10 scale
  return Math.round(value + 5);
}

function serializeOutcomes(outcomes: MeasurableOutcomes): Record<string, unknown> {
  return {
    biomarkers: outcomes.biomarkers,
    biologicalAgeChange: outcomes.biologicalAgeChange,
    weightChange: outcomes.weightChange,
    energyLevelChange: outcomes.energyLevelChange,
    sleepQualityChange: outcomes.sleepQualityChange,
    stressLevelChange: outcomes.stressLevelChange,
    painLevelChange: outcomes.painLevelChange,
    customOutcomes: outcomes.customOutcomes,
  };
}

interface ReviewWithFollowUp {
  followUp30Days: string | null;
  followUp90Days: string | null;
  followUp180Days: string | null;
}

function countFullySustained(
  reviews: ReviewWithFollowUp[],
  field: 'followUp30Days' | 'followUp90Days' | 'followUp180Days'
): number {
  return reviews.filter((r) => {
    const content = r[field];
    if (!content) return false;
    try {
      const parsed = JSON.parse(content);
      return parsed.resultsSustained === 'fully';
    } catch {
      return false;
    }
  }).length;
}
