'use client';

import Link from 'next/link';
import { cn } from '@clarus-vitae/utils';

// ============================================
// TYPES
// ============================================

export interface PrivacyNoteProps {
  onSecureInquiryClick?: () => void;
  className?: string;
  compact?: boolean;
}

// ============================================
// ICONS
// ============================================

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ============================================
// COMPONENT
// ============================================

/**
 * Privacy note component for inquiry forms.
 * Displays privacy assurances and links to privacy dashboard.
 */
export function PrivacyNote({
  onSecureInquiryClick,
  className,
  compact = false,
}: PrivacyNoteProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-verification-green',
          className
        )}
      >
        <ShieldIcon className="h-4 w-4 flex-shrink-0" />
        <span>Your information is encrypted and protected</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-verification-green/20 bg-verification-green/5 p-4',
        className
      )}
    >
      <ShieldIcon className="h-5 w-5 flex-shrink-0 text-verification-green mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-verification-green">Your Privacy Protected</p>
        <ul className="mt-2 space-y-1 text-clarus-navy/80">
          <li className="flex items-center gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-verification-green" />
            Information encrypted before storage
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-verification-green" />
            Shared only with this property
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-verification-green" />
            Never sold to third parties
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-verification-green" />
            Delete anytime in Privacy Dashboard
          </li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/privacy/dashboard"
            className="text-clarus-navy underline hover:text-clarus-navy/80"
          >
            Manage your data
          </Link>
          {onSecureInquiryClick && (
            <>
              <span className="text-slate">|</span>
              <button
                type="button"
                onClick={onSecureInquiryClick}
                className="text-clarus-navy underline hover:text-clarus-navy/80"
              >
                Need extra privacy?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

PrivacyNote.displayName = 'PrivacyNote';
