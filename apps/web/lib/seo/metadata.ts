/**
 * SEO Metadata Configuration
 *
 * Centralized metadata generation for all pages.
 * Implements consistent SEO patterns across the platform.
 */

import type { PropertyTier } from '@clarus-vitae/database';
import type { Metadata } from 'next';

// Site configuration
export const siteConfig = {
  name: 'Clarus Vitae',
  tagline: "Clarity for Life's Most Important Decisions",
  description:
    'The definitive research platform for elite wellness destinations. Expert-evaluated medical longevity clinics, luxury wellness retreats, and destination spas worldwide.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://clarusvitae.com',
  ogImage: '/og-default.jpg',
};

// Format tier for display
function formatTier(tier: PropertyTier): string {
  const tierLabels: Record<PropertyTier, string> = {
    TIER_1: 'Medical Longevity Clinic',
    TIER_2: 'Integrated Wellness Retreat',
    TIER_3: 'Luxury Destination Spa',
  };
  return tierLabels[tier] || tier;
}

// Base metadata generator
export function generateMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

// Property metadata
interface PropertyMetadataInput {
  name: string;
  slug: string;
  tier: PropertyTier;
  country: string;
  tagline?: string | null;
  description?: string | null;
  heroImageUrl?: string | null;
}

export function propertyMetadata(property: PropertyMetadataInput): Metadata {
  const tierLabel = formatTier(property.tier);
  const title = `${property.name} - ${tierLabel} in ${property.country}`;
  const descriptionText =
    property.tagline || property.description?.slice(0, 150) || `Expert review and Clarus Index score for ${property.name}.`;

  return generateMetadata({
    title,
    description: `Expert review and Clarus Index score for ${property.name}. ${descriptionText}`,
    path: `/properties/${property.slug}`,
    image: property.heroImageUrl || undefined,
  });
}

// Treatment metadata
interface TreatmentMetadataInput {
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
}

export function treatmentMetadata(treatment: TreatmentMetadataInput): Metadata {
  const descriptionText =
    treatment.description?.slice(0, 150) || `Learn about ${treatment.name} treatment options.`;

  return generateMetadata({
    title: `${treatment.name} - Where to Get It & What to Expect`,
    description: `Complete guide to ${treatment.name}. Evidence level, best clinics offering it, pricing, and what to expect. ${descriptionText}`,
    path: `/treatments/${treatment.slug}`,
  });
}

// Article metadata
interface ArticleMetadataInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  heroImage?: string | null;
}

export function articleMetadata(article: ArticleMetadataInput): Metadata {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || `Read ${article.title} on Clarus Vitae.`;

  return generateMetadata({
    title,
    description,
    path: `/articles/${article.slug}`,
    image: article.heroImage || undefined,
  });
}

// Team member metadata
interface TeamMemberMetadataInput {
  name: string;
  slug: string;
  title: string;
  bio?: string | null;
  headshotUrl?: string | null;
}

export function teamMemberMetadata(member: TeamMemberMetadataInput): Metadata {
  const description =
    member.bio?.slice(0, 150) || `${member.name}, ${member.title} at Clarus Vitae. Meet our wellness research experts.`;

  return generateMetadata({
    title: `${member.name} - ${member.title}`,
    description,
    path: `/team/${member.slug}`,
    image: member.headshotUrl || undefined,
  });
}

// Destination metadata (country/region pages)
interface DestinationMetadataInput {
  name: string;
  slug: string;
  propertyCount: number;
}

export function destinationMetadata(destination: DestinationMetadataInput): Metadata {
  return generateMetadata({
    title: `Best Wellness Destinations in ${destination.name}`,
    description: `Explore ${destination.propertyCount} expert-evaluated wellness properties in ${destination.name}. Medical longevity clinics, luxury retreats, and destination spas with Clarus Index scores.`,
    path: `/properties/destination/${destination.slug}`,
  });
}

// Focus area metadata
interface FocusAreaMetadataInput {
  name: string;
  slug: string;
  description?: string | null;
  propertyCount: number;
}

export function focusAreaMetadata(focusArea: FocusAreaMetadataInput): Metadata {
  const descriptionText =
    focusArea.description || `Discover the best wellness properties for ${focusArea.name.toLowerCase()}.`;

  return generateMetadata({
    title: `Best ${focusArea.name} Programs & Retreats`,
    description: `${focusArea.propertyCount} expert-evaluated properties specializing in ${focusArea.name.toLowerCase()}. ${descriptionText}`,
    path: `/properties/focus/${focusArea.slug}`,
  });
}

// Comparison page metadata
export function comparisonMetadata(propertyNames: string[]): Metadata {
  if (propertyNames.length === 0) {
    return generateMetadata({
      title: 'Compare Wellness Properties',
      description:
        'Side-by-side comparison of medical longevity clinics, wellness retreats, and destination spas. Compare Clarus Index scores, treatments, pricing, and outcomes.',
      path: '/compare',
    });
  }

  const names = propertyNames.slice(0, 3).join(' vs ');
  return generateMetadata({
    title: `Compare: ${names}`,
    description: `Side-by-side comparison of ${propertyNames.join(', ')}. Compare Clarus Index scores, treatments, pricing, and outcomes.`,
    path: '/compare',
    noIndex: true, // Dynamic comparisons shouldn't be indexed
  });
}

// Search results metadata
export function searchMetadata(query?: string): Metadata {
  if (!query) {
    return generateMetadata({
      title: 'Search Wellness Properties & Treatments',
      description:
        'Search our database of expert-evaluated wellness destinations. Find medical longevity clinics, luxury retreats, and treatments worldwide.',
      path: '/search',
    });
  }

  return generateMetadata({
    title: `Search Results: ${query}`,
    description: `Search results for "${query}" across wellness properties, treatments, and articles.`,
    path: `/search?q=${encodeURIComponent(query)}`,
    noIndex: true, // Search results shouldn't be indexed
  });
}

// Static page metadata
export const staticPageMetadata = {
  properties: generateMetadata({
    title: 'Explore Wellness Properties',
    description:
      'Browse expert-evaluated medical longevity clinics, integrated wellness retreats, and luxury destination spas worldwide. Filter by location, tier, focus area, and Clarus Index score.',
    path: '/properties',
  }),

  treatments: generateMetadata({
    title: 'Treatments & Modalities',
    description:
      'Comprehensive guide to wellness treatments and modalities. Evidence levels, pricing, and which properties offer each treatment.',
    path: '/treatments',
  }),

  about: generateMetadata({
    title: 'About Clarus Vitae',
    description:
      'Independent wellness intelligence for high-stakes health decisions. Learn about our methodology, editorial independence, and commitment to privacy.',
    path: '/about',
  }),

  methodology: generateMetadata({
    title: 'The Clarus Index Methodology',
    description:
      'How we evaluate wellness properties. Our proprietary 5-dimension scoring methodology with transparent criteria and named expert assessment.',
    path: '/about/methodology',
  }),

  team: generateMetadata({
    title: 'Our Advisory Team',
    description:
      'Meet the experts behind Clarus Vitae. Named researchers with verified credentials who have collectively visited 200+ properties.',
    path: '/about/team',
  }),

  privacy: generateMetadata({
    title: 'Privacy Policy',
    description:
      'Your privacy is our foundation. No tracking, no data sales, Research Mode browsing. Learn how we protect your sensitive wellness research.',
    path: '/privacy',
  }),

  terms: generateMetadata({
    title: 'Terms of Service',
    description: 'Terms of service for using the Clarus Vitae platform.',
    path: '/terms',
  }),

  contact: generateMetadata({
    title: 'Contact Us',
    description:
      'Get in touch with the Clarus Vitae team. Questions about our research, partnership inquiries, or feedback.',
    path: '/contact',
  }),
};
