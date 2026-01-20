import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode, useState } from 'react';

export interface FilterSection {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface FilterSidebarProps extends HTMLAttributes<HTMLElement> {
  sections: FilterSection[];
  title?: string;
  onClearAll?: () => void;
  activeFiltersCount?: number;
}

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-medium text-clarus-navy"
        aria-expanded={isOpen}
      >
        {title}
        <svg
          className={cn('h-4 w-4 text-slate transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

/**
 * FilterSidebar component for filter panels.
 *
 * Features:
 * - Collapsible filter sections
 * - Clear all button with active filter count
 * - Mobile-friendly design
 */
export const FilterSidebar = forwardRef<HTMLElement, FilterSidebarProps>(
  ({ sections, title = 'Filters', onClearAll, activeFiltersCount, className, ...props }, ref) => {
    return (
      <aside ref={ref} className={cn('w-full', className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone pb-4">
          <h2 className="font-display text-lg text-clarus-navy">{title}</h2>
          {onClearAll && activeFiltersCount !== undefined && activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm text-slate hover:text-clarus-navy transition-colors"
            >
              Clear all ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Filter Sections */}
        <div>
          {sections.map((section) => (
            <CollapsibleSection
              key={section.id}
              title={section.title}
              defaultOpen={section.defaultOpen}
            >
              {section.children}
            </CollapsibleSection>
          ))}
        </div>
      </aside>
    );
  }
);

FilterSidebar.displayName = 'FilterSidebar';
