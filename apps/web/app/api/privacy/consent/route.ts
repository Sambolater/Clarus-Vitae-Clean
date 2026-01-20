import { type NextRequest, NextResponse } from 'next/server';

/**
 * Privacy Consent API
 *
 * Manages user consent preferences for cookies and data processing.
 * Implements GDPR-compliant consent tracking.
 */

interface ConsentRecord {
  essential: boolean;      // Always true
  analytics: boolean;      // Self-hosted Plausible
  functional: boolean;     // Preferences and saved items
  timestamp: string;
  version: string;
  ipHash?: string;
}

// Current privacy policy version
const PRIVACY_POLICY_VERSION = '1.0.0';

/**
 * GET - Retrieve current consent status (from cookie)
 */
export async function GET(request: NextRequest) {
  try {
    // Check for consent cookie
    const consentCookie = request.cookies.get('clarus_consent');

    if (!consentCookie?.value) {
      // No consent recorded - return defaults (Research Mode)
      return NextResponse.json({
        success: true,
        consent: {
          essential: true,
          analytics: false,
          functional: false,
        },
        isDefault: true,
        policyVersion: PRIVACY_POLICY_VERSION,
      });
    }

    // Parse stored consent
    try {
      const consent = JSON.parse(consentCookie.value);
      return NextResponse.json({
        success: true,
        consent: {
          essential: true, // Always true
          analytics: consent.analytics ?? false,
          functional: consent.functional ?? false,
        },
        isDefault: false,
        policyVersion: consent.version || PRIVACY_POLICY_VERSION,
        recordedAt: consent.timestamp,
      });
    } catch {
      // Invalid cookie - return defaults
      return NextResponse.json({
        success: true,
        consent: {
          essential: true,
          analytics: false,
          functional: false,
        },
        isDefault: true,
        policyVersion: PRIVACY_POLICY_VERSION,
      });
    }
  } catch (error) {
    console.error('Consent retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve consent status' },
      { status: 500 }
    );
  }
}

/**
 * POST - Update consent preferences
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analytics = false, functional = false } = body;

    // Build consent record
    const consentRecord: ConsentRecord = {
      essential: true, // Always required
      analytics: Boolean(analytics),
      functional: Boolean(functional),
      timestamp: new Date().toISOString(),
      version: PRIVACY_POLICY_VERSION,
    };

    // Create response with consent cookie
    const response = NextResponse.json({
      success: true,
      consent: {
        essential: true,
        analytics: consentRecord.analytics,
        functional: consentRecord.functional,
      },
      policyVersion: PRIVACY_POLICY_VERSION,
      recordedAt: consentRecord.timestamp,
    });

    // Set consent cookie (1 year expiry)
    const cookieValue = JSON.stringify(consentRecord);
    response.cookies.set('clarus_consent', cookieValue, {
      httpOnly: false, // Needs to be readable by client JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });

    // Also set consent banner cookie to prevent showing banner again
    response.cookies.set('clarus_consent_banner', 'seen', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    // In production, also log consent for audit trail
    // await db.consentLog.create({
    //   data: {
    //     sessionId: request.cookies.get('session')?.value,
    //     ipHash: hashIp(request.ip),
    //     consent: consentRecord,
    //     userAgent: request.headers.get('user-agent'),
    //   }
    // });

    return response;
  } catch (error) {
    console.error('Consent update error:', error);
    return NextResponse.json(
      { error: 'Failed to update consent preferences' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Withdraw all non-essential consent
 */
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Consent withdrawn. Research Mode enabled.',
      consent: {
        essential: true,
        analytics: false,
        functional: false,
      },
    });

    // Clear consent cookie
    response.cookies.delete('clarus_consent');

    // Keep banner cookie so user isn't prompted again
    // They've made their choice (Research Mode)
    response.cookies.set('clarus_consent_banner', 'seen', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Consent withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}
