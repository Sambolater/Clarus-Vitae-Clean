/**
 * Clarus Vitae Database Package
 *
 * Exports the Prisma client and related utilities for database access.
 * Also exports search utilities for Meilisearch integration.
 * Also exports Sanity CMS integration for editorial content.
 */

export { db } from './client';

// Re-export Prisma client for direct access
export { db as prisma } from './client';

// Export our type definitions (always available, no Prisma generation needed)
export * from './types';

// Note: Import Prisma types directly from '@prisma/client' when needed
// We don't re-export here to avoid lint errors before db:generate runs

export * from './services';

// Search exports
export * from './search';

// Sanity CMS exports - use path alias for tree-shaking
// Import from '@clarus-vitae/database/sanity' for Sanity-specific functionality
