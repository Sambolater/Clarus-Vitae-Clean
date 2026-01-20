import { NextRequest, NextResponse } from 'next/server';

/**
 * Privacy Verification API
 *
 * Sends a verification code to the user's email to verify identity
 * before allowing access to privacy dashboard actions.
 */

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map<
  string,
  { code: string; expiry: Date; attempts: number }
>();

// Rate limiting (use Redis in production)
const rateLimits = new Map<string, { count: number; resetAt: Date }>();

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const CODE_EXPIRY = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a 6-digit verification code
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = new Date();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, {
      count: 1,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW),
    });
    return true;
  }

  if (limit.count >= MAX_ATTEMPTS) {
    return false;
  }

  limit.count++;
  return true;
}

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

/**
 * Verify a code (exported for use by other routes)
 */
export function verifyCode(email: string, code: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const stored = verificationCodes.get(normalizedEmail);

  if (!stored) {
    return false;
  }

  // Check expiry
  if (new Date() > stored.expiry) {
    verificationCodes.delete(normalizedEmail);
    return false;
  }

  // Check attempts
  if (stored.attempts >= MAX_ATTEMPTS) {
    verificationCodes.delete(normalizedEmail);
    return false;
  }

  stored.attempts++;

  // Verify code
  if (stored.code !== code) {
    return false;
  }

  // Code is valid - remove it (single use)
  verificationCodes.delete(normalizedEmail);
  return true;
}
