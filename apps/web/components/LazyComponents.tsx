/**
 * Lazy Loading Components
 *
 * Heavy components loaded on demand to improve initial page load.
 * Uses Next.js dynamic imports for code splitting.
 */

'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner, Skeleton } from '@clarus-vitae/ui';

/**
 * Loading skeleton for cards
 */
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-stone bg-white p-4">
      <div className="mb-4 h-48 rounded bg-stone" />
      <div className="mb-2 h-4 w-3/4 rounded bg-stone" />
      <div className="h-4 w-1/2 rounded bg-stone" />
    </div>
  );
}

/**
 * Loading skeleton for tables
 */
function TableSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-stone bg-white">
      <div className="border-b border-stone p-4">
        <div className="h-6 w-1/4 rounded bg-stone" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 border-b border-stone p-4 last:border-0">
          <div className="h-4 w-1/4 rounded bg-stone" />
          <div className="h-4 w-1/4 rounded bg-stone" />
          <div className="h-4 w-1/4 rounded bg-stone" />
          <div className="h-4 w-1/4 rounded bg-stone" />
        </div>
      ))}
    </div>
  );
}

/**
 * Loading spinner centered
 */
function CenteredSpinner() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

/**
 * ComparisonTable - Heavy component for property comparison
 */
export const ComparisonTable = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ComparisonTable),
  {
    loading: () => <TableSkeleton />,
    ssr: true,
  }
);

/**
 * TreatmentComparisonMatrix - Heavy component for treatment comparison
 */
export const TreatmentComparisonMatrix = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.TreatmentComparisonMatrix),
  {
    loading: () => <TableSkeleton />,
    ssr: true,
  }
);

/**
 * MobileComparisonView - Client-only comparison view
 */
export const MobileComparisonView = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.MobileComparisonView),
  {
    loading: () => <CenteredSpinner />,
    ssr: false, // Client-only for mobile detection
  }
);

/**
 * ReviewSubmissionForm - Client-only form component
 */
export const ReviewSubmissionForm = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ReviewSubmissionForm),
  {
    loading: () => <CenteredSpinner />,
    ssr: false, // Client-only for form state
  }
);

/**
 * FollowUpForm - Client-only follow-up form
 */
export const FollowUpForm = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.FollowUpForm),
  {
    loading: () => <CenteredSpinner />,
    ssr: false,
  }
);

/**
 * InquiryForm - Client-only inquiry form
 */
export const InquiryForm = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.InquiryForm),
  {
    loading: () => <CenteredSpinner />,
    ssr: false,
  }
);

/**
 * SecureInquiryForm - Client-only secure inquiry form
 */
export const SecureInquiryForm = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.SecureInquiryForm),
  {
    loading: () => <CenteredSpinner />,
    ssr: false,
  }
);

/**
 * BatchInquiryForm - Client-only batch inquiry form
 */
export const BatchInquiryForm = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.BatchInquiryForm),
  {
    loading: () => <CenteredSpinner />,
    ssr: false,
  }
);

/**
 * Modal - Client-only overlay component
 */
export const Modal = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.Modal),
  {
    loading: () => null, // Modals start hidden
    ssr: false,
  }
);

/**
 * Drawer - Client-only drawer component
 */
export const Drawer = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.Drawer),
  {
    loading: () => null,
    ssr: false,
  }
);

/**
 * ComparisonBar - Client-only comparison bar
 */
export const ComparisonBar = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ComparisonBar),
  {
    loading: () => null, // Bar appears at bottom
    ssr: false,
  }
);

/**
 * ScoreComparison - Score comparison visualization
 */
export const ScoreComparison = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ScoreComparison),
  {
    loading: () => <CardSkeleton />,
    ssr: true,
  }
);

/**
 * ReviewFilters - Client-only filter component
 */
export const ReviewFilters = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ReviewFilters),
  {
    loading: () => (
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    ),
    ssr: false,
  }
);

/**
 * FilterSidebar - Client-only filter sidebar
 */
export const FilterSidebar = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.FilterSidebar),
  {
    loading: () => (
      <div className="w-64 animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-1/2 rounded bg-stone" />
            <div className="space-y-2">
              <div className="h-8 rounded bg-stone" />
              <div className="h-8 rounded bg-stone" />
            </div>
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

/**
 * ContactAdvisor - Contact form modal
 */
export const ContactAdvisor = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.ContactAdvisor),
  {
    loading: () => <CenteredSpinner />,
    ssr: false,
  }
);

/**
 * MeasurableOutcomesDisplay - Complex data visualization
 */
export const MeasurableOutcomesDisplay = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.MeasurableOutcomesDisplay),
  {
    loading: () => <CardSkeleton />,
    ssr: true,
  }
);

/**
 * DataDeletionButton - Privacy controls (client-only)
 */
export const DataDeletionButton = dynamic(
  () => import('@clarus-vitae/ui').then((mod) => mod.DataDeletionButton),
  {
    loading: () => <Skeleton className="h-10 w-32" />,
    ssr: false,
  }
);
