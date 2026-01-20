/**
 * POST /api/reviews/[id]/followup
 *
 * Submit a follow-up review (30, 90, or 180 days after visit)
 */

import { addFollowUp, getReviewById } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';
import type { FollowUpSubmissionData, ResultsSustainedLevel } from '@clarus-vitae/types';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

interface FollowUpBody {
  followUpPeriod: '30' | '90' | '180';
  resultsSustained: ResultsSustainedLevel;
  notes: string;
  updatedOutcomes?: {
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
  };
  verificationToken?: string;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: reviewId } = await params;
    const body = (await request.json()) as FollowUpBody;

    // Validate required fields
    if (!['30', '90', '180'].includes(body.followUpPeriod)) {
      return NextResponse.json(
        { error: 'Invalid follow-up period. Must be 30, 90, or 180.' },
        { status: 400 }
      );
    }

    if (!['fully', 'mostly', 'partially', 'not_sustained'].includes(body.resultsSustained)) {
      return NextResponse.json(
        { error: 'Invalid results sustained value' },
        { status: 400 }
      );
    }

    // Verify review exists and is approved
    const review = await getReviewById(reviewId);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Review must be approved before adding follow-ups' },
        { status: 400 }
      );
    }

    // Check if follow-up already exists
    const existingFollowUp =
      (body.followUpPeriod === '30' && review.followUp30Days) ||
      (body.followUpPeriod === '90' && review.followUp90Days) ||
      (body.followUpPeriod === '180' && review.followUp180Days);

    if (existingFollowUp) {
      return NextResponse.json(
        { error: `Follow-up for ${body.followUpPeriod} days already exists` },
        { status: 400 }
      );
    }

    // Submit the follow-up
    const submissionData: FollowUpSubmissionData = {
      reviewId,
      followUpPeriod: body.followUpPeriod,
      resultsSustained: body.resultsSustained,
      notes: body.notes || '',
      updatedOutcomes: body.updatedOutcomes,
    };

    const result = await addFollowUp(submissionData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to submit follow-up' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${body.followUpPeriod}-day follow-up submitted successfully`,
    });
  } catch (error) {
    console.error('Error submitting follow-up:', error);
    return NextResponse.json(
      { error: 'Failed to submit follow-up' },
      { status: 500 }
    );
  }
}
