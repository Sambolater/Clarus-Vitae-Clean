/**
 * Privacy Verification Utilities
 *
 * Shared verification code logic used by privacy API routes.
 */

// In-memory store for verification codes (use Redis in production)
export const verificationCodes = new Map<
  string,
  { code: string; expiry: Date; attempts: number }
>();

// Rate limiting (use Redis in production)
export const rateLimits = new Map<string, { count: number; resetAt: Date }>();

export const MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
export const CODE_EXPIRY = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a 6-digit verification code
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check rate limit for an IP address
 */
export function checkRateLimit(ip: string): boolean {
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

/**
 * Verify a code
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
