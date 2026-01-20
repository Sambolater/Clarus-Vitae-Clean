import { type NextRequest, NextResponse } from 'next/server';
import {
  verificationCodes,
  generateCode,
  checkRateLimit,
  RATE_LIMIT_WINDOW,
  CODE_EXPIRY,
} from './utils';

/**
 * Privacy Verification API
 *
 * Sends a verification code to the user's email to verify identity
 * before allowing access to privacy dashboard actions.
 */

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateCode();
    const expiry = new Date(Date.now() + CODE_EXPIRY);

    // Store code (in production, use Redis with TTL)
    verificationCodes.set(normalizedEmail, {
      code,
      expiry,
      attempts: 0,
    });

    // In production, send email via transactional email service
    // For now, log it (remove in production)
    console.log(`[DEV] Verification code for ${normalizedEmail}: ${code}`);

    // TODO: Implement actual email sending
    // await sendVerificationEmail(normalizedEmail, code);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expiresIn: Math.ceil(CODE_EXPIRY / 1000),
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
