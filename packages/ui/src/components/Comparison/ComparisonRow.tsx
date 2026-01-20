'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes, type ReactNode, useMemo } from 'react';

export interface ComparisonRowProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Row label */
  label: string;
  /** Values for each property (in order) */
  values: T[];
  /** Which value to highlight */
  highlight?: 'highest' | 'lowest' | 'none';
  /** Custom renderer for values */
  renderValue?: (value: T, index: number, isHighlighted: boolean) => ReactNode;
  /** Tooltip text for the label */
  tooltip?: string;
  /** Text to show for empty/null values */
  emptyText?: string;
  /** Number of empty slots to pad */
  emptySlots?: number;
}

function getHighlightedIndexes<T>(
  values: T[],
  highlight: 'highest' | 'lowest' | 'none'
): Set<number> {
  if (highlight === 'none') return new Set();

  const numericValues = values.map((v, i) => ({
    index: i,
    value: typeof v === 'number' ? v : null,
  })).filter(item => item.value !== null);

  if (numericValues.length === 0) return new Set();

  const targetValue = highlight === 'highest'
    ? Math.max(...numericValues.map(v => v.value!))
    : Math.min(...numericValues.map(v => v.value!));

  return new Set(
    numericValues
      .filter(v => v.value === targetValue)
      .map(v => v.index)
  );
}

/**
 * Single row in the comparison table.
 * Handles highlighting best/worst values and missing data.
 */
export const ComparisonRow = forwardRef<HTMLDivElement, ComparisonRowProps>(
  <T,>(
    {
      label,
      values,
      highlight = 'none',
      renderValue,
      tooltip,
      emptyText = '—',
      emptySlots = 0,
      className,
      ...props
    }: ComparisonRowProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const highlightedIndexes = useMemo(
      () => getHighlightedIndexes(values, highlight),
      [values, highlight]
    );

    const renderCellValue = (value: T, index: number) => {
      const isHighlighted = highlightedIndexes.has(index);

      if (value === null || value === undefined) {
        return <span className="text-slate/50">{emptyText}</span>;
      }

      if (renderValue) {
        return renderValue(value, index, isHighlighted);
      }

      // Default rendering based on type
      if (typeof value === 'boolean') {
        return value ? (
          <svg className="mx-auto h-5 w-5 text-verification-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-slate/50">{emptyText}</span>
        );
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className="text-slate/50">{emptyText}</span>;
        }
        return (
          <div className="flex flex-wrap justify-center gap-1">
            {value.slice(0, 3).map((item, i) => (
              <span key={i} className="rounded bg-stone px-1.5 py-0.5 text-xs text-slate">
                {String(item)}
              </span>
            ))}
            {value.length > 3 && (
              <span className="text-xs text-slate">+{value.length - 3}</span>
            )}
          </div>
        );
      }

      return <span>{String(value)}</span>;
    };

    return (
      <div
        ref={ref}
        className={cn('flex', className)}
        {...props}
      >
        {/* Label column */}
        <div
          className={cn(
            'flex w-48 shrink-0 items-center px-4 py-3 text-sm font-medium text-clarus-navy',
            tooltip && 'cursor-help'
          )}
          title={tooltip}
        >
          {label}
          {tooltip && (
            <svg className="ml-1 h-3.5 w-3.5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Value columns */}
        <div className="flex flex-1 divide-x divide-stone/50">
          {values.map((value, index) => {
            const isHighlighted = highlightedIndexes.has(index);
            return (
              <div
                key={index}
                className={cn(
                  'flex flex-1 items-center justify-center px-4 py-3 text-center text-sm',
                  isHighlighted
                    ? 'bg-verification-green/10 font-medium text-verification-green'
                    : 'text-slate'
                )}
              >
                {renderCellValue(value, index)}
              </div>
            );
          })}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-1 items-center justify-center px-4 py-3 text-center text-sm text-slate/50"
            >
              {emptyText}
            </div>
          ))}
        </div>
      </div>
    );
  }
) as <T>(props: ComparisonRowProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;

(ComparisonRow as any).displayName = 'ComparisonRow';
