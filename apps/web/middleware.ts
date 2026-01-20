/**
 * Next.js Middleware
 *
 * Implements privacy-first security headers and URL cleaning.
 * Simplified for Edge Runtime compatibility.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Tracking parameters to strip from URLs
 */
const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'fbclid',
  'gclid',
  'gclsrc',
  'msclkid',
  'mc_cid',
  'mc_eid',
  'twclid',
  '_ga',
  '_gl',
];

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl;

    // Check if any tracking params exist
    let hasTrackingParams = false;
    for (const param of TRACKING_PARAMS) {
      if (url.searchParams.has(param)) {
        hasTrackingParams = true;
        break;
      }
    }

    // If tracking params exist, redirect to clean URL
    if (hasTrackingParams) {
      const cleanUrl = new URL(url.toString());
      TRACKING_PARAMS.forEach((param) => {
        cleanUrl.searchParams.delete(param);
      });
      return NextResponse.redirect(cleanUrl, { status: 301 });
    }

    // Create response
    const response = NextResponse.next();

    // Set security headers
    const headers = response.headers;

    // Content Security Policy - permissive enough for Next.js to work
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
    );

    // Referrer Policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy - disable tracking APIs
    headers.set(
      'Permissions-Policy',
      'interest-cohort=(), browsing-topics=(), camera=(), microphone=(), geolocation=()'
    );

    // X-Frame-Options
    headers.set('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    headers.set('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection
    headers.set('X-XSS-Protection', '1; mode=block');

    // Strict-Transport-Security
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );

    return response;
  } catch (error) {
    // Log error but don't crash - just pass through
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

/**
 * Matcher configuration
 * Apply middleware to all routes except static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
