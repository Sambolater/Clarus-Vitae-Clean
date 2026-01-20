/**
 * POST /api/reviews/[id]/verify
 *
 * Verify a review (email verification, booking confirmation, or property confirm)
 */

import { verifyReview, getReviewById } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

interface VerifyBody {
  method: 'email' | 'booking_confirmation' | 'property_confirm';
  token?: string;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: reviewId } = await params;
    const body = (await request.json()) as VerifyBody;

    // Validate method
    if (!['email', 'booking_confirmation', 'property_confirm'].includes(body.method)) {
      return NextResponse.json(
        { error: 'Invalid verification method' },
        { status: 400 }
      );
    }

    // Verify review exists
    const review = await getReviewById(reviewId);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.verified) {
      return NextResponse.json(
        { error: 'Review is already verified' },
        { status: 400 }
      );
    }

    // Perform verification
    const result = await verifyReview(reviewId, body.method);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to verify review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review verified successfully',
    });
  } catch (error) {
    console.error('Error verifying review:', error);
    return NextResponse.json(
      { error: 'Failed to verify review' },
      { status: 500 }
    );
  }
}
