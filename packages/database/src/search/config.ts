/**
 * Meilisearch Index Configuration
 *
 * Defines the searchable attributes, filterable attributes, and ranking rules
 * for each search index used by Clarus Vitae.
 */

import type { Settings } from 'meilisearch';

/**
 * Properties Index Configuration
 *
 * Enables searching for wellness properties by name, description, location.
 * Supports filtering by tier, approach, focus areas, price, and more.
 */
export const propertiesIndexSettings: Settings = {
  searchableAttributes: [
    'name',
    'description',
    'city',
    'country',
    'region',
  ],
  filterableAttributes: [
    'tier',
    'approach',
    'focusAreas',
    'country',
    'region',
    'priceMin',
    'priceMax',
    'overallScore',
    'published',
    'verifiedExcellence',
    'editorChoice',
    'risingStar',
  ],
  sortableAttributes: [
    'overallScore',
    'priceMin',
    'priceMax',
    'name',
    'createdAt',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
    'overallScore:desc',
  ],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 4,
      twoTypos: 8,
    },
  },
  pagination: {
    maxTotalHits: 1000,
  },
};

/**
 * Treatments Index Configuration
 *
 * Enables searching for treatments by name, aliases, description, and what it addresses.
 * Supports filtering by category and evidence level.
 */
export const treatmentsIndexSettings: Settings = {
  searchableAttributes: [
    'name',
    'aliases',
    'description',
    'whatItAddresses',
    'howItWorks',
  ],
  filterableAttributes: [
    'category',
    'evidenceLevel',
    'published',
  ],
  sortableAttributes: [
    'name',
    'propertyCount',
    'evidenceLevel',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 4,
      twoTypos: 8,
    },
  },
  pagination: {
    maxTotalHits: 500,
  },
};

/**
 * Articles Index Configuration
 *
 * Enables searching editorial content by title, excerpt, content, and tags.
 * Supports filtering by category and publication status.
 */
export const articlesIndexSettings: Settings = {
  searchableAttributes: [
    'title',
    'excerpt',
    'content',
    'tags',
    'authorName',
  ],
  filterableAttributes: [
    'category',
    'published',
    'tags',
  ],
  sortableAttributes: [
    'publishedAt',
    'title',
  ],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: {
      oneTypo: 4,
      twoTypos: 8,
    },
  },
  pagination: {
    maxTotalHits: 500,
  },
};
