'use client';

import { cn } from '@clarus-vitae/utils';
import Link from 'next/link';

import { Button } from '../Button/Button';

// ============================================
// TYPES
// ============================================

export interface InquiryConfirmationProps {
  inquiryId: string;
  propertyName: string;
  propertySlug: string;
  email: string;
  isSecure?: boolean;
  onClose?: () => void;
  className?: string;
}

// ============================================
// ICONS
// ============================================

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

// ============================================
// COMPONENT
// ============================================

/**
 * Confirmation screen shown after successful inquiry submission.
 */
export function InquiryConfirmation({
  inquiryId,
  propertyName,
  propertySlug,
  email,
  isSecure = false,
  onClose,
  className,
}: InquiryConfirmationProps) {
  return (
    <div className={cn('text-center', className)}>
      {/* Success Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-verification-green/10">
        <CheckCircleIcon className="h-10 w-10 text-verification-green" />
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl font-medium text-clarus-navy mb-2">
        {isSecure ? 'Secure Inquiry Sent' : 'Inquiry Sent Successfully'}
      </h2>

      <p className="text-slate mb-6">
        Your inquiry to <span className="font-medium text-clarus-navy">{propertyName}</span>{' '}
        has been submitted.
      </p>

      {/* What Happens Next */}
      <div className="rounded-lg border border-stone bg-warm-gray/30 p-4 mb-6 text-left">
        <h3 className="font-medium text-clarus-navy mb-3">What happens next</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <EnvelopeIcon className="h-5 w-5 text-clarus-navy flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-clarus-navy">The property will receive your inquiry within 24 hours</p>
              <p className="text-slate">They will contact you directly at {email}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ClockIcon className="h-5 w-5 text-clarus-navy flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-clarus-navy">Most properties respond within 2-3 business days</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <ShieldIcon className="h-5 w-5 text-verification-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-clarus-navy">Your data is encrypted and protected</p>
              {isSecure && (
                <p className="text-slate">Auto-deletion scheduled per your preferences</p>
              )}
            </div>
          </li>
        </ul>
      </div>

      {/* Inquiry Reference */}
      <p className="text-sm text-slate mb-6">
        Your inquiry reference: <span className="font-mono text-clarus-navy">{inquiryId}</span>
      </p>

      {/* Data Management Link */}
      <p className="text-sm text-slate mb-6">
        You can view, export, or delete your inquiry data anytime in your{' '}
        <Link href="/privacy/dashboard" className="text-clarus-navy underline hover:text-clarus-navy/80">
          Privacy Dashboard
        </Link>
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link href={`/properties/${propertySlug}`}>
          <Button variant="secondary" className="w-full">
            Back to {propertyName}
          </Button>
        </Link>

        <Link href="/properties">
          <Button variant="tertiary" className="w-full">
            Browse More Properties
          </Button>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate hover:text-clarus-navy transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

InquiryConfirmation.displayName = 'InquiryConfirmation';
