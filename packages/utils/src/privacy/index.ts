/**
 * Clarus Vitae - Privacy Infrastructure
 *
 * Core privacy utilities for the platform's privacy-first architecture.
 * Implements Research Mode and consent management (client-safe).
 *
 * NOTE: Server-only modules (encryption, deletion) must be imported directly:
 * - import { encryptPII, decryptPII } from '@clarus-vitae/utils/privacy/encryption'
 * - import { ... } from '@clarus-vitae/utils/privacy/deletion'
 */

// Client-safe exports only
export * from './research-mode';
export * from './consent';
