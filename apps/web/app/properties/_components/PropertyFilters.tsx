'use client';

import { type PropertyTier, type FocusArea, type WellnessApproach } from '@clarus-vitae/database/types';
import {
  FilterSidebar,
  Checkbox,
  Select,
  RangeSlider,
} from '@clarus-vitae/ui';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import {
  tierLabels,
  focusAreaLabels,
  approachLabels,
  popularCountries,
} from '@/lib/properties';

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current filter state from URL
  const currentFilters = useMemo(() => {
    const tierParam = searchParams.get('tier');
    const approachParam = searchParams.get('approach');
    const focusParam = searchParams.get('focusAreas');

    return {
      tiers: tierParam ? (tierParam.split(',') as PropertyTier[]) : [],
      country: searchParams.get('country') || '',
      approaches: approachParam ? (approachParam.split(',') as WellnessApproach[]) : [],
      focusAreas: focusParam ? (focusParam.split(',') as FocusArea[]) : [],
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : 0,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : 200000,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!, 10) : 0,
      verifiedOnly: searchParams.get('verified') === 'true',
      editorChoiceOnly: searchParams.get('editorChoice') === 'true',
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
          // Only set price/score if not at default values
          if (key === 'priceMin' && value === 0) {
            params.delete(key);
          } else if (key === 'priceMax' && value === 200000) {
            params.delete(key);
          } else if (key === 'minScore' && value === 0) {
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

  // Toggle tier selection
  const toggleTier = (tier: PropertyTier) => {
    const newTiers = currentFilters.tiers.includes(tier)
      ? currentFilters.tiers.filter((t) => t !== tier)
      : [...currentFilters.tiers, tier];
    updateFilters({ tier: newTiers });
  };

  // Toggle approach selection
  const toggleApproach = (approach: WellnessApproach) => {
    const newApproaches = currentFilters.approaches.includes(approach)
      ? currentFilters.approaches.filter((a) => a !== approach)
      : [...currentFilters.approaches, approach];
    updateFilters({ approach: newApproaches });
  };

  // Toggle focus area selection
  const toggleFocusArea = (area: FocusArea) => {
    const newAreas = currentFilters.focusAreas.includes(area)
      ? currentFilters.focusAreas.filter((a) => a !== area)
      : [...currentFilters.focusAreas, area];
    updateFilters({ focusAreas: newAreas });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentFilters.tiers.length > 0) count++;
    if (currentFilters.country) count++;
    if (currentFilters.approaches.length > 0) count++;
    if (currentFilters.focusAreas.length > 0) count++;
    if (currentFilters.priceMin > 0 || currentFilters.priceMax < 200000) count++;
    if (currentFilters.minScore > 0) count++;
    if (currentFilters.verifiedOnly) count++;
    if (currentFilters.editorChoiceOnly) count++;
    return count;
  }, [currentFilters]);

  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const filterSections = [
    {
      id: 'tier',
      title: 'Property Tier',
      defaultOpen: true,
      children: (
        <div className="space-y-2">
          {(Object.keys(tierLabels) as PropertyTier[]).map((tier) => (
            <Checkbox
              key={tier}
              id={`tier-${tier}`}
              label={tierLabels[tier] ?? tier}
              checked={currentFilters.tiers.includes(tier)}
              onChange={() => toggleTier(tier)}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'country',
      title: 'Destination',
      defaultOpen: true,
      children: (
        <Select
          value={currentFilters.country}
          onChange={(e) => updateFilters({ country: e.target.value || null })}
          options={[
            { value: '', label: 'All Countries' },
            ...popularCountries.map((country) => ({
              value: country,
              label: country,
            })),
          ]}
        />
      ),
    },
    {
      id: 'approach',
      title: 'Wellness Approach',
      defaultOpen: false,
      children: (
        <div className="space-y-2">
          {(Object.keys(approachLabels) as WellnessApproach[]).map((approach) => (
            <Checkbox
              key={approach}
              id={`approach-${approach}`}
              label={approachLabels[approach] ?? approach}
              checked={currentFilters.approaches.includes(approach)}
              onChange={() => toggleApproach(approach)}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'focusAreas',
      title: 'Focus Areas',
      defaultOpen: false,
      children: (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
          {(Object.keys(focusAreaLabels) as FocusArea[]).map((area) => (
            <Checkbox
              key={area}
              id={`focus-${area}`}
              label={focusAreaLabels[area] ?? area}
              checked={currentFilters.focusAreas.includes(area)}
              onChange={() => toggleFocusArea(area)}
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
            max={200000}
            step={5000}
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
    {
      id: 'score',
      title: 'Minimum Score',
      defaultOpen: false,
      children: (
        <div className="space-y-4">
          <RangeSlider
            min={0}
            max={100}
            step={10}
            value={[currentFilters.minScore, 100]}
            onChange={([min]) => {
              updateFilters({ minScore: min });
            }}
          />
          <div className="flex justify-between text-xs text-slate">
            <span>{currentFilters.minScore}+</span>
            <span>100</span>
          </div>
        </div>
      ),
    },
    {
      id: 'badges',
      title: 'Recognition',
      defaultOpen: false,
      children: (
        <div className="space-y-2">
          <Checkbox
            id="verified-excellence"
            label="Verified Excellence"
            checked={currentFilters.verifiedOnly}
            onChange={() => updateFilters({ verified: !currentFilters.verifiedOnly })}
          />
          <Checkbox
            id="editor-choice"
            label="Editor's Choice"
            checked={currentFilters.editorChoiceOnly}
            onChange={() => updateFilters({ editorChoice: !currentFilters.editorChoiceOnly })}
          />
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
