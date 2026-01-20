/**
 * Structured Data (JSON-LD) generators for SEO
 *
 * Generates schema.org compliant structured data for various page types.
 */

import { type PropertyTier } from '@clarus-vitae/database';

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

/**
 * Generate MedicalProcedure schema for treatment pages
 */
interface TreatmentStructuredDataInput {
  name: string;
  slug: string;
  description: string;
  category?: string | null;
  howItWorks?: string | null;
  evidenceLevel?: string | null;
  risks?: string[] | null;
  contraindications?: string[] | null;
}

export function generateTreatmentStructuredData(treatment: TreatmentStructuredDataInput): object {
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: treatment.name,
    description: treatment.description,
    url: `https://clarusvitae.com/treatments/${treatment.slug}`,
  };

  if (treatment.howItWorks) {
    structuredData.howPerformed = treatment.howItWorks;
  }

  if (treatment.category) {
    structuredData.procedureType = treatment.category;
  }

  if (treatment.risks && treatment.risks.length > 0) {
    structuredData.risks = treatment.risks.join('; ');
  }

  if (treatment.contraindications && treatment.contraindications.length > 0) {
    structuredData.contraindication = treatment.contraindications.join('; ');
  }

  return structuredData;
}

/**
 * Generate Article schema for editorial content
 */
interface ArticleStructuredDataInput {
  title: string;
  slug: string;
  excerpt: string;
  heroImage?: string | null;
  publishedAt: Date | string;
  updatedAt?: Date | string | null;
  authorName: string;
  authorSlug: string;
  authorTitle?: string | null;
}

export function generateArticleStructuredData(article: ArticleStructuredDataInput): object {
  const publishedDate = article.publishedAt instanceof Date
    ? article.publishedAt.toISOString()
    : article.publishedAt;

  const modifiedDate = article.updatedAt
    ? (article.updatedAt instanceof Date ? article.updatedAt.toISOString() : article.updatedAt)
    : publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage || undefined,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    url: `https://clarusvitae.com/articles/${article.slug}`,
    author: {
      '@type': 'Person',
      name: article.authorName,
      url: `https://clarusvitae.com/team/${article.authorSlug}`,
      jobTitle: article.authorTitle || undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clarus Vitae',
      logo: {
        '@type': 'ImageObject',
        url: 'https://clarusvitae.com/logo.svg',
      },
    },
  };
}

/**
 * Generate FAQPage schema for FAQ sections
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQStructuredData(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Person schema for team member profiles
 */
interface TeamMemberStructuredDataInput {
  name: string;
  slug: string;
  title: string;
  bio?: string | null;
  headshotUrl?: string | null;
  credentials?: string[] | null;
  specializations?: string[] | null;
  linkedIn?: string | null;
}

export function generateTeamMemberStructuredData(member: TeamMemberStructuredDataInput): object {
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.title,
    url: `https://clarusvitae.com/team/${member.slug}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Clarus Vitae',
      url: 'https://clarusvitae.com',
    },
  };

  if (member.bio) {
    structuredData.description = member.bio;
  }

  if (member.headshotUrl) {
    structuredData.image = member.headshotUrl;
  }

  if (member.credentials && member.credentials.length > 0) {
    structuredData.hasCredential = member.credentials.map((credential) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: credential,
    }));
  }

  if (member.specializations && member.specializations.length > 0) {
    structuredData.knowsAbout = member.specializations;
  }

  const sameAs: string[] = [];
  if (member.linkedIn) {
    sameAs.push(member.linkedIn);
  }
  if (sameAs.length > 0) {
    structuredData.sameAs = sameAs;
  }

  return structuredData;
}

/**
 * Generate multiple structured data objects for a page
 */
export function combineStructuredData(...items: object[]): object[] {
  return items.filter(Boolean);
}
