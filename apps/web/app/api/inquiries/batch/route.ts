/**
 * Batch Inquiries API
 *
 * POST /api/inquiries/batch - Submit inquiries to multiple properties at once
 *
 * Used from the comparison tool to contact multiple properties.
 */

import { createBatchInquiries, db } from '@clarus-vitae/database';
import type { BatchInquiryInput } from '@clarus-vitae/types';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Maximum number of properties per batch inquiry
const MAX_BATCH_SIZE = 5;

// ============================================
// POST - Submit batch inquiries
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BatchInquiryInput;

    // Validate required fields
    if (!body.propertyIds || body.propertyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one property ID is required' },
        { status: 400 }
      );
    }

    if (body.propertyIds.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_BATCH_SIZE} properties per batch inquiry` },
        { status: 400 }
      );
    }

    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!body.consentContactProperty) {
      return NextResponse.json(
        { success: false, error: 'Consent to contact properties is required' },
        { status: 400 }
      );
    }

    if (!body.privacyPolicyAccepted) {
      return NextResponse.json(
        { success: false, error: 'Privacy policy acceptance is required' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (body.phone && !isValidPhone(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Verify all properties exist
    const properties = await db.property.findMany({
      where: {
        id: { in: body.propertyIds },
      },
      select: { id: true, name: true, published: true },
    });

    if (properties.length !== body.propertyIds.length) {
      const foundIds = new Set(properties.map((p: { id: string }) => p.id));
      const missingIds = body.propertyIds.filter((id: string) => !foundIds.has(id));
      return NextResponse.json(
        { success: false, error: `Properties not found: ${missingIds.join(', ')}` },
        { status: 404 }
      );
    }

    // Extract attribution from request
    const attribution = extractAttribution(request);

    // Create batch inquiries
    const result = await createBatchInquiries(body, attribution);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to submit some inquiries',
          errors: result.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiryIds: result.inquiryIds,
      count: result.inquiryIds?.length || 0,
      message: `Successfully sent inquiries to ${result.inquiryIds?.length || 0} properties.`,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error submitting batch inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit batch inquiries' },
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

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-()]{7,}$/;
  return phoneRegex.test(phone);
}

function extractAttribution(request: NextRequest): {
  sourcePage?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} {
  const { searchParams } = new URL(request.url);
  const referer = request.headers.get('referer');

  return {
    sourcePage: searchParams.get('source') || 'comparison',
    sourceUrl: referer || undefined,
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
  };
}
