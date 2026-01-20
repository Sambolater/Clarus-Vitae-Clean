'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';

export interface ComparisonSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section title */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Section children */
  children: ReactNode;
}

/**
 * Section wrapper for comparison table.
 * Provides consistent styling and optional collapse functionality.
 */
export const ComparisonSection = forwardRef<HTMLElement, ComparisonSectionProps>(
  (
    {
      title,
      subtitle,
      collapsible = false,
      defaultCollapsed = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    return (
      <section
        ref={ref}
        className={cn('border-b border-stone last:border-b-0', className)}
        {...props}
      >
        {/* Section Header */}
        <div
          className={cn(
            'flex items-center justify-between bg-warm-gray/50 px-4 py-3 sm:px-6',
            collapsible && 'cursor-pointer hover:bg-warm-gray'
          )}
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
          role={collapsible ? 'button' : undefined}
          aria-expanded={collapsible ? !isCollapsed : undefined}
        >
          <div>
            <h3 className="font-display text-lg font-medium text-clarus-navy">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-slate">{subtitle}</p>}
          </div>
          {collapsible && (
            <svg
              className={cn(
                'h-5 w-5 text-slate transition-transform',
                !isCollapsed && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {/* Section Content */}
        {!isCollapsed && (
          <div className="divide-y divide-stone/50">
            {children}
          </div>
        )}
      </section>
    );
  }
);

ComparisonSection.displayName = 'ComparisonSection';
