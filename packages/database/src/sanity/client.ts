import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Sanity Client Configuration
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID: Your Sanity project ID
 * - NEXT_PUBLIC_SANITY_DATASET: Dataset name (usually 'production')
 * - SANITY_API_TOKEN: Optional API token for authenticated requests
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Validate environment variables
if (!projectId) {
  console.warn(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity features will not work.'
  );
}

/**
 * Public Sanity client for read operations
 * Uses CDN for production for better performance
 */
export const sanityClient: SanityClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

/**
 * Authenticated Sanity client for write operations
 * Only use server-side, never expose token to client
 */
export const sanityWriteClient: SanityClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Preview client for draft content
 * Used in preview mode to fetch unpublished content
 */
export const sanityPreviewClient: SanityClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URLs from Sanity image references
 *
 * @example
 * urlFor(article.heroImage).width(800).height(600).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(preview = false): SanityClient {
  return preview ? sanityPreviewClient : sanityClient;
}

export { projectId, dataset, apiVersion };
