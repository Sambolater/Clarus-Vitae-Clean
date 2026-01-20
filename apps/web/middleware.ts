/**
 * Next.js Middleware
 *
 * Implements privacy-first security headers and URL cleaning.
 *
 * Security features:
 * - Content Security Policy (CSP) - blocks third-party tracking
 * - Referrer Policy - limits information leakage
 * - Permissions Policy - disables tracking APIs
 * - X-Frame-Options - prevents clickjacking
 * - URL parameter stripping - removes tracking params
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Tracking parameters to strip from URLs
 */
const TRACKING_PARAMS = [
  // UTM parameters
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  // Meta/Facebook
  'fbclid',
  'fb_action_ids',
  'fb_action_types',
  'fb_source',
  // Google
  'gclid',
  'gclsrc',
  'dclid',
  // Microsoft/Bing
  'msclkid',
  // Mailchimp
  'mc_cid',
  'mc_eid',
  // Twitter
  'twclid',
  // General tracking
  'ref',
  '_ga',
  '_gl',
  // HubSpot
  'hsa_acc',
  'hsa_cam',
  'hsa_grp',
  'hsa_ad',
  'hsa_src',
  'hsa_tgt',
  'hsa_kw',
  'hsa_mt',
  'hsa_net',
  'hsa_ver',
];

/**
 * Build Content Security Policy header
 * Strict by default, blocks all third-party tracking
 */
function buildCSP(): string {
  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "'unsafe-eval'",   // Required for development - TODO: remove in production
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',          // Allow images from HTTPS sources
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com', // Google Fonts
    ],
    'connect-src': [
      "'self'",
      'https://*.supabase.co',     // Database
      'wss://*.supabase.co',       // Real-time subscriptions
    ],
    'frame-src': ["'none'"],       // No iframes
    'frame-ancestors': ["'none'"], // Prevent embedding
    'object-src': ["'none'"],      // No plugins
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
    // Block third-party scripts completely (no tracking pixels)
    // Note: script-src-elem not widely supported, rely on script-src
  };

  return Object.entries(policy)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Build Permissions Policy header
 * Disables privacy-invasive browser APIs
 */
function buildPermissionsPolicy(): string {
  const policy = {
    // Disable tracking and advertising APIs
    'interest-cohort': [],         // Disable FLoC
    'browsing-topics': [],         // Disable Topics API
    'attribution-reporting': [],   // Disable attribution
    'run-ad-auction': [],          // Disable FLEDGE
    'join-ad-interest-group': [],  // Disable FLEDGE
    // Disable privacy-invasive features
    'camera': [],
    'microphone': [],
    'geolocation': [],
    'usb': [],
    'bluetooth': [],
    'serial': [],
    'hid': [],
    // Allow some features for functionality
    'fullscreen': ['self'],
    'picture-in-picture': ['self'],
  };

  return Object.entries(policy)
    .map(([feature, allowlist]) => {
      if (allowlist.length === 0) return `${feature}=()`;
      return `${feature}=(${allowlist.join(' ')})`;
    })
    .join(', ');
}

/**
 * Check if URL contains tracking parameters
 */
function hasTrackingParams(url: URL): boolean {
  return TRACKING_PARAMS.some((param) => url.searchParams.has(param));
}

/**
 * Strip tracking parameters from URL
 */
function stripTrackingParams(url: URL): URL {
  const cleanUrl = new URL(url);
  TRACKING_PARAMS.forEach((param) => {
    cleanUrl.searchParams.delete(param);
  });
  return cleanUrl;
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Strip tracking parameters and redirect
  if (hasTrackingParams(url)) {
    const cleanUrl = stripTrackingParams(url);
    return NextResponse.redirect(cleanUrl, { status: 301 });
  }

  // Create response
  const response = NextResponse.next();

  // Set security headers
  const headers = response.headers;

  // Content Security Policy
  headers.set('Content-Security-Policy', buildCSP());

  // Referrer Policy - limit information leakage
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - disable tracking APIs
  headers.set('Permissions-Policy', buildPermissionsPolicy());

  // X-Frame-Options - prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options - prevent MIME sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection - enable XSS filter
  headers.set('X-XSS-Protection', '1; mode=block');

  // Strict-Transport-Security - enforce HTTPS
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // X-DNS-Prefetch-Control - prevent DNS prefetching
  headers.set('X-DNS-Prefetch-Control', 'off');

  // X-Permitted-Cross-Domain-Policies - prevent Adobe Flash/PDF access
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Cross-Origin-Opener-Policy - isolate browsing context
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  // Cross-Origin-Resource-Policy - prevent resource embedding
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Cross-Origin-Embedder-Policy - require CORS/CORP
  // Note: Disabled for now as it may break external images
  // headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  return response;
}

/**
 * Matcher configuration
 * Apply middleware to all routes except static assets and API health check
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - API health check
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/health).*)',
  ],
};
