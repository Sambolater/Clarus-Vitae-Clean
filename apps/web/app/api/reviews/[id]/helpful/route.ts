/**
 * POST /api/reviews/[id]/helpful
 *
 * Mark a review as helpful (increment helpful count)
 */

import { markReviewHelpful } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: reviewId } = await params;

    const result = await markReviewHelpful(reviewId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to mark review as helpful' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      helpfulCount: result.newCount,
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}
