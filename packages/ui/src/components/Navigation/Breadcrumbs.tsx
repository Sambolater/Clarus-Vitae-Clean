import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

/**
 * Breadcrumbs component for showing page hierarchy.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, separator, className, ...props }, ref) => {
    const defaultSeparator = (
      <svg className="h-4 w-4 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('flex items-center', className)} {...props}>
        <ol className="flex items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-1.5 text-sm text-slate hover:text-clarus-navy transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      'flex items-center gap-1.5 text-sm',
                      isLast ? 'font-medium text-clarus-navy' : 'text-slate'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span className="text-slate" aria-hidden="true">
                    {separator || defaultSeparator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
