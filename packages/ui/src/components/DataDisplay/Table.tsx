import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes, forwardRef } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

/**
 * Table component for displaying tabular data.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ striped = false, className, children, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse text-left text-sm',
            striped && '[&_tbody_tr:nth-child(even)]:bg-warm-gray',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('border-b border-stone bg-warm-gray/50', className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn('[&_tr]:border-b [&_tr]:border-stone/50', className)} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ isSelected, className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors hover:bg-warm-gray/50',
          isSelected && 'bg-clarus-navy/5',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable, sortDirection, onSort, className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate',
          sortable && 'cursor-pointer select-none hover:text-clarus-navy',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortable && (
            <span className="inline-flex flex-col">
              <svg
                className={cn('h-2 w-2', sortDirection === 'asc' ? 'text-clarus-navy' : 'text-slate/40')}
                fill="currentColor"
                viewBox="0 0 8 4"
              >
                <path d="M4 0L8 4H0L4 0Z" />
              </svg>
              <svg
                className={cn('h-2 w-2', sortDirection === 'desc' ? 'text-clarus-navy' : 'text-slate/40')}
                fill="currentColor"
                viewBox="0 0 8 4"
              >
                <path d="M4 4L0 0H8L4 4Z" />
              </svg>
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td ref={ref} className={cn('px-4 py-3 text-clarus-navy', className)} {...props}>
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';
