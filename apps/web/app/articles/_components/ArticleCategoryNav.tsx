'use client';

import type { ArticleCategory } from '@clarus-vitae/database/sanity';
import Link from 'next/link';
import React from 'react';

interface ArticleCategoryNavProps {
  currentCategory?: ArticleCategory;
}

const categories: Array<{ value: ArticleCategory | null; label: string }> = [
  { value: null, label: 'All' },
  { value: 'longevity', label: 'Longevity' },
  { value: 'wellness-trends', label: 'Wellness Trends' },
  { value: 'destination-guide', label: 'Destinations' },
  { value: 'treatment-deep-dive', label: 'Treatments' },
  { value: 'expert-interview', label: 'Interviews' },
  { value: 'industry-news', label: 'News' },
];

export function ArticleCategoryNav({ currentCategory }: ArticleCategoryNavProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto py-4 scrollbar-hide" aria-label="Article categories">
      {categories.map(({ value, label }) => {
        const isActive = currentCategory === value || (!currentCategory && !value);
        const href = value ? `/articles?category=${value}` : '/articles';

        return (
          <Link
            key={label}
            href={href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-clarus-navy text-white'
                : 'bg-gray-100 text-slate hover:bg-gray-200 hover:text-clarus-navy'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
