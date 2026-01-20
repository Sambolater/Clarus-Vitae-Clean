/**
 * GROQ Queries for Sanity CMS
 *
 * These queries fetch editorial content from Sanity.
 * Property and treatment data is fetched from PostgreSQL.
 */

// ============================================================================
// Article Queries
// ============================================================================

/**
 * Fetch all published articles, ordered by publish date
 */
export const allArticlesQuery = `
  *[_type == "article" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    category,
    tags,
    authorId,
    authorName,
    publishedAt,
    readingTime
  }
`;

/**
 * Fetch articles by category
 */
export const articlesByCategoryQuery = `
  *[_type == "article" && status == "published" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    category,
    tags,
    authorId,
    authorName,
    publishedAt,
    readingTime
  }
`;

/**
 * Fetch a single article by slug with full content
 */
export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    content,
    category,
    tags,
    authorId,
    authorName,
    publishedAt,
    updatedAt,
    readingTime,
    relatedProperties,
    relatedTreatments,
    relatedArticles[]-> {
      _id,
      title,
      slug,
      excerpt,
      heroImage,
      category,
      publishedAt
    },
    seo
  }
`;

/**
 * Fetch recent articles for homepage or sidebar
 */
export const recentArticlesQuery = `
  *[_type == "article" && status == "published"] | order(publishedAt desc)[0...$limit] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    category,
    publishedAt
  }
`;

/**
 * Fetch article slugs for static generation
 */
export const articleSlugsQuery = `
  *[_type == "article" && status == "published"].slug.current
`;

// ============================================================================
// Guide Queries
// ============================================================================

/**
 * Fetch all published guides
 */
export const allGuidesQuery = `
  *[_type == "guide" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    guideType,
    excerpt,
    heroImage,
    authorId,
    authorName,
    publishedAt,
    estimatedReadTime
  }
`;

/**
 * Fetch guides by type
 */
export const guidesByTypeQuery = `
  *[_type == "guide" && status == "published" && guideType == $guideType] | order(publishedAt desc) {
    _id,
    title,
    slug,
    guideType,
    excerpt,
    heroImage,
    authorId,
    authorName,
    publishedAt,
    estimatedReadTime
  }
`;

/**
 * Fetch a single guide by slug with full content
 */
export const guideBySlugQuery = `
  *[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    guideType,
    excerpt,
    heroImage,
    introduction,
    tableOfContents,
    sections[] {
      title,
      anchor,
      content
    },
    conclusion,
    authorId,
    authorName,
    publishedAt,
    updatedAt,
    estimatedReadTime,
    relatedGuides[]-> {
      _id,
      title,
      slug,
      guideType,
      excerpt,
      heroImage
    },
    relatedProperties,
    relatedTreatments,
    callToAction,
    seo
  }
`;

/**
 * Fetch guide slugs for static generation
 */
export const guideSlugsQuery = `
  *[_type == "guide" && status == "published"].slug.current
`;

// ============================================================================
// Page Queries
// ============================================================================

/**
 * Fetch a page by slug
 */
export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    pageType,
    subtitle,
    heroImage,
    content,
    sections,
    lastUpdated,
    effectiveDate,
    seo
  }
`;

/**
 * Fetch all pages for navigation
 */
export const navigationPagesQuery = `
  *[_type == "page" && showInNavigation == true] | order(navigationOrder asc) {
    _id,
    title,
    slug,
    pageType
  }
`;

/**
 * Fetch page slugs for static generation
 */
export const pageSlugsQuery = `
  *[_type == "page"].slug.current
`;

// ============================================================================
// FAQ Queries
// ============================================================================

/**
 * Fetch all published FAQs organized by category
 */
export const allFaqsQuery = `
  *[_type == "faq" && isPublished == true] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category,
    order,
    relatedLinks
  }
`;

/**
 * Fetch FAQs by category
 */
export const faqsByCategoryQuery = `
  *[_type == "faq" && isPublished == true && category == $category] | order(order asc) {
    _id,
    question,
    answer,
    category,
    relatedLinks
  }
`;

// ============================================================================
// Glossary Queries
// ============================================================================

/**
 * Fetch all published glossary terms
 */
export const allGlossaryTermsQuery = `
  *[_type == "glossaryTerm" && isPublished == true] | order(term asc) {
    _id,
    term,
    slug,
    shortDefinition,
    category,
    evidenceLevel,
    aliases
  }
`;

/**
 * Fetch glossary terms by category
 */
export const glossaryTermsByCategoryQuery = `
  *[_type == "glossaryTerm" && isPublished == true && category == $category] | order(term asc) {
    _id,
    term,
    slug,
    shortDefinition,
    evidenceLevel
  }
`;

/**
 * Fetch a single glossary term by slug with full content
 */
export const glossaryTermBySlugQuery = `
  *[_type == "glossaryTerm" && slug.current == $slug][0] {
    _id,
    term,
    slug,
    shortDefinition,
    fullDefinition,
    category,
    aliases,
    evidenceLevel,
    relatedTerms[]-> {
      _id,
      term,
      slug,
      shortDefinition
    },
    relatedTreatments,
    sources
  }
`;

/**
 * Fetch glossary term slugs for static generation
 */
export const glossaryTermSlugsQuery = `
  *[_type == "glossaryTerm" && isPublished == true].slug.current
`;

// ============================================================================
// Search & Utility Queries
// ============================================================================

/**
 * Search across all content types
 */
export const searchContentQuery = `
  *[
    (_type == "article" || _type == "guide" || _type == "glossaryTerm") &&
    (title match $query || excerpt match $query || term match $query)
  ] | order(_type asc, publishedAt desc)[0...$limit] {
    _id,
    _type,
    title,
    "displayTitle": coalesce(title, term),
    slug,
    "description": coalesce(excerpt, shortDefinition),
    publishedAt
  }
`;

/**
 * Sitemap query - all public URLs
 */
export const sitemapQuery = `
  {
    "articles": *[_type == "article" && status == "published"] {
      "slug": slug.current,
      "updatedAt": coalesce(updatedAt, publishedAt)
    },
    "guides": *[_type == "guide" && status == "published"] {
      "slug": slug.current,
      "updatedAt": coalesce(updatedAt, publishedAt)
    },
    "pages": *[_type == "page"] {
      "slug": slug.current,
      "updatedAt": lastUpdated
    },
    "glossary": *[_type == "glossaryTerm" && isPublished == true] {
      "slug": slug.current
    }
  }
`;
