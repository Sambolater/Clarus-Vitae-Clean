/**
 * Data Deletion Service
 *
 * Implements GDPR-compliant data deletion (Right to Erasure).
 * Provides complete data removal including backup purge within 30 days.
 *
 * Key features:
 * - One-click deletion request
 * - Complete data enumeration before deletion
 * - Soft delete with hard delete scheduling
 * - Backup purge within 30 days (per GDPR requirements)
 * - Audit trail for compliance
 */

import { generateSecureToken } from './encryption';

/**
 * Data categories that can be deleted
 */
export type DataCategory =
  | 'inquiries'
  | 'reviews'
  | 'comparisons'
  | 'savedProperties'
  | 'userAccount'
  | 'consentRecords';

/**
 * Deletion request input
 */
export interface DeletionRequest {
  userId?: string;          // For authenticated users
  email?: string;           // For unauthenticated lookup
  emailHash?: string;       // Pre-hashed email
  includeBackups: boolean;  // Schedule backup purge within 30 days
  verificationCode?: string; // Required for unauthenticated requests
}

/**
 * Deletion result summary
 */
export interface DeletionResult {
  requestId: string;
  status: 'pending_verification' | 'queued' | 'processing' | 'completed' | 'failed';
  itemsQueued: {
    inquiries: number;
    reviews: number;
    comparisons: number;
    savedProperties: number;
    userAccount: boolean;
  };
  estimatedCompletionDate: Date;
  backupPurgeDate: Date | null;
  verificationRequired: boolean;
  verificationExpiry?: Date;
}

/**
 * Data export structure for GDPR portability
 */
export interface UserDataExport {
  exportId: string;
  requestedAt: Date;
  generatedAt: Date;
  format: 'json' | 'csv';
  data: {
    profile?: Record<string, unknown>;
    inquiries?: Record<string, unknown>[];
    reviews?: Record<string, unknown>[];
    comparisons?: Record<string, unknown>[];
    savedProperties?: Record<string, unknown>[];
    consentHistory?: Record<string, unknown>[];
  };
}

/**
 * Deletion audit log entry
 */
export interface DeletionAuditEntry {
  requestId: string;
  action: 'request' | 'verify' | 'soft_delete' | 'hard_delete' | 'backup_purge';
  category: DataCategory;
  recordCount: number;
  timestamp: Date;
  performedBy: 'user' | 'system' | 'scheduled';
}

/**
 * Generate a unique deletion request ID
 */
export function generateDeletionRequestId(): string {
  return `del_${Date.now()}_${generateSecureToken(8)}`;
}

/**
 * Generate a verification token for unauthenticated deletion requests
 * @param expiryMinutes - Minutes until token expires (default 30)
 */
export function generateDeletionVerificationToken(expiryMinutes: number = 30): {
  token: string;
  expiry: Date;
} {
  const token = generateSecureToken(32);
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
  return { token, expiry };
}

/**
 * Calculate estimated completion date based on data volume
 * @param itemCount - Total items to delete
 * @returns Estimated completion date
 */
export function calculateCompletionDate(itemCount: number): Date {
  // Base: 1 day for small amounts, up to 7 days for large datasets
  const baseDays = 1;
  const additionalDays = Math.min(Math.floor(itemCount / 100), 6);
  const totalDays = baseDays + additionalDays;

  const completion = new Date();
  completion.setDate(completion.getDate() + totalDays);
  return completion;
}

/**
 * Calculate backup purge date (max 30 days per GDPR)
 * @returns Date when backups will be purged
 */
export function calculateBackupPurgeDate(): Date {
  const purgeDate = new Date();
  purgeDate.setDate(purgeDate.getDate() + 30);
  return purgeDate;
}

/**
 * Validate deletion request has required fields
 * @param request - Deletion request to validate
 * @throws Error if request is invalid
 */
export function validateDeletionRequest(request: DeletionRequest): void {
  if (!request.userId && !request.email && !request.emailHash) {
    throw new Error('Deletion request requires userId, email, or emailHash');
  }

  // Unauthenticated requests require email verification
  if (!request.userId && !request.verificationCode) {
    // Request will be pending verification
    return;
  }
}

/**
 * Data types that are permanently deleted vs anonymized
 */
export const DELETION_BEHAVIOR: Record<
  DataCategory,
  'delete' | 'anonymize' | 'retain_anonymized'
> = {
  inquiries: 'delete',           // Full deletion
  reviews: 'anonymize',          // Keep review, remove PII
  comparisons: 'delete',         // Full deletion
  savedProperties: 'delete',     // Full deletion
  userAccount: 'delete',         // Full deletion
  consentRecords: 'retain_anonymized',  // Keep for compliance, anonymize
};

/**
 * Create a deletion result for a new request
 * @param request - The deletion request
 * @param itemCounts - Counts of items to delete
 */
export function createDeletionResult(
  request: DeletionRequest,
  itemCounts: {
    inquiries: number;
    reviews: number;
    comparisons: number;
    savedProperties: number;
    userAccount: boolean;
  }
): DeletionResult {
  const requestId = generateDeletionRequestId();
  const totalItems = Object.values(itemCounts).reduce((sum, val) => {
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);

  const needsVerification = !request.userId && !request.verificationCode;
  const verificationToken = needsVerification
    ? generateDeletionVerificationToken()
    : undefined;

  return {
    requestId,
    status: needsVerification ? 'pending_verification' : 'queued',
    itemsQueued: itemCounts,
    estimatedCompletionDate: calculateCompletionDate(totalItems),
    backupPurgeDate: request.includeBackups ? calculateBackupPurgeDate() : null,
    verificationRequired: needsVerification,
    verificationExpiry: verificationToken?.expiry,
  };
}

/**
 * Format deletion summary for user display
 * @param result - Deletion result
 * @returns Human-readable summary
 */
export function formatDeletionSummary(result: DeletionResult): string {
  const lines: string[] = [
    `Deletion Request: ${result.requestId}`,
    `Status: ${result.status.replace(/_/g, ' ')}`,
    '',
    'Data to be deleted:',
  ];

  if (result.itemsQueued.inquiries > 0) {
    lines.push(`- ${result.itemsQueued.inquiries} inquiry record(s)`);
  }
  if (result.itemsQueued.reviews > 0) {
    lines.push(`- ${result.itemsQueued.reviews} review(s) (will be anonymized)`);
  }
  if (result.itemsQueued.comparisons > 0) {
    lines.push(`- ${result.itemsQueued.comparisons} saved comparison(s)`);
  }
  if (result.itemsQueued.savedProperties > 0) {
    lines.push(`- ${result.itemsQueued.savedProperties} saved property(ies)`);
  }
  if (result.itemsQueued.userAccount) {
    lines.push('- Your account and profile');
  }

  lines.push('');
  lines.push(`Estimated completion: ${result.estimatedCompletionDate.toLocaleDateString()}`);

  if (result.backupPurgeDate) {
    lines.push(`Backup purge: ${result.backupPurgeDate.toLocaleDateString()}`);
  }

  return lines.join('\n');
}

/**
 * Clear all client-side data (cookies, localStorage, sessionStorage)
 * Called after deletion request is submitted
 */
export function clearClientSideData(): void {
  if (typeof window === 'undefined') return;

  // Clear localStorage
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('clarus_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }

  // Clear sessionStorage
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('clarus_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }

  // Clear cookies
  const cookiesToClear = [
    'clarus_privacy_mode',
    'clarus_consent_banner',
    'clarus_session',
  ];

  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * Get list of data types the user has
 * Used to show what will be deleted before confirmation
 */
export function getDataCategories(): Array<{
  category: DataCategory;
  name: string;
  description: string;
  action: string;
}> {
  return [
    {
      category: 'inquiries',
      name: 'Property Inquiries',
      description: 'Your inquiry history and contact information',
      action: 'Permanently deleted',
    },
    {
      category: 'reviews',
      name: 'Reviews',
      description: 'Reviews you have submitted',
      action: 'Anonymized (content retained without your identity)',
    },
    {
      category: 'comparisons',
      name: 'Saved Comparisons',
      description: 'Property comparison lists',
      action: 'Permanently deleted',
    },
    {
      category: 'savedProperties',
      name: 'Saved Properties',
      description: 'Properties you have saved or bookmarked',
      action: 'Permanently deleted',
    },
    {
      category: 'userAccount',
      name: 'Account',
      description: 'Your account profile and settings',
      action: 'Permanently deleted',
    },
    {
      category: 'consentRecords',
      name: 'Consent Records',
      description: 'Your privacy consent history (required for compliance)',
      action: 'Anonymized and retained for legal compliance',
    },
  ];
}
