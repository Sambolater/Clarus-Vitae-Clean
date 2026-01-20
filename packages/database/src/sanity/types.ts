/**
 * TypeScript types for Sanity CMS content
 *
 * These types match the schemas defined in apps/cms/schemas/
 */

import type { PortableTextBlock } from '@portabletext/types';

// ============================================================================
// Base Types
// ============================================================================

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityReference {
  _ref: string;
  _type: 'reference';
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export interface CallToAction {
  text: string;
  linkType: 'internal' | 'external' | 'inquiry' | 'contact';
  internalLink?: SanityReference;
  externalUrl?: string;
  propertySlug?: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'text';
}

// ============================================================================
// Article Types
// ============================================================================

export type ArticleCategory =
  | 'longevity'
  | 'wellness-trends'
  | 'destination-guide'
  | 'treatment-deep-dive'
  | 'expert-interview'
  | 'industry-news';

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface ArticleListItem {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt: string;
  heroImage?: SanityImage;
  category: ArticleCategory;
  tags?: string[];
  authorId?: string;
  authorName?: string;
  publishedAt: string;
  readingTime?: number;
}

export interface Article extends ArticleListItem {
  content: PortableTextBlock[];
  updatedAt?: string;
  relatedProperties?: string[];
  relatedTreatments?: string[];
  relatedArticles?: ArticleListItem[];
  seo?: SeoFields;
}

// ============================================================================
// Guide Types
// ============================================================================

export type GuideType = 'destination' | 'treatment' | 'focus-area' | 'planning';

export interface TableOfContentsItem {
  title: string;
  anchor: string;
}

export interface GuideSection {
  title: string;
  anchor: string;
  content: PortableTextBlock[];
}

export interface GuideListItem {
  _id: string;
  title: string;
  slug: SanitySlug;
  guideType: GuideType;
  excerpt?: string;
  heroImage?: SanityImage;
  authorId?: string;
  authorName?: string;
  publishedAt?: string;
  estimatedReadTime?: number;
}

export interface Guide extends GuideListItem {
  introduction?: PortableTextBlock[];
  tableOfContents?: TableOfContentsItem[];
  sections?: GuideSection[];
  conclusion?: PortableTextBlock[];
  updatedAt?: string;
  relatedGuides?: GuideListItem[];
  relatedProperties?: string[];
  relatedTreatments?: string[];
  callToAction?: CallToAction;
  seo?: SeoFields;
}

// ============================================================================
// Page Types
// ============================================================================

export type PageType = 'legal' | 'about' | 'landing';

export interface HeroSection {
  _type: 'heroSection';
  heading?: string;
  subheading?: string;
  backgroundImage?: SanityImage;
  cta?: CallToAction;
}

export interface FeatureSection {
  _type: 'featureSection';
  heading?: string;
  subheading?: string;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface ContentSection {
  _type: 'contentSection';
  heading?: string;
  content: PortableTextBlock[];
}

export interface CtaSection {
  _type: 'ctaSection';
  heading?: string;
  subheading?: string;
  cta?: CallToAction;
  secondaryCta?: CallToAction;
}

export type PageSection =
  | HeroSection
  | FeatureSection
  | ContentSection
  | CtaSection;

export interface Page {
  _id: string;
  title: string;
  slug: SanitySlug;
  pageType: PageType;
  subtitle?: string;
  heroImage?: SanityImage;
  content?: PortableTextBlock[];
  sections?: PageSection[];
  lastUpdated?: string;
  effectiveDate?: string;
  seo?: SeoFields;
}

// ============================================================================
// FAQ Types
// ============================================================================

export type FaqCategory =
  | 'general'
  | 'properties'
  | 'treatments'
  | 'index'
  | 'privacy'
  | 'booking'
  | 'reviews'
  | 'advisory';

export interface Faq {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: FaqCategory;
  order: number;
  relatedLinks?: Array<{
    text: string;
    url: string;
  }>;
}

export interface FaqsByCategory {
  [category: string]: Faq[];
}

// ============================================================================
// Glossary Types
// ============================================================================

export type GlossaryCategory =
  | 'longevity'
  | 'diagnostics'
  | 'treatments'
  | 'wellness'
  | 'medical'
  | 'nutrition'
  | 'mental-health'
  | 'technology';

export type EvidenceLevel =
  | 'strong'
  | 'moderate'
  | 'emerging'
  | 'limited'
  | 'traditional';

export interface GlossaryTermListItem {
  _id: string;
  term: string;
  slug: SanitySlug;
  shortDefinition: string;
  category: GlossaryCategory;
  evidenceLevel?: EvidenceLevel;
  aliases?: string[];
}

export interface GlossarySource {
  title: string;
  url?: string;
  publication?: string;
  year?: number;
}

export interface GlossaryTerm extends GlossaryTermListItem {
  fullDefinition?: PortableTextBlock[];
  relatedTerms?: GlossaryTermListItem[];
  relatedTreatments?: string[];
  sources?: GlossarySource[];
}

// ============================================================================
// Portable Text Custom Block Types
// ============================================================================

export interface PropertyCardBlock {
  _type: 'propertyCard';
  propertySlug: string;
}

export interface TreatmentCardBlock {
  _type: 'treatmentCard';
  treatmentSlug: string;
}

export interface ComparisonTableBlock {
  _type: 'comparisonTable';
  propertySlugs: string[];
  comparisonTitle?: string;
}

export interface CalloutBlock {
  _type: 'callout';
  type: 'info' | 'warning' | 'tip' | 'expert';
  title?: string;
  content: string;
}

export interface VideoBlock {
  _type: 'video';
  url: string;
  caption?: string;
}

export interface DataTableBlock {
  _type: 'dataTable';
  title?: string;
  headers: string[];
  rows: Array<{ cells: string[] }>;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResult {
  _id: string;
  _type: 'article' | 'guide' | 'glossaryTerm';
  displayTitle: string;
  slug: SanitySlug;
  description?: string;
  publishedAt?: string;
}

// ============================================================================
// Sitemap Types
// ============================================================================

export interface SitemapData {
  articles: Array<{ slug: string; updatedAt: string }>;
  guides: Array<{ slug: string; updatedAt: string }>;
  pages: Array<{ slug: string; updatedAt?: string }>;
  glossary: Array<{ slug: string }>;
}
