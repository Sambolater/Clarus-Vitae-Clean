/**
 * Meilisearch Client Configuration
 *
 * Provides a singleton Meilisearch client instance for search operations.
 * Self-hosted for privacy - no data leaves our infrastructure.
 */

import { MeiliSearch } from 'meilisearch';

const globalForMeili = globalThis as unknown as {
  meilisearch: MeiliSearch | undefined;
};

/**
 * Meilisearch client instance.
 * Uses a global singleton in development to prevent multiple instances during hot reload.
 */
export const searchClient =
  globalForMeili.meilisearch ??
  new MeiliSearch({
    host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILISEARCH_MASTER_KEY || 'clarus_vitae_dev_key_change_in_production',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForMeili.meilisearch = searchClient;
}

/**
 * Index names used by Clarus Vitae
 */
export const SEARCH_INDEXES = {
  PROPERTIES: 'properties',
  TREATMENTS: 'treatments',
  ARTICLES: 'articles',
} as const;

export type SearchIndex = (typeof SEARCH_INDEXES)[keyof typeof SEARCH_INDEXES];
