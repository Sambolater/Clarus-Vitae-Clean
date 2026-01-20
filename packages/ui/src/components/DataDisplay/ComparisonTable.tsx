import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface ComparisonItem {
  id: string;
  name: string;
  imageUrl?: string;
  data: Record<string, ReactNode>;
}

export interface ComparisonRow {
  key: string;
  label: string;
  highlight?: boolean;
}

export interface ComparisonTableProps extends HTMLAttributes<HTMLDivElement> {
  items: ComparisonItem[];
  rows: ComparisonRow[];
  onRemoveItem?: (id: string) => void;
  emptySlots?: number;
  onAddItem?: () => void;
}

/**
 * ComparisonTable component for side-by-side property/treatment comparison.
 */
export const ComparisonTable = forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ items, rows, onRemoveItem, emptySlots = 0, onAddItem, className, ...props }, ref) => {
    const _totalSlots = items.length + emptySlots;

    return (
      <div ref={ref} className={cn('overflow-x-auto', className)} {...props}>
        <table className="w-full min-w-[600px] border-collapse">
          {/* Header with items */}
          <thead>
            <tr className="border-b border-stone">
              <th className="w-48 p-4 text-left"></th>
              {items.map((item) => (
                <th key={item.id} className="p-4 text-center">
                  <div className="relative">
                    {onRemoveItem && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone text-slate hover:bg-clarus-navy hover:text-white transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {item.imageUrl && (
                      <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-lg bg-stone">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <p className="font-display text-lg text-clarus-navy">{item.name}</p>
                  </div>
                </th>
              ))}
              {/* Empty slots */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <th key={`empty-${i}`} className="p-4 text-center">
                  {onAddItem ? (
                    <button
                      type="button"
                      onClick={onAddItem}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-stone text-slate hover:border-clarus-navy hover:text-clarus-navy transition-colors"
                      aria-label="Add item to compare"
                    >
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  ) : (
                    <div className="mx-auto h-20 w-20 rounded-lg bg-stone/30" />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Data rows */}
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={cn(
                  'border-b border-stone/50',
                  row.highlight && 'bg-warm-gray/50'
                )}
              >
                <td className="p-4 text-sm font-medium text-clarus-navy">{row.label}</td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 text-center text-sm text-slate">
                    {item.data[row.key] || '—'}
                  </td>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <td key={`empty-${i}`} className="p-4 text-center text-slate">
                    —
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ComparisonTable.displayName = 'ComparisonTable';
