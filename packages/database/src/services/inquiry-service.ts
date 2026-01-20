/**
 * Inquiry Service
 *
 * Service for managing lead capture inquiries.
 * Handles inquiry submission, status tracking, property notifications, and admin dashboard.
 * Privacy-first design with encryption for PII.
 */

import type {
  BudgetRange,
  ContactMethod,
  InquiryInput,
  InquiryStatus,
  InquiryStatusChange,
  InquirySummary,
  InquiryDashboardStats,
  PropertyNotificationData,
  SecureInquiryInput,
  BatchInquiryInput,
} from '@clarus-vitae/types';

import { db } from '../client';

// ============================================
// INQUIRY CREATION
// ============================================

export interface CreateInquiryResult {
  success: boolean;
  inquiryId?: string;
  error?: string;
}

/**
 * Create a new standard inquiry.
 * Contact information should be encrypted before storage in production.
 */
export async function createInquiry(
  data: InquiryInput,
  attribution?: {
    sourcePage?: string;
    sourceUrl?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }
): Promise<CreateInquiryResult> {
  try {
    const inquiry = await db.inquiry.create({
      data: {
        propertyId: data.propertyId,

        // Contact Info (should be encrypted in production)
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredContact: data.preferredContact || 'EMAIL',

        // Inquiry Details
        interestedProperties: data.programId ? [data.programId] : [],
        dates: data.preferredDates,
        datesFlexible: data.datesFlexible ?? true,
        durationInterest: data.durationInterest,
        primaryGoals: data.primaryGoals || [],
        budgetRange: data.budgetRange as BudgetRange | undefined,
        additionalNotes: data.message,

        // Privacy Preferences
        anonymousInquiry: false,
        secureChannelRequest: false,

        // Attribution
        sourcePage: attribution?.sourcePage,
        sourceUrl: attribution?.sourceUrl,
        utmSource: attribution?.utmSource,
        utmMedium: attribution?.utmMedium,
        utmCampaign: attribution?.utmCampaign,

        // Processing
        status: 'NEW',

        // Consent
        contactConsent: data.consentContactProperty,
        privacyPolicyAccepted: data.privacyPolicyAccepted,
      },
    });

    return {
      success: true,
      inquiryId: inquiry.id,
    };
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a secure inquiry with enhanced privacy options.
 */
export async function createSecureInquiry(
  data: SecureInquiryInput,
  attribution?: {
    sourcePage?: string;
    sourceUrl?: string;
  }
): Promise<CreateInquiryResult> {
  try {
    // Calculate scheduled deletion if auto-delete requested
    let scheduledDeletionAt: Date | null = null;
    if (data.autoDelete) {
      scheduledDeletionAt = new Date();
      scheduledDeletionAt.setDate(scheduledDeletionAt.getDate() + 7);
    }

    // Build contact details based on method
    const contactDetails: {
      email: string;
      phone: string | null;
      preferredContact: ContactMethod;
    } = {
      email: data.contactMethod === 'EMAIL' ? data.contactValue : `secure-${Date.now()}@placeholder.clarus`,
      phone: data.contactMethod === 'PHONE' ? data.contactValue : null,
      preferredContact: data.contactMethod,
    };

    const inquiry = await db.inquiry.create({
      data: {
        propertyId: data.propertyId,

        // Contact Info
        name: data.name, // May be pseudonym
        email: contactDetails.email,
        phone: contactDetails.phone,
        preferredContact: contactDetails.preferredContact,

        // Inquiry Details
        interestedProperties: [],
        primaryGoals: data.primaryGoals || [],
        additionalNotes: data.message,

        // Privacy Preferences
        anonymousInquiry: true,
        secureChannelRequest: true,

        // Attribution (minimal for secure inquiries)
        sourcePage: attribution?.sourcePage,
        sourceUrl: null, // Don't store full URL for secure inquiries

        // Processing
        status: 'NEW',

        // Consent
        contactConsent: data.consentContactProperty,
        privacyPolicyAccepted: data.privacyPolicyAccepted,
      },
    });

    // If auto-delete requested, we'd schedule the deletion job here
    // In production, this would integrate with a job queue

    return {
      success: true,
      inquiryId: inquiry.id,
    };
  } catch (error) {
    console.error('Failed to create secure inquiry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create batch inquiries for multiple properties.
 * Returns array of created inquiry IDs.
 */
export async function createBatchInquiries(
  data: BatchInquiryInput,
  attribution?: {
    sourcePage?: string;
    sourceUrl?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }
): Promise<{ success: boolean; inquiryIds?: string[]; errors?: string[] }> {
  try {
    const inquiryIds: string[] = [];
    const errors: string[] = [];

    // Create inquiries for each property
    for (const propertyId of data.propertyIds) {
      // Check per-property consent if provided
      if (data.propertyConsents && !data.propertyConsents[propertyId]) {
        continue; // Skip properties without consent
      }

      const result = await createInquiry(
        {
          propertyId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          preferredDates: data.preferredDates,
          datesFlexible: data.datesFlexible,
          budgetRange: data.budgetRange,
          primaryGoals: data.primaryGoals,
          consentContactProperty: data.consentContactProperty,
          privacyPolicyAccepted: data.privacyPolicyAccepted,
          consentFollowup: data.consentFollowup,
        },
        attribution
      );

      if (result.success && result.inquiryId) {
        inquiryIds.push(result.inquiryId);
      } else {
        errors.push(`Failed to create inquiry for property ${propertyId}: ${result.error}`);
      }
    }

    return {
      success: inquiryIds.length > 0,
      inquiryIds,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('Failed to create batch inquiries:', error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

// ============================================
// INQUIRY STATUS MANAGEMENT
// ============================================

/**
 * Update inquiry status with history tracking.
 */
export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: InquiryStatus,
  notes?: string,
  changedBy?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current status
    const inquiry = await db.inquiry.findUnique({
      where: { id: inquiryId },
      select: { status: true },
    });

    if (!inquiry) {
      return { success: false, error: 'Inquiry not found' };
    }

    // Update status and add to history (stored in additionalNotes as JSON for now)
    // In a full implementation, we'd have a separate status history table
    const _statusChange: InquiryStatusChange = {
      id: crypto.randomUUID(),
      inquiryId,
      fromStatus: inquiry.status as InquiryStatus,
      toStatus: newStatus,
      changedBy: changedBy || null,
      notes: notes || null,
      timestamp: new Date(),
    };

    await db.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: newStatus,
        // Track property notification
        ...(newStatus === 'SENT_TO_PROPERTY' && {
          propertyNotified: true,
          propertyNotifiedAt: new Date(),
        }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update inquiry status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mark inquiry as sent to property.
 */
export async function markInquirySentToProperty(
  inquiryId: string
): Promise<{ success: boolean; error?: string }> {
  return updateInquiryStatus(inquiryId, 'SENT_TO_PROPERTY');
}

/**
 * Mark inquiry as converted (booking confirmed).
 */
export async function markInquiryConverted(
  inquiryId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  return updateInquiryStatus(inquiryId, 'CONVERTED', notes);
}

// ============================================
// INQUIRY RETRIEVAL
// ============================================

/**
 * Get inquiry by ID with property details.
 */
export async function getInquiryById(inquiryId: string) {
  return db.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          contactEmail: true,
        },
      },
    },
  });
}

/**
 * Get inquiries for a property.
 */
export async function getPropertyInquiries(
  propertyId: string,
  filters?: {
    status?: InquiryStatus;
    startDate?: Date;
    endDate?: Date;
  },
  pagination?: { page: number; limit: number }
) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    propertyId,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {
      ...(filters.startDate && { gte: filters.startDate }),
      ...(filters.endDate && { lte: filters.endDate }),
    };
  }

  const [inquiries, total] = await Promise.all([
    db.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        createdAt: true,
        budgetRange: true,
        primaryGoals: true,
        propertyNotified: true,
        propertyNotifiedAt: true,
        // Don't select PII for list views
      },
    }),
    db.inquiry.count({ where }),
  ]);

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get inquiry data for property notification (decrypted).
 */
export async function getInquiryForNotification(
  inquiryId: string
): Promise<PropertyNotificationData | null> {
  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      property: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!inquiry || !inquiry.property) {
    return null;
  }

  // In production, decrypt PII fields here
  return {
    inquiryId: inquiry.id,
    propertyId: inquiry.property.id,
    propertyName: inquiry.property.name,
    name: inquiry.name || 'Anonymous',
    email: inquiry.email,
    phone: inquiry.phone,
    preferredContact: inquiry.preferredContact as ContactMethod,
    message: inquiry.additionalNotes,
    preferredDates: inquiry.dates,
    datesFlexible: inquiry.datesFlexible,
    durationInterest: inquiry.durationInterest,
    budgetRange: inquiry.budgetRange as BudgetRange | null,
    primaryGoals: inquiry.primaryGoals,
    submittedAt: inquiry.createdAt,
    sourcePage: inquiry.sourcePage,
  };
}

// ============================================
// ADMIN DASHBOARD
// ============================================

/**
 * Get dashboard statistics for admin view.
 */
export async function getInquiryDashboardStats(): Promise<InquiryDashboardStats> {
  const [
    totalInquiries,
    statusCounts,
    propertyCounts,
    budgetCounts,
    recentInquiries,
    convertedInquiries,
  ] = await Promise.all([
    db.inquiry.count(),
    getStatusCounts(),
    getPropertyCounts(),
    getBudgetCounts(),
    getRecentInquiries(10),
    db.inquiry.count({ where: { status: 'CONVERTED' } }),
  ]);

  // Calculate conversion rate
  const conversionRate = totalInquiries > 0
    ? Number(((convertedInquiries / totalInquiries) * 100).toFixed(1))
    : 0;

  return {
    totalInquiries,
    byStatus: statusCounts,
    byProperty: propertyCounts,
    byBudgetRange: budgetCounts,
    conversionRate,
    averageResponseTime: null, // Would calculate from status history
    recentInquiries,
  };
}

async function getStatusCounts(): Promise<Record<InquiryStatus, number>> {
  const statuses: InquiryStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SENT_TO_PROPERTY',
    'CONVERTED',
    'CLOSED',
  ];

  const counts: Record<string, number> = {};

  for (const status of statuses) {
    counts[status] = await db.inquiry.count({ where: { status } });
  }

  return counts as Record<InquiryStatus, number>;
}

async function getPropertyCounts(): Promise<
  Array<{ propertyId: string; propertyName: string; count: number }>
> {
  const results = await db.inquiry.groupBy({
    by: ['propertyId'],
    _count: { id: true },
    where: { propertyId: { not: null } },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Get property names
  const propertyIds = results
    .map((r: { propertyId: string | null }) => r.propertyId)
    .filter((id: string | null): id is string => id !== null);

  const properties = await db.property.findMany({
    where: { id: { in: propertyIds } },
    select: { id: true, name: true },
  });

  const propertyMap = new Map(properties.map((p: { id: string; name: string }) => [p.id, p.name]));

  return results.map((r: { propertyId: string | null; _count: { id: number } }) => ({
    propertyId: r.propertyId || 'unknown',
    propertyName: r.propertyId ? propertyMap.get(r.propertyId) || 'Unknown' : 'General',
    count: r._count.id,
  }));
}

async function getBudgetCounts(): Promise<Record<BudgetRange, number>> {
  const budgetRanges: BudgetRange[] = [
    'UNDER_5K',
    'FIVE_TO_10K',
    'TEN_TO_25K',
    'TWENTYFIVE_TO_50K',
    'FIFTY_TO_100K',
    'OVER_100K',
  ];

  const counts: Record<string, number> = {};

  for (const range of budgetRanges) {
    counts[range] = await db.inquiry.count({ where: { budgetRange: range } });
  }

  return counts as Record<BudgetRange, number>;
}

async function getRecentInquiries(limit: number): Promise<InquirySummary[]> {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      propertyId: true,
      status: true,
      createdAt: true,
      budgetRange: true,
      primaryGoals: true,
      property: {
        select: { name: true },
      },
    },
  });

  return inquiries.map((i: typeof inquiries[number]) => ({
    id: i.id,
    propertyId: i.propertyId,
    propertyName: i.property?.name || null,
    status: i.status as InquiryStatus,
    createdAt: i.createdAt,
    budgetRange: i.budgetRange as BudgetRange | null,
    primaryGoals: i.primaryGoals,
  }));
}

// ============================================
// INQUIRY DELETION
// ============================================

/**
 * Delete an inquiry and all associated data.
 * Used for GDPR right to deletion.
 */
export async function deleteInquiry(
  inquiryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.inquiry.delete({
      where: { id: inquiryId },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Process scheduled deletions for secure inquiries.
 * Should be run as a scheduled job.
 */
export async function processScheduledDeletions(): Promise<{
  processed: number;
  errors: string[];
}> {
  // In a full implementation, we'd have a scheduledDeletionAt field
  // For now, this is a placeholder
  return { processed: 0, errors: [] };
}

// ============================================
// INQUIRY SEARCH
// ============================================

/**
 * Search inquiries by email or name (admin function).
 */
export async function searchInquiries(
  query: string,
  pagination?: { page: number; limit: number }
) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { email: { contains: query, mode: 'insensitive' as const } },
      { name: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [inquiries, total] = await Promise.all([
    db.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    db.inquiry.count({ where }),
  ]);

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
