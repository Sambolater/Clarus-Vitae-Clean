'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';

export interface ComparisonBarItem {
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  imageUrl?: string;
}

export interface ComparisonBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Items currently in comparison */
  items: ComparisonBarItem[];
  /** Maximum number of items allowed */
  maxItems?: number;
  /** Callback when removing an item */
  onRemoveItem: (propertyId: string) => void;
  /** Callback when clearing all items */
  onClearAll: () => void;
  /** Custom compare URL (defaults to /compare?properties=...) */
  compareUrl?: string;
}

/**
 * Floating bar that appears when items are in the comparison list.
 * Shows at the bottom of the screen on all pages.
 *
 * Features:
 * - Property thumbnails with remove buttons
 * - Empty slots showing "Add property"
 * - "Compare Now" CTA (enabled with 2+ items)
 * - Item count indicator
 * - Clear all option
 */
export const ComparisonBar = forwardRef<HTMLDivElement, ComparisonBarProps>(
  (
    {
      items,
      maxItems = 4,
      onRemoveItem,
      onClearAll,
      compareUrl,
      className,
      ...props
    },
    ref
  ) => {
    // Don't render if no items
    if (items.length === 0) {
      return null;
    }

    const emptySlots = maxItems - items.length;
    const canCompare = items.length >= 2;
    const defaultCompareUrl = `/compare?properties=${items.map(i => i.propertySlug).join(',')}`;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 border-t border-stone bg-white shadow-lg',
          'animate-in slide-in-from-bottom-full duration-300',
          className
        )}
        role="region"
        aria-label="Property comparison"
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Property thumbnails */}
            <div className="flex items-center gap-3">
              {/* Label */}
              <span className="hidden text-sm font-medium text-clarus-navy sm:block">
                Compare
                <span className="ml-1 text-slate">({items.length}/{maxItems})</span>
              </span>

              {/* Items */}
              <div className="flex items-center gap-2">
                {items.map((item) => (
                  <div
                    key={item.propertyId}
                    className="group relative"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-stone bg-stone sm:h-14 sm:w-14">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.propertyName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-slate">
                          {item.propertyName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.propertyId)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate text-white opacity-0 transition-opacity hover:bg-clarus-navy group-hover:opacity-100"
                      aria-label={`Remove ${item.propertyName} from comparison`}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {/* Property name tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-clarus-navy px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {item.propertyName}
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-stone text-slate sm:h-14 sm:w-14"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Clear all */}
              <button
                type="button"
                onClick={onClearAll}
                className="hidden text-sm text-slate underline hover:text-clarus-navy sm:block"
              >
                Clear all
              </button>

              {/* Compare button */}
              {canCompare ? (
                <Link
                  href={compareUrl || defaultCompareUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-clarus-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
                >
                  <span>Compare Now</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <span className="text-sm text-slate">
                  Add {2 - items.length} more to compare
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ComparisonBar.displayName = 'ComparisonBar';
