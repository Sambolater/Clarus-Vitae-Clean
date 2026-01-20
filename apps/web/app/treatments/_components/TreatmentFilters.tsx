'use client';

import { type TreatmentCategory, type EvidenceLevel } from '@clarus-vitae/database';
import {
  FilterSidebar,
  Checkbox,
  RangeSlider,
} from '@clarus-vitae/ui';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import {
  treatmentCategoryLabels,
  evidenceLevelLabels,
} from '@/lib/treatments';

export function TreatmentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current filter state from URL
  const currentFilters = useMemo(() => {
    const categoryParam = searchParams.get('category');
    const evidenceParam = searchParams.get('evidenceLevel');

    return {
      categories: categoryParam ? (categoryParam.split(',') as TreatmentCategory[]) : [],
      evidenceLevels: evidenceParam ? (evidenceParam.split(',') as EvidenceLevel[]) : [],
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : 0,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : 50000,
    };
  }, [searchParams]);

  // Update URL with new filter params
  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | number | boolean | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when filters change
      params.delete('page');

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else if (typeof value === 'boolean') {
          if (value) {
            params.set(key, 'true');
          } else {
            params.delete(key);
          }
        } else if (typeof value === 'number') {
          // Only set price if not at default values
          if (key === 'priceMin' && value === 0) {
            params.delete(key);
          } else if (key === 'priceMax' && value === 50000) {
            params.delete(key);
          } else {
            params.set(key, value.toString());
          }
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Toggle category selection
  const toggleCategory = (category: TreatmentCategory) => {
    const newCategories = currentFilters.categories.includes(category)
      ? currentFilters.categories.filter((c) => c !== category)
      : [...currentFilters.categories, category];
    updateFilters({ category: newCategories });
  };

  // Toggle evidence level selection
  const toggleEvidenceLevel = (level: EvidenceLevel) => {
    const newLevels = currentFilters.evidenceLevels.includes(level)
      ? currentFilters.evidenceLevels.filter((l) => l !== level)
      : [...currentFilters.evidenceLevels, level];
    updateFilters({ evidenceLevel: newLevels });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentFilters.categories.length > 0) count++;
    if (currentFilters.evidenceLevels.length > 0) count++;
    if (currentFilters.priceMin > 0 || currentFilters.priceMax < 50000) count++;
    return count;
  }, [currentFilters]);

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const filterSections = [
    {
      id: 'category',
      title: 'Treatment Category',
      defaultOpen: true,
      children: (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
          {(Object.keys(treatmentCategoryLabels) as TreatmentCategory[]).map((category) => (
            <Checkbox
              key={category}
              id={`category-${category}`}
              label={treatmentCategoryLabels[category]}
              checked={currentFilters.categories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'evidence',
      title: 'Evidence Level',
      defaultOpen: true,
      children: (
        <div className="space-y-2">
          {(Object.keys(evidenceLevelLabels) as EvidenceLevel[]).map((level) => (
            <Checkbox
              key={level}
              id={`evidence-${level}`}
              label={evidenceLevelLabels[level]}
              checked={currentFilters.evidenceLevels.includes(level)}
              onChange={() => toggleEvidenceLevel(level)}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'price',
      title: 'Price Range',
      defaultOpen: false,
      children: (
        <div className="space-y-4">
          <RangeSlider
            min={0}
            max={50000}
            step={1000}
            value={[currentFilters.priceMin, currentFilters.priceMax]}
            onChange={([min, max]) => {
              updateFilters({ priceMin: min, priceMax: max });
            }}
          />
          <div className="flex justify-between text-xs text-slate">
            <span>${currentFilters.priceMin.toLocaleString()}</span>
            <span>${currentFilters.priceMax.toLocaleString()}+</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <FilterSidebar
      title="Filters"
      sections={filterSections}
      activeFiltersCount={activeFiltersCount}
      onClearAll={clearAllFilters}
    />
  );
}
