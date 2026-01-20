import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabNavProps extends HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

const variantStyles = {
  default: {
    container: 'border-b border-stone',
    tab: 'border-b-2 -mb-px',
    active: 'border-clarus-navy text-clarus-navy',
    inactive: 'border-transparent text-slate hover:text-clarus-navy hover:border-slate',
  },
  pills: {
    container: 'bg-stone rounded-lg p-1',
    tab: 'rounded-md',
    active: 'bg-white text-clarus-navy shadow-sm',
    inactive: 'text-slate hover:text-clarus-navy',
  },
  underline: {
    container: '',
    tab: '',
    active: 'text-clarus-navy underline underline-offset-4 decoration-2',
    inactive: 'text-slate hover:text-clarus-navy',
  },
};

/**
 * TabNav component for tab-based navigation.
 *
 * Variants:
 * - default: Bottom border with active indicator
 * - pills: Pill-shaped tabs with background
 * - underline: Simple underline indicator
 */
export const TabNav = forwardRef<HTMLDivElement, TabNavProps>(
  ({ tabs, activeTab, onTabChange, variant = 'default', className, ...props }, ref) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn('flex', styles.container, className)}
        role="tablist"
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              styles.tab,
              activeTab === tab.id ? styles.active : styles.inactive,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1 rounded-full bg-stone px-2 py-0.5 text-xs font-medium text-slate">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }
);

TabNav.displayName = 'TabNav';
