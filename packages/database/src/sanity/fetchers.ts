/**
 * Sanity Data Fetchers
 *
 * These functions provide a clean API for fetching content from Sanity.
 * They combine GROQ queries with the Sanity client.
 */

import { getClient } from './client';
import {
  allArticlesQuery,
  articlesByCategoryQuery,
  articleBySlugQuery,
  recentArticlesQuery,
  articleSlugsQuery,
  allGuidesQuery,
  guidesByTypeQuery,
  guideBySlugQuery,
  guideSlugsQuery,
  pageBySlugQuery,
  navigationPagesQuery,
  pageSlugsQuery,
  allFaqsQuery,
  faqsByCategoryQuery,
  allGlossaryTermsQuery,
  glossaryTermsByCategoryQuery,
  glossaryTermBySlugQuery,
  glossaryTermSlugsQuery,
  searchContentQuery,
  sitemapQuery,
} from './queries';
import type {
  Article,
  ArticleListItem,
  ArticleCategory,
  Guide,
  GuideListItem,
  GuideType,
  Page,
  Faq,
  FaqCategory,
  FaqsByCategory,
  GlossaryTerm,
  GlossaryTermListItem,
  GlossaryCategory,
  SearchResult,
  SitemapData,
} from './types';

// ============================================================================
// Article Fetchers
// ============================================================================

/**
 * Fetch all published articles
 */
export async function getArticles(
  preview = false
): Promise<ArticleListItem[]> {
  const client = getClient(preview);
  return client.fetch(allArticlesQuery);
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(
  category: ArticleCategory,
  preview = false
): Promise<ArticleListItem[]> {
  const client = getClient(preview);
  return client.fetch(articlesByCategoryQuery, { category });
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(
  slug: string,
  preview = false
): Promise<Article | null> {
  const client = getClient(preview);
  return client.fetch(articleBySlugQuery, { slug });
}

/**
 * Fetch recent articles (for homepage, sidebar, etc.)
 */
export async function getRecentArticles(
  limit = 5,
  preview = false
): Promise<ArticleListItem[]> {
  const client = getClient(preview);
  return client.fetch(recentArticlesQuery, { limit });
}

/**
 * Fetch all article slugs (for static generation)
 */
export async function getArticleSlugs(): Promise<string[]> {
  const client = getClient(false);
  return client.fetch(articleSlugsQuery);
}

// ============================================================================
// Guide Fetchers
// ============================================================================

/**
 * Fetch all published guides
 */
export async function getGuides(preview = false): Promise<GuideListItem[]> {
  const client = getClient(preview);
  return client.fetch(allGuidesQuery);
}

/**
 * Fetch guides by type
 */
export async function getGuidesByType(
  guideType: GuideType,
  preview = false
): Promise<GuideListItem[]> {
  const client = getClient(preview);
  return client.fetch(guidesByTypeQuery, { guideType });
}

/**
 * Fetch a single guide by slug
 */
export async function getGuideBySlug(
  slug: string,
  preview = false
): Promise<Guide | null> {
  const client = getClient(preview);
  return client.fetch(guideBySlugQuery, { slug });
}

/**
 * Fetch all guide slugs (for static generation)
 */
export async function getGuideSlugs(): Promise<string[]> {
  const client = getClient(false);
  return client.fetch(guideSlugsQuery);
}

// ============================================================================
// Page Fetchers
// ============================================================================

/**
 * Fetch a page by slug
 */
export async function getPageBySlug(
  slug: string,
  preview = false
): Promise<Page | null> {
  const client = getClient(preview);
  return client.fetch(pageBySlugQuery, { slug });
}

/**
 * Fetch pages for navigation
 */
export async function getNavigationPages(
  preview = false
): Promise<Array<{ _id: string; title: string; slug: { current: string }; pageType: string }>> {
  const client = getClient(preview);
  return client.fetch(navigationPagesQuery);
}

/**
 * Fetch all page slugs (for static generation)
 */
export async function getPageSlugs(): Promise<string[]> {
  const client = getClient(false);
  return client.fetch(pageSlugsQuery);
}

// ============================================================================
// FAQ Fetchers
// ============================================================================

/**
 * Fetch all FAQs
 */
export async function getFaqs(preview = false): Promise<Faq[]> {
  const client = getClient(preview);
  return client.fetch(allFaqsQuery);
}

/**
 * Fetch FAQs grouped by category
 */
export async function getFaqsByCategory(preview = false): Promise<FaqsByCategory> {
  const faqs = await getFaqs(preview);
  return faqs.reduce((acc, faq) => {
    const category = faq.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(faq);
    return acc;
  }, {} as FaqsByCategory);
}

/**
 * Fetch FAQs for a specific category
 */
export async function getFaqsForCategory(
  category: FaqCategory,
  preview = false
): Promise<Faq[]> {
  const client = getClient(preview);
  return client.fetch(faqsByCategoryQuery, { category });
}

// ============================================================================
// Glossary Fetchers
// ============================================================================

/**
 * Fetch all glossary terms
 */
export async function getGlossaryTerms(
  preview = false
): Promise<GlossaryTermListItem[]> {
  const client = getClient(preview);
  return client.fetch(allGlossaryTermsQuery);
}

/**
 * Fetch glossary terms by category
 */
export async function getGlossaryTermsByCategory(
  category: GlossaryCategory,
  preview = false
): Promise<GlossaryTermListItem[]> {
  const client = getClient(preview);
  return client.fetch(glossaryTermsByCategoryQuery, { category });
}

/**
 * Fetch a single glossary term by slug
 */
export async function getGlossaryTermBySlug(
  slug: string,
  preview = false
): Promise<GlossaryTerm | null> {
  const client = getClient(preview);
  return client.fetch(glossaryTermBySlugQuery, { slug });
}

/**
 * Fetch all glossary term slugs (for static generation)
 */
export async function getGlossaryTermSlugs(): Promise<string[]> {
  const client = getClient(false);
  return client.fetch(glossaryTermSlugsQuery);
}

// ============================================================================
// Search & Utility Fetchers
// ============================================================================

/**
 * Search across all content types
 */
export async function searchContent(
  searchQuery: string,
  limit = 10,
  preview = false
): Promise<SearchResult[]> {
  const client = getClient(preview);
  // Cast params to avoid Sanity strict typing conflict with 'query' param name
  const params = { query: `*${searchQuery}*`, limit } as Record<string, unknown>;
  return client.fetch(searchContentQuery, params) as Promise<SearchResult[]>;
}

/**
 * Fetch sitemap data
 */
export async function getSitemapData(): Promise<SitemapData> {
  const client = getClient(false);
  return client.fetch(sitemapQuery);
}
