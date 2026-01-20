/**
 * Sanity CMS Integration
 *
 * This module provides the Sanity client, GROQ queries, and fetch functions
 * for retrieving editorial content from Sanity CMS.
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
