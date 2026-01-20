'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes, useState, type ReactNode } from 'react';
import Link from 'next/link';

export interface MobileComparisonProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  score: number | null;
  imageUrl?: string;
}

export interface MobileComparisonSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface MobileComparisonViewProps extends HTMLAttributes<HTMLDivElement> {
  /** Properties being compared */
  properties: MobileComparisonProperty[];
  /** Sections to display for each property */
  getSections: (property: MobileComparisonProperty) => MobileComparisonSection[];
  /** Callback when removing a property */
  onRemoveProperty?: (propertyId: string) => void;
}

const tierLabels: Record<string, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

const tierColors: Record<string, string> = {
  TIER_1: 'bg-tier-1',
  TIER_2: 'bg-tier-2',
  TIER_3: 'bg-tier-3',
};

function getScoreTierColor(score: number | null): string {
  if (!score) return 'text-slate';
  if (score >= 90) return 'text-clarus-gold';
  return 'text-white';
}

/**
 * Mobile-optimized comparison view using swipeable cards/tabs.
 * Shows one property at a time with tab navigation.
 */
export const MobileComparisonView = forwardRef<HTMLDivElement, MobileComparisonViewProps>(
  (
    {
      properties,
      getSections,
      onRemoveProperty,
      className,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

    if (properties.length === 0) {
      return (
        <div
          ref={ref}
          className={cn('px-4 py-12 text-center', className)}
          {...props}
        >
          <p className="text-slate">No properties to compare.</p>
          <Link href="/properties" className="mt-4 inline-block text-clarus-navy underline">
            Browse properties
          </Link>
        </div>
      );
    }

    // Ensure activeIndex is within bounds
    const safeActiveIndex = Math.min(activeIndex, properties.length - 1);
    const activeProperty = properties[safeActiveIndex]!;
    const sections = getSections(activeProperty);

    const toggleSection = (sectionId: string) => {
      setExpandedSections(prev => {
        const next = new Set(prev);
        if (next.has(sectionId)) {
          next.delete(sectionId);
        } else {
          next.add(sectionId);
        }
        return next;
      });
    };

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {/* Tab navigation */}
        <div className="sticky top-0 z-10 flex overflow-x-auto border-b border-stone bg-white">
          {properties.map((property, index) => (
            <button
              key={property.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center px-3 py-3 text-center transition-colors',
                index === activeIndex
                  ? 'border-b-2 border-clarus-navy bg-warm-gray/50 text-clarus-navy'
                  : 'text-slate hover:bg-warm-gray/30'
              )}
            >
              <span className="truncate text-xs font-medium">{property.name}</span>
              {property.score && (
                <span className="mt-0.5 text-[10px] text-slate">Score: {property.score}</span>
              )}
            </button>
          ))}
        </div>

        {/* Active property card */}
        <div className="p-4">
          {/* Property header */}
          <div className="relative overflow-hidden rounded-lg bg-white shadow-card">
            {/* Image */}
            <div className="relative h-40 bg-stone">
              {activeProperty.imageUrl ? (
                <img
                  src={activeProperty.imageUrl}
                  alt={activeProperty.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate">
                  No image
                </div>
              )}
              {/* Tier badge */}
              <span
                className={cn(
                  'absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white',
                  tierColors[activeProperty.tier]
                )}
              >
                {tierLabels[activeProperty.tier]}
              </span>
              {/* Score badge */}
              {activeProperty.score && (
                <div className="absolute bottom-3 right-3 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-clarus-navy">
                  <span className={cn('font-display text-lg', getScoreTierColor(activeProperty.score))}>
                    {activeProperty.score}
                  </span>
                  <span className="text-[8px] uppercase tracking-wide text-white/70">Index</span>
                </div>
              )}
              {/* Remove button */}
              {onRemoveProperty && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveProperty(activeProperty.id);
                    if (activeIndex >= properties.length - 1 && activeIndex > 0) {
                      setActiveIndex(activeIndex - 1);
                    }
                  }}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate hover:bg-white hover:text-clarus-navy"
                  aria-label={`Remove ${activeProperty.name} from comparison`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Property info */}
            <div className="p-4">
              <h2 className="font-display text-xl font-medium text-clarus-navy">
                {activeProperty.name}
              </h2>
              <p className="mt-1 text-sm text-slate">
                {activeProperty.city}, {activeProperty.country}
              </p>
              <Link
                href={`/properties/${activeProperty.slug}`}
                className="mt-2 inline-block text-sm text-clarus-navy underline hover:no-underline"
              >
                View full profile
              </Link>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="mt-4 divide-y divide-stone overflow-hidden rounded-lg border border-stone bg-white">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <div key={section.id}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-medium text-clarus-navy">{section.title}</span>
                    <svg
                      className={cn(
                        'h-5 w-5 text-slate transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-stone/50 bg-warm-gray/30 px-4 py-3">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe indicator */}
        {properties.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {properties.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  index === activeIndex ? 'bg-clarus-navy' : 'bg-stone'
                )}
                aria-label={`Go to property ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

MobileComparisonView.displayName = 'MobileComparisonView';
