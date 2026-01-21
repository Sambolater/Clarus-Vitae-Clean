/**
 * Sanity CMS Integration
 *
 * This module provides the Sanity client, GROQ queries, and fetch functions
 * for retrieving editorial content from Sanity CMS.
 *
 * This module is server-only. Client components should import types from
 * '@clarus-vitae/database/sanity' using `import type` syntax only.
 *
 * @example
 * import { getArticles, getArticleBySlug, urlFor } from '@clarus/database/sanity';
 *
 * // Fetch all articles
 * const articles = await getArticles();
 *
 * // Fetch a single article
 * const article = await getArticleBySlug('longevity-clinics-guide');
 *
 * // Generate image URL
 * const imageUrl = urlFor(article.heroImage).width(800).url();
 */

// Prevent client-side imports of this module
import 'server-only';

export {
  sanityClient,
  sanityWriteClient,
  sanityPreviewClient,
  getClient,
  urlFor,
  projectId,
  dataset,
  apiVersion,
} from './client';

export * from './queries';
export * from './types';
export * from './fetchers';
