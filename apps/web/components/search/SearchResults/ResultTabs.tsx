/**
 * ResultTabs Component
 *
 * Tab navigation for search result types.
 * Shows count for each category.
 */

'use client';

import { cn } from '@clarus-vitae/utils';
import type { SearchType } from '../hooks/useSearchParams';

interface ResultTabsProps {
  activeTab: SearchType;
  onChange: (tab: SearchType) => void;
  counts: {
    all: number;
    properties: number;
    treatments: number;
    articles: number;
  };
}

const tabs: { id: SearchType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'properties', label: 'Properties' },
  { id: 'treatments', label: 'Treatments' },
  { id: 'articles', label: 'Articles' },
];

export function ResultTabs({ activeTab, onChange, counts }: ResultTabsProps) {
  return (
    <div className="border-b border-stone">
      <nav className="-mb-px flex gap-4" aria-label="Search result tabs">
        {tabs.map((tab) => {
          const count = counts[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-clarus-navy text-clarus-navy'
                  : 'border-transparent text-slate hover:border-slate/30 hover:text-clarus-navy'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  isActive
                    ? 'bg-clarus-navy text-white'
                    : 'bg-stone text-slate'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
