/**
 * Clarus Vitae Database Package
 *
 * Exports the Prisma client and related utilities for database access.
 * Also exports search utilities for Meilisearch integration.
 */

export { db } from './client';

// Export our type definitions (always available, no Prisma generation needed)
export * from './types';

// Re-export from Prisma client (available after db:generate)
export * from '@prisma/client';

export * from './services';

// Search exports
export * from './search';
