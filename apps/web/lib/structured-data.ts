/**
 * Structured Data (JSON-LD) generators for SEO
 *
 * Generates schema.org compliant structured data for various page types.
 */

import { PropertyTier } from '@clarus-vitae/database';

interface PropertyStructuredDataInput {
  name: string;
  description: string;
  slug: string;
  city: string;
  country: string;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  priceMin: number;
  priceMax: number;
  currency: string;
  tier: PropertyTier;
  overallScore?: number | null;
  reviewCount: number;
  averageRating?: number | null;
  website?: string | null;
  phone?: string | null;
  featuredImageUrl?: string | null;
}

interface ReviewStructuredDataInput {
  propertyName: string;
  reviewText: string;
  authorName: string;
  rating: number;
  datePublished: Date;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate LocalBusiness schema for property pages
 */
export function generatePropertyStructuredData(property: PropertyStructuredDataInput): object {
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: property.name,
    description: property.description,
    url: `https://clarusvitae.com/properties/${property.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.region || undefined,
      addressCountry: property.country,
    },
    priceRange: `${property.currency} ${property.priceMin.toLocaleString()} - ${property.priceMax.toLocaleString()}`,
  };

  // Add geo coordinates if available
  if (property.latitude && property.longitude) {
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    };
  }

  // Add contact info if available
  if (property.website) {
    structuredData.sameAs = [property.website];
  }

  if (property.phone) {
    structuredData.telephone = property.phone;
  }

  // Add image if available
  if (property.featuredImageUrl) {
    structuredData.image = property.featuredImageUrl;
  }

  // Add aggregate rating if we have reviews
  if (property.reviewCount > 0 && property.averageRating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: property.averageRating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: property.reviewCount,
    };
  }

  return structuredData;
}

/**
 * Generate Organization schema for the site
 */
export function generateOrganizationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Clarus Vitae',
    url: 'https://clarusvitae.com',
    logo: 'https://clarusvitae.com/logo.svg',
    description:
      'The outcomes intelligence platform for high-stakes wellness decisions. Independent research on premium wellness destinations.',
    sameAs: [
      'https://linkedin.com/company/clarus-vitae',
      'https://instagram.com/clarusvitae',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@clarusvitae.com',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://clarusvitae.com${item.url}`,
    })),
  };
}

/**
 * Generate Review schema
 */
export function generateReviewStructuredData(
  review: ReviewStructuredDataInput,
  propertyUrl: string
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'HealthAndBeautyBusiness',
      name: review.propertyName,
      url: propertyUrl,
    },
    author: {
      '@type': 'Person',
      name: review.authorName,
    },
    reviewBody: review.reviewText,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: review.datePublished.toISOString(),
  };
}

/**
 * Generate WebSite schema for search functionality
 */
export function generateWebsiteStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Clarus Vitae',
    url: 'https://clarusvitae.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://clarusvitae.com/properties?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate ItemList schema for property listings
 */
export function generatePropertyListStructuredData(
  properties: Array<{
    name: string;
    slug: string;
    description: string;
    priceMin: number;
    currency: string;
    featuredImageUrl?: string | null;
  }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'HealthAndBeautyBusiness',
        name: property.name,
        url: `https://clarusvitae.com/properties/${property.slug}`,
        description: property.description,
        image: property.featuredImageUrl || undefined,
        priceRange: `From ${property.currency} ${property.priceMin.toLocaleString()}`,
      },
    })),
  };
}
