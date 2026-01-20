/**
 * Search Query Functions
 *
 * Functions to execute searches across Meilisearch indexes.
 * Used by the API routes to handle search requests.
 */

import { searchClient, SEARCH_INDEXES } from './client';
import type {
  PropertySearchDocument,
  TreatmentSearchDocument,
  ArticleSearchDocument,
  MultiSearchResults,
  SearchSuggestion,
} from './types';

// ============================================================================
// Multi-Index Search
// ============================================================================

/**
 * Search across all indexes simultaneously
 */
export async function searchAll(
  query: string,
  options?: {
    limit?: number;
    propertiesFilter?: string;
    treatmentsFilter?: string;
    articlesFilter?: string;
  }
): Promise<MultiSearchResults> {
  const startTime = Date.now();
  const limit = options?.limit ?? 10;

  // Build filter strings with published check
  const propertiesFilter = options?.propertiesFilter
    ? `published = true AND (${options.propertiesFilter})`
    : 'published = true';
  const treatmentsFilter = options?.treatmentsFilter
    ? `published = true AND (${options.treatmentsFilter})`
    : 'published = true';
  const articlesFilter = options?.articlesFilter
    ? `published = true AND (${options.articlesFilter})`
    : 'published = true';

  const results = await searchClient.multiSearch({
    queries: [
      {
        indexUid: SEARCH_INDEXES.PROPERTIES,
        q: query,
        limit,
        filter: propertiesFilter,
        attributesToHighlight: ['name', 'description'],
        attributesToCrop: ['description'],
        cropLength: 100,
      },
      {
        indexUid: SEARCH_INDEXES.TREATMENTS,
        q: query,
        limit,
        filter: treatmentsFilter,
        attributesToHighlight: ['name', 'description', 'aliases'],
        attributesToCrop: ['description'],
        cropLength: 100,
      },
      {
        indexUid: SEARCH_INDEXES.ARTICLES,
        q: query,
        limit,
        filter: articlesFilter,
        attributesToHighlight: ['title', 'excerpt'],
        attributesToCrop: ['excerpt'],
        cropLength: 100,
      },
    ],
  });

  const totalProcessingTimeMs = Date.now() - startTime;

  return {
    properties: {
      hits: results.results[0].hits as PropertySearchDocument[],
      totalHits: results.results[0].estimatedTotalHits || 0,
      processingTimeMs: results.results[0].processingTimeMs || 0,
    },
    treatments: {
      hits: results.results[1].hits as TreatmentSearchDocument[],
      totalHits: results.results[1].estimatedTotalHits || 0,
      processingTimeMs: results.results[1].processingTimeMs || 0,
    },
    articles: {
      hits: results.results[2].hits as ArticleSearchDocument[],
      totalHits: results.results[2].estimatedTotalHits || 0,
      processingTimeMs: results.results[2].processingTimeMs || 0,
    },
    query,
    totalProcessingTimeMs,
  };
}

// ============================================================================
// Single Index Search
// ============================================================================

/**
 * Search properties index
 */
export async function searchProperties(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string[];
  }
): Promise<{
  hits: PropertySearchDocument[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const index = searchClient.index(SEARCH_INDEXES.PROPERTIES);

  const filterParts: string[] = ['published = true'];
  if (options?.filter) {
    filterParts.push(`(${options.filter})`);
  }

  const result = await index.search<PropertySearchDocument>(query, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    filter: filterParts.join(' AND '),
    sort: options?.sort,
    attributesToHighlight: ['name', 'description'],
    attributesToCrop: ['description'],
    cropLength: 200,
  });

  return {
    hits: result.hits,
    totalHits: result.estimatedTotalHits || 0,
    processingTimeMs: result.processingTimeMs || 0,
  };
}

/**
 * Search treatments index
 */
export async function searchTreatments(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string[];
  }
): Promise<{
  hits: TreatmentSearchDocument[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const index = searchClient.index(SEARCH_INDEXES.TREATMENTS);

  const filterParts: string[] = ['published = true'];
  if (options?.filter) {
    filterParts.push(`(${options.filter})`);
  }

  const result = await index.search<TreatmentSearchDocument>(query, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    filter: filterParts.join(' AND '),
    sort: options?.sort,
    attributesToHighlight: ['name', 'description', 'aliases'],
    attributesToCrop: ['description'],
    cropLength: 200,
  });

  return {
    hits: result.hits,
    totalHits: result.estimatedTotalHits || 0,
    processingTimeMs: result.processingTimeMs || 0,
  };
}

/**
 * Search articles index
 */
export async function searchArticles(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string[];
  }
): Promise<{
  hits: ArticleSearchDocument[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const index = searchClient.index(SEARCH_INDEXES.ARTICLES);

  const filterParts: string[] = ['published = true'];
  if (options?.filter) {
    filterParts.push(`(${options.filter})`);
  }

  const result = await index.search<ArticleSearchDocument>(query, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    filter: filterParts.join(' AND '),
    sort: options?.sort ?? ['publishedAt:desc'],
    attributesToHighlight: ['title', 'excerpt', 'content'],
    attributesToCrop: ['content', 'excerpt'],
    cropLength: 200,
  });

  return {
    hits: result.hits,
    totalHits: result.estimatedTotalHits || 0,
    processingTimeMs: result.processingTimeMs || 0,
  };
}

// ============================================================================
// Search Suggestions (Type-ahead)
// ============================================================================

/**
 * Get search suggestions for autocomplete
 * Returns top 5 results from each category
 */
export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const results = await searchAll(query, { limit: 5 });
  const suggestions: SearchSuggestion[] = [];

  // Add property suggestions
  for (const property of results.properties.hits) {
    suggestions.push({
      id: property.id,
      type: 'property',
      title: property.name,
      subtitle: `${property.city}, ${property.country}`,
      url: `/properties/${property.slug}`,
      imageUrl: property.featuredImageUrl,
    });
  }

  // Add treatment suggestions
  for (const treatment of results.treatments.hits) {
    suggestions.push({
      id: treatment.id,
      type: 'treatment',
      title: treatment.name,
      subtitle: treatment.category.replace(/_/g, ' '),
      url: `/treatments/${treatment.slug}`,
      imageUrl: null,
    });
  }

  // Add article suggestions
  for (const article of results.articles.hits) {
    suggestions.push({
      id: article.id,
      type: 'article',
      title: article.title,
      subtitle: article.category.replace(/_/g, ' '),
      url: `/articles/${article.slug}`,
      imageUrl: article.featuredImage,
    });
  }

  return suggestions;
}

// ============================================================================
// Filtered Property Search (for listing pages)
// ============================================================================

export interface PropertySearchFilters {
  tier?: string[];
  country?: string;
  region?: string;
  approach?: string[];
  focusAreas?: string[];
  priceMin?: number;
  priceMax?: number;
  minScore?: number;
  verifiedOnly?: boolean;
  editorChoiceOnly?: boolean;
}

/**
 * Build Meilisearch filter string from property filters
 */
export function buildPropertyFilterString(filters: PropertySearchFilters): string {
  const parts: string[] = [];

  if (filters.tier && filters.tier.length > 0) {
    parts.push(`tier IN [${filters.tier.map(t => `"${t}"`).join(', ')}]`);
  }

  if (filters.country) {
    parts.push(`country = "${filters.country}"`);
  }

  if (filters.region) {
    parts.push(`region = "${filters.region}"`);
  }

  if (filters.approach && filters.approach.length > 0) {
    parts.push(`approach IN [${filters.approach.map(a => `"${a}"`).join(', ')}]`);
  }

  if (filters.focusAreas && filters.focusAreas.length > 0) {
    // Meilisearch uses array contains syntax
    const focusFilters = filters.focusAreas.map(f => `focusAreas = "${f}"`);
    parts.push(`(${focusFilters.join(' OR ')})`);
  }

  if (filters.priceMin !== undefined) {
    parts.push(`priceMin >= ${filters.priceMin}`);
  }

  if (filters.priceMax !== undefined) {
    parts.push(`priceMax <= ${filters.priceMax}`);
  }

  if (filters.minScore !== undefined) {
    parts.push(`overallScore >= ${filters.minScore}`);
  }

  if (filters.verifiedOnly) {
    parts.push('verifiedExcellence = true');
  }

  if (filters.editorChoiceOnly) {
    parts.push('editorChoice IS NOT NULL');
  }

  return parts.join(' AND ');
}

/**
 * Search properties with filters for listing pages
 */
export async function searchPropertiesWithFilters(
  query: string,
  filters: PropertySearchFilters,
  options?: {
    limit?: number;
    offset?: number;
    sort?: string;
  }
): Promise<{
  hits: PropertySearchDocument[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const filterString = buildPropertyFilterString(filters);

  // Map sort string to Meilisearch format
  let sortArray: string[] | undefined;
  if (options?.sort) {
    switch (options.sort) {
      case 'score_desc':
        sortArray = ['overallScore:desc'];
        break;
      case 'score_asc':
        sortArray = ['overallScore:asc'];
        break;
      case 'price_asc':
        sortArray = ['priceMin:asc'];
        break;
      case 'price_desc':
        sortArray = ['priceMax:desc'];
        break;
      case 'newest':
        sortArray = ['createdAt:desc'];
        break;
      default:
        sortArray = ['overallScore:desc'];
    }
  }

  return searchProperties(query, {
    limit: options?.limit,
    offset: options?.offset,
    filter: filterString || undefined,
    sort: sortArray,
  });
}

// ============================================================================
// Treatment Filter Search
// ============================================================================

export interface TreatmentSearchFilters {
  category?: string[];
  evidenceLevel?: string[];
}

/**
 * Build Meilisearch filter string from treatment filters
 */
export function buildTreatmentFilterString(filters: TreatmentSearchFilters): string {
  const parts: string[] = [];

  if (filters.category && filters.category.length > 0) {
    parts.push(`category IN [${filters.category.map(c => `"${c}"`).join(', ')}]`);
  }

  if (filters.evidenceLevel && filters.evidenceLevel.length > 0) {
    parts.push(`evidenceLevel IN [${filters.evidenceLevel.map(e => `"${e}"`).join(', ')}]`);
  }

  return parts.join(' AND ');
}

/**
 * Search treatments with filters
 */
export async function searchTreatmentsWithFilters(
  query: string,
  filters: TreatmentSearchFilters,
  options?: {
    limit?: number;
    offset?: number;
    sort?: string;
  }
): Promise<{
  hits: TreatmentSearchDocument[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const filterString = buildTreatmentFilterString(filters);

  let sortArray: string[] | undefined;
  if (options?.sort) {
    switch (options.sort) {
      case 'name_asc':
        sortArray = ['name:asc'];
        break;
      case 'name_desc':
        sortArray = ['name:desc'];
        break;
      case 'properties':
        sortArray = ['propertyCount:desc'];
        break;
      default:
        sortArray = ['name:asc'];
    }
  }

  return searchTreatments(query, {
    limit: options?.limit,
    offset: options?.offset,
    filter: filterString || undefined,
    sort: sortArray,
  });
}
