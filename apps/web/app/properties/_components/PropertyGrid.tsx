'use client';

import { PropertyCard, EmptyState, SkeletonCard } from '@clarus-vitae/ui';
import { useComparison } from '@clarus-vitae/utils';
import Link from 'next/link';

import { type PropertyListItem, formatPriceRange, focusAreaLabels } from '@/lib/properties';

interface PropertyGridProps {
  properties: PropertyListItem[];
  isLoading?: boolean;
}

export function PropertyGrid({ properties, isLoading = false }: PropertyGridProps) {
  const { addToComparison, removeFromComparison, isInComparison, isFull } = useComparison();

  const handleCompare = (property: PropertyListItem) => {
    if (isInComparison(property.id)) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property.id, property.slug, property.name);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        description="Try adjusting your filters to see more results."
        icon={
          <svg
            className="h-12 w-12 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => {
        const inComparison = isInComparison(property.id);
        return (
          <PropertyCard
            key={property.id}
            name={property.name}
            location={property.location.city}
            country={property.location.country}
            tier={property.tier}
            score={property.score ?? 0}
            imageUrl={property.featuredImage?.url}
            priceRange={formatPriceRange(
              property.pricing.min,
              property.pricing.max,
              property.pricing.currency
            )}
            focusAreas={property.focusAreas.slice(0, 3).map((area) => focusAreaLabels[area] ?? area).filter(Boolean) as string[]}
            href={`/properties/${property.slug}`}
            onCompare={() => handleCompare(property)}
            isInComparison={inComparison}
          />
        );
      })}
    </div>
  );
}
