/**
 * Inquiry Status API
 *
 * PATCH /api/inquiries/[id]/status - Update inquiry status
 *
 * Used for:
 * - Properties to update when they've viewed/responded to an inquiry
 * - Admin to track conversions
 * - Lead attribution tracking
 */

import { updateInquiryStatus, getInquiryById } from '@clarus-vitae/database';
import type { InquiryStatus } from '@clarus-vitae/types';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Valid status transitions
const VALID_STATUSES: InquiryStatus[] = [
  'CONTACTED',
  'QUALIFIED',
  'SENT_TO_PROPERTY',
  'CONVERTED',
  'CLOSED',
];

// ============================================
// PATCH - Update inquiry status
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;

    // In production, this would verify the property's API key
    // const apiKey = request.headers.get('X-Property-API-Key');
    // if (!apiKey || !(await validatePropertyAPIKey(apiKey, inquiryId))) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // Validate status
    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(body.status as InquiryStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Verify inquiry exists
    const inquiry = await getInquiryById(inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Update status
    const result = await updateInquiryStatus(
      inquiryId,
      body.status as InquiryStatus,
      body.notes,
      body.changedBy
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      newStatus: body.status,
      message: 'Inquiry status updated successfully',
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry status' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get inquiry status (for tracking)
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;

    const inquiry = await getInquiryById(inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      status: inquiry.status,
      propertyNotified: inquiry.propertyNotified,
      propertyNotifiedAt: inquiry.propertyNotifiedAt,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching inquiry status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiry status' },
      { status: 500 }
    );
  }
}
