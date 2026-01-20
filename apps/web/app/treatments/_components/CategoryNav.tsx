'use client';

import { type TreatmentCategory } from '@clarus-vitae/database';
import { cn } from '@clarus-vitae/utils';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { treatmentCategoryLabels } from '@/lib/treatments';

interface CategoryNavProps {
  selectedCategory?: TreatmentCategory;
}

export function CategoryNav({ selectedCategory }: CategoryNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = useCallback(
    (category: TreatmentCategory | null) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset page when changing category
      params.delete('page');

      if (category === null) {
        params.delete('category');
      } else {
        params.set('category', category);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const categories = Object.keys(treatmentCategoryLabels) as TreatmentCategory[];

  return (
    <div className="mb-8">
      <nav className="relative">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              !selectedCategory
                ? 'bg-clarus-navy text-white'
                : 'bg-stone text-clarus-navy hover:bg-stone/80'
            )}
          >
            All Treatments
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                'flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-clarus-navy text-white'
                  : 'bg-stone text-clarus-navy hover:bg-stone/80'
              )}
            >
              {treatmentCategoryLabels[category]}
            </button>
          ))}
        </div>
        {/* Fade edges to indicate scrollability */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </nav>
    </div>
  );
}
