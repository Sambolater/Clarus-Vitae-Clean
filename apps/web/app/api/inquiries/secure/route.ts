/**
 * Secure Inquiries API
 *
 * POST /api/inquiries/secure - Submit a secure inquiry with enhanced privacy
 *
 * Enhanced protections:
 * - Minimal data retention
 * - Alternative contact methods (Signal, secure callback)
 * - Auto-deletion support
 */

import { createSecureInquiry, db } from '@clarus-vitae/database';
import type { SecureInquiryInput } from '@clarus-vitae/types';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ============================================
// POST - Submit a secure inquiry
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SecureInquiryInput;

    // Validate required fields
    if (!body.propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (!body.name || body.name.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: 'Name or pseudonym is required' },
        { status: 400 }
      );
    }

    if (!body.contactMethod) {
      return NextResponse.json(
        { success: false, error: 'Contact method is required' },
        { status: 400 }
      );
    }

    if (!body.contactValue || body.contactValue.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: 'Contact information is required' },
        { status: 400 }
      );
    }

    // Validate contact value based on method
    if (
      (body.contactMethod === 'EMAIL' || body.contactMethod === 'SECURE_EMAIL') &&
      !isValidEmail(body.contactValue)
    ) {
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

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: body.propertyId },
      select: { id: true, name: true },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Extract minimal attribution (no full URL for secure inquiries)
    const referer = request.headers.get('referer');
    const attribution = {
      sourcePage: referer ? extractPagePath(referer) : undefined,
      // Don't store full URL for secure inquiries
    };

    // Create the secure inquiry
    const result = await createSecureInquiry(body, attribution);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit secure inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId: result.inquiryId,
      message: 'Your secure inquiry has been sent.',
      autoDeleteEnabled: body.autoDelete || false,
    });
  } catch (error) {
    console.error('Error submitting secure inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit secure inquiry' },
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

function extractPagePath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '';
  }
}
