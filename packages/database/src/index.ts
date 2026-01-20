/**
 * Clarus Vitae Database Package
 *
 * Exports the Prisma client and related utilities for database access.
 * Also exports search utilities for Meilisearch integration.
 */

export { db } from './client';
export * from '@prisma/client';
export * from './services';

// Search exports
export * from './search';
