/**
 * Dynamic Robots.txt Generation
 *
 * Controls search engine crawler behavior.
 * Blocks admin, API, and preview routes while allowing public content.
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clarusvitae.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/admin/',         // Admin pages
          '/preview/',       // Preview routes
          '/_next/',         // Next.js internal
          '/private/',       // Private pages
          '/compare?*',      // Dynamic comparison URLs (keep /compare indexable)
          '/search?*',       // Dynamic search URLs (keep /search indexable)
        ],
      },
      {
        // Block aggressive crawlers
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
