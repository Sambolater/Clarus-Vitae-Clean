# 14 - SEO & PERFORMANCE
## Search Optimization & Sub-2-Second Loads

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` for technical requirements (sub-2-second loads, SEO-optimized SSR).

---

## Task Objective

Implement comprehensive SEO strategy and performance optimization to ensure the platform ranks for high-value wellness search queries while delivering sub-2-second page loads globally.

---

## SEO Strategy

### Target Keywords (High Intent)

**Tier 1 - Medical Longevity**:
- "best longevity clinics"
- "medical wellness retreats"
- "executive health programs"
- "longevity clinic Switzerland/Germany/Thailand"
- "stem cell therapy clinic"
- "[Treatment] + where to get"

**Tier 2 - Integrated Wellness**:
- "luxury wellness retreat [destination]"
- "best detox retreat"
- "weight loss retreat luxury"
- "burnout recovery retreat"

**Tier 3 - Luxury Destination**:
- "best spa destination [country]"
- "luxury spa retreat"
- "wellness vacation [destination]"

### Competitor Keywords:
- "[Competitor property name] reviews"
- "[Competitor property name] alternatives"
- "[Competitor property name] vs [Other property]"

---

## Deliverables

### 1. Metadata Configuration

```typescript
// apps/web/lib/seo/metadata.ts

import { Metadata } from 'next';

export const siteConfig = {
  name: 'Clarus Vitae',
  tagline: "Clarity for Life's Most Important Decisions",
  description: 'The definitive research platform for elite wellness destinations. Expert-evaluated medical longevity clinics, luxury wellness retreats, and destination spas worldwide.',
  url: 'https://clarusvitae.com',
  ogImage: '/og-default.jpg'
};

export function generateMetadata({
  title,
  description,
  path,
  image,
  noIndex = false
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;
  
  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: url
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
}

// Page-specific metadata generators
export function propertyMetadata(property: Property): Metadata {
  return generateMetadata({
    title: `${property.name} - ${formatTier(property.tier)} in ${property.country}`,
    description: `Expert review and Clarus Index score for ${property.name}. ${property.tagline || property.description?.slice(0, 120)}`,
    path: `/properties/${property.slug}`,
    image: property.heroImageUrl
  });
}

export function treatmentMetadata(treatment: Treatment): Metadata {
  return generateMetadata({
    title: `${treatment.name} - Where to Get It & What to Expect`,
    description: `Complete guide to ${treatment.name}. Evidence level, best clinics offering it, pricing, and what to expect. ${treatment.description?.slice(0, 100)}`,
    path: `/treatments/${treatment.slug}`
  });
}

export function articleMetadata(article: Article): Metadata {
  return generateMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    image: article.heroImage
  });
}
```

### 2. Structured Data (JSON-LD)

```typescript
// apps/web/lib/seo/structured-data.ts

export function propertyStructuredData(property: Property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: property.name,
    description: property.description,
    url: `https://clarusvitae.com/properties/${property.slug}`,
    image: property.heroImageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.region,
      addressCountry: property.country
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude
    } : undefined,
    priceRange: `$${property.priceRangeMin?.toLocaleString()} - $${property.priceRangeMax?.toLocaleString()}`,
    aggregateRating: property.reviewSummary ? {
      '@type': 'AggregateRating',
      ratingValue: property.reviewSummary.averageRating,
      reviewCount: property.reviewSummary.count
    } : undefined
  };
}

export function treatmentStructuredData(treatment: Treatment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.name,
    description: treatment.description,
    howPerformed: treatment.howItWorks,
    procedureType: treatment.category
  };
}

export function articleStructuredData(article: Article, author: TeamMember) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: author.name,
      url: `https://clarusvitae.com/about/team/${author.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clarus Vitae',
      logo: {
        '@type': 'ImageObject',
        url: 'https://clarusvitae.com/logo.png'
      }
    }
  };
}

export function faqStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function breadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
```

### 3. JSON-LD Component

```typescript
// packages/ui/src/components/seo/JsonLd.tsx

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### 4. Sitemap Generation

```typescript
// apps/web/app/sitemap.ts

import { MetadataRoute } from 'next';
import { getAllProperties, getAllTreatments } from '@clarus/database';
import { getArticles, getGuides } from '@clarus/database/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://clarusvitae.com';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/treatments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 }
  ];
  
  // Properties
  const properties = await getAllProperties({ status: 'published' });
  const propertyPages = properties.map(property => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  
  // Treatments
  const treatments = await getAllTreatments({ status: 'published' });
  const treatmentPages = treatments.map(treatment => ({
    url: `${baseUrl}/treatments/${treatment.slug}`,
    lastModified: treatment.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));
  
  // Articles
  const articles = await getArticles();
  const articlePages = articles.map(article => ({
    url: `${baseUrl}/articles/${article.slug.current}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));
  
  // Guides
  const guides = await getGuides();
  const guidePages = guides.map(guide => ({
    url: `${baseUrl}/guides/${guide.slug.current}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));
  
  return [...staticPages, ...propertyPages, ...treatmentPages, ...articlePages, ...guidePages];
}
```

### 5. Robots.txt

```typescript
// apps/web/app/robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/preview/']
      }
    ],
    sitemap: 'https://clarusvitae.com/sitemap.xml'
  };
}
```

### 6. Performance Optimization

```typescript
// apps/web/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Compression
  compress: true,
  
  // Production optimizations
  swcMinify: true,
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/:all*(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;
```

### 7. Image Optimization Component

```typescript
// packages/ui/src/components/OptimizedImage.tsx

import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={sizes}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  );
}
```

### 8. Font Optimization

```typescript
// apps/web/app/layout.tsx

import { Inter, Playfair_Display } from 'next/font/google';

// Self-hosted fonts for privacy
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 9. Core Web Vitals Monitoring

```typescript
// apps/web/lib/performance/web-vitals.ts

import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to Plausible (self-hosted, privacy-respecting)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Web Vitals', {
      props: {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        metric_rating: metric.rating
      }
    });
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// Target thresholds
export const WEB_VITALS_THRESHOLDS = {
  LCP: 2500,   // Largest Contentful Paint < 2.5s
  FID: 100,    // First Input Delay < 100ms
  CLS: 0.1,    // Cumulative Layout Shift < 0.1
  FCP: 1800,   // First Contentful Paint < 1.8s
  TTFB: 800    // Time to First Byte < 800ms
};
```

### 10. Lazy Loading & Code Splitting

```typescript
// apps/web/components/LazyComponents.tsx

import dynamic from 'next/dynamic';

// Heavy components loaded on demand
export const ComparisonTable = dynamic(
  () => import('@clarus/ui').then(mod => mod.ComparisonTable),
  { loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded" /> }
);

export const ReviewForm = dynamic(
  () => import('@clarus/ui').then(mod => mod.ReviewForm),
  { ssr: false }  // Client-only
);

export const InquiryModal = dynamic(
  () => import('@clarus/ui').then(mod => mod.InquiryModal),
  { ssr: false }
);

export const MapView = dynamic(
  () => import('@clarus/ui').then(mod => mod.MapView),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded" /> }
);
```

### 11. Database Query Optimization

```typescript
// packages/database/src/queries/optimized.ts

// Use select to limit fields
export async function getPropertiesForListing() {
  return supabase
    .from('properties')
    .select(`
      id,
      slug,
      name,
      tier,
      country,
      city,
      clarus_index_score,
      price_range_min,
      price_range_max,
      hero_image_url,
      is_editors_choice,
      is_verified_excellence
    `)
    .eq('status', 'published')
    .order('clarus_index_score', { ascending: false });
}

// Full property with relations for profile page
export async function getPropertyBySlug(slug: string) {
  return supabase
    .from('properties')
    .select(`
      *,
      property_dark_data (*),
      property_cultural_data (*),
      property_focus_areas (
        focus_area:focus_areas (*)
      ),
      property_treatments (
        treatment:treatments (id, slug, name),
        is_signature
      ),
      programs (*),
      reviews (
        id,
        rating_overall,
        rating_goal_achievement,
        review_title,
        review_text,
        visit_date,
        is_verified_stay,
        is_team_review
      )
    `)
    .eq('slug', slug)
    .single();
}
```

---

## Performance Checklist

- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] TTFB < 800ms
- [ ] All images optimized (WebP/AVIF)
- [ ] Fonts preloaded
- [ ] Critical CSS inlined
- [ ] JavaScript code-split
- [ ] API responses cached where appropriate
- [ ] Database queries optimized

## SEO Checklist

- [ ] All pages have unique title and description
- [ ] Structured data on all key pages
- [ ] Sitemap generated and submitted
- [ ] Canonical URLs set
- [ ] Open Graph images for social sharing
- [ ] Internal linking strategy implemented
- [ ] No duplicate content issues
- [ ] Mobile-friendly design

---

*Performance and SEO are ongoing. Set up monitoring and iterate.*
