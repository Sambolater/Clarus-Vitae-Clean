'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes, useState } from 'react';

export interface ComparisonActionsProperty {
  id: string;
  slug: string;
  name: string;
}

export interface ComparisonActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Properties being compared */
  properties: ComparisonActionsProperty[];
  /** Whether PDF export is loading */
  isPdfLoading?: boolean;
  /** Callback for sharing */
  onShare?: () => void;
  /** Callback for PDF export */
  onExportPdf?: () => void;
  /** Callback for batch inquiry */
  onBatchInquiry?: () => void;
}

/**
 * Action buttons for the comparison page.
 *
 * Actions:
 * - Share comparison (copy link)
 * - Export as PDF
 * - Inquire about all (batch inquiry)
 */
export const ComparisonActions = forwardRef<HTMLDivElement, ComparisonActionsProps>(
  (
    {
      properties,
      isPdfLoading = false,
      onShare,
      onExportPdf,
      onBatchInquiry,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
      const url = window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Clarus Vitae Property Comparison',
            text: `Comparing ${properties.map(p => p.name).join(', ')}`,
            url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        onShare?.();
      } catch (error) {
        // User cancelled or error
        console.error('Share failed:', error);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-center gap-3 border-t border-stone bg-warm-gray/50 px-4 py-4 sm:justify-end',
          className
        )}
        {...props}
      >
        {/* Share button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-lg border border-stone bg-white px-4 py-2 text-sm font-medium text-clarus-navy transition-colors hover:border-clarus-navy"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4 text-verification-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Link copied</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share comparison</span>
            </>
          )}
        </button>

        {/* Export PDF button */}
        {onExportPdf && (
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isPdfLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-stone bg-white px-4 py-2 text-sm font-medium text-clarus-navy transition-colors hover:border-clarus-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPdfLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export PDF</span>
              </>
            )}
          </button>
        )}

        {/* Batch inquiry button */}
        {onBatchInquiry && properties.length > 0 && (
          <button
            type="button"
            onClick={onBatchInquiry}
            className="inline-flex items-center gap-2 rounded-lg bg-clarus-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Inquire about {properties.length > 1 ? 'all' : 'this property'}</span>
          </button>
        )}
      </div>
    );
  }
);

ComparisonActions.displayName = 'ComparisonActions';
