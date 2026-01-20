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

// Track if Sanity is properly configured
export const isSanityConfigured = Boolean(projectId);

// Validate environment variables
if (!projectId) {
  console.warn(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity features will not work.'
  );
}

/**
 * Create a Sanity client only if configured, otherwise return a mock client
 * that won't throw errors during build
 */
function createSafeClient(options: Parameters<typeof createClient>[0]): SanityClient {
  if (!projectId) {
    // Return a mock client that returns empty results
    // This prevents build failures when Sanity env vars aren't set
    return {
      fetch: async () => null,
      config: () => options,
    } as unknown as SanityClient;
  }
  return createClient(options);
}

/**
 * Public Sanity client for read operations
 * Uses CDN for production for better performance
 */
export const sanityClient: SanityClient = createSafeClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

/**
 * Authenticated Sanity client for write operations
 * Only use server-side, never expose token to client
 */
export const sanityWriteClient: SanityClient = createSafeClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Preview client for draft content
 * Used in preview mode to fetch unpublished content
 */
export const sanityPreviewClient: SanityClient = createSafeClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
});

// Image URL builder - only create if configured
const builder = isSanityConfigured
  ? imageUrlBuilder(sanityClient)
  : null;

/**
 * Generate optimized image URLs from Sanity image references
 *
 * @example
 * urlFor(article.heroImage).width(800).height(600).url()
 */
export function urlFor(source: SanityImageSource) {
  if (!builder) {
    // Return a mock image builder that returns empty string for URL
    // This allows builds to complete when Sanity is not configured
    const mockBuilder = {
      width: () => mockBuilder,
      height: () => mockBuilder,
      format: () => mockBuilder,
      quality: () => mockBuilder,
      auto: () => mockBuilder,
      fit: () => mockBuilder,
      url: () => '',
    };
    return mockBuilder;
  }
  return builder.image(source);
}

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(preview = false): SanityClient {
  return preview ? sanityPreviewClient : sanityClient;
}

export { projectId, dataset, apiVersion };
