/**
 * Search Module - Clarus Vitae
 *
 * Exports all search-related functionality including client, indexing, and queries.
 */

// Client
export { searchClient, SEARCH_INDEXES, type SearchIndex } from './client';

// Configuration
export {
  propertiesIndexSettings,
  treatmentsIndexSettings,
  articlesIndexSettings,
} from './config';

// Types
export type {
  PropertySearchDocument,
  TreatmentSearchDocument,
  ArticleSearchDocument,
  SearchHit,
  MultiSearchResults,
  SearchSuggestion,
} from './types';

// Indexing
export {
  initializeSearchIndexes,
  transformPropertyToDocument,
  indexProperty,
  removePropertyFromIndex,
  indexAllProperties,
  transformTreatmentToDocument,
  indexTreatment,
  removeTreatmentFromIndex,
  indexAllTreatments,
  transformArticleToDocument,
  indexArticle,
  removeArticleFromIndex,
  indexAllArticles,
  reindexAll,
  getIndexStats,
} from './indexing';

// Queries
export {
  searchAll,
  searchProperties,
  searchTreatments,
  searchArticles,
  getSearchSuggestions,
  buildPropertyFilterString,
  searchPropertiesWithFilters,
  buildTreatmentFilterString,
  searchTreatmentsWithFilters,
  type PropertySearchFilters,
  type TreatmentSearchFilters,
} from './queries';
