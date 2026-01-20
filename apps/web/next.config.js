/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Package transpilation for monorepo
  transpilePackages: [
    '@clarus-vitae/ui',
    '@clarus-vitae/utils',
    '@clarus-vitae/types',
    '@clarus-vitae/analytics',
  ],

  // Image optimization for performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift
    minimumCacheTTL: 60,
  },

  // Enable compression
  compress: true,

  // Production optimizations
  swcMinify: true,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['@clarus-vitae/ui'],
    // Note: optimizeCss requires 'critters' package - disabled for CI compatibility
    // optimizeCss: true,
  },

  // Headers for security and caching
  headers: async () => {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Long cache for static images
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Long cache for static assets (JS, CSS)
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Long cache for fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache for static pages (sitemap, robots)
      {
        source: '/(sitemap.xml|robots.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Redirect www to non-www (SEO best practice)
  redirects: async () => {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.clarusvitae.com',
          },
        ],
        destination: 'https://clarusvitae.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
