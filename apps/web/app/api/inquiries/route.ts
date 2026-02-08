/**
 * Inquiries API
 *
 * POST /api/inquiries - Submit a new standard inquiry
 * GET /api/inquiries - Get inquiries (admin only)
 */

import { createInquiry, db } from '@clarus-vitae/database';
import type { InquiryInput } from '@clarus-vitae/types';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ============================================
// POST - Submit a new inquiry
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryInput;

    // Validate required fields
    if (!body.propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
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
        { success: false, error: 'Consent to contact property is required' },
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

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: body.propertyId },
      select: { id: true, name: true, published: true },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Extract attribution from request headers/query
    const attribution = extractAttribution(request);

    // Create the inquiry
    const result = await createInquiry(body, attribution);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    // Send lead notification via Brevo (fire and forget)
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY!,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Clarus Vitae', email: 'noreply@agenticsadvisory.ai' },
          to: [{ email: 'sam@agenticsadvisory.ai', name: 'Sam McKay' }],
          subject: `New Inquiry from Clarus Vitae - ${property.name}`,
          htmlContent: `
            <h2>New Inquiry from Clarus Vitae</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Property:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${property.name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.email}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.phone || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Goals:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.primaryGoals?.join(', ') || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Budget:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.budgetRange || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Dates:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.preferredDates || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${body.message || 'N/A'}</td></tr>
            </table>
          `,
        }),
      });
    } catch (emailError) {
      // Don't fail the inquiry if email notification fails
      console.error('Failed to send Brevo notification:', emailError);
    }

    return NextResponse.json({
      success: true,
      inquiryId: result.inquiryId,
      message: 'Your inquiry has been sent. The property will contact you directly.',
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get inquiries (would need auth in production)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (status) {
      where.status = status;
    }

    const [inquiries, totalCount] = await Promise.all([
      db.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          propertyId: true,
          status: true,
          createdAt: true,
          budgetRange: true,
          primaryGoals: true,
          propertyNotified: true,
          propertyNotifiedAt: true,
          property: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      db.inquiry.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      inquiries,
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
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
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
  // Allow various phone formats with country codes
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
    sourcePage: searchParams.get('source') || undefined,
    sourceUrl: referer || undefined,
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
  };
}
