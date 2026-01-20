'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes, useState, useMemo } from 'react';

export interface TreatmentInfo {
  id: string;
  name: string;
  isSignature?: boolean;
}

export interface PropertyTreatments {
  propertyId: string;
  propertyName: string;
  treatments: TreatmentInfo[];
}

export interface TreatmentComparisonMatrixProps extends HTMLAttributes<HTMLDivElement> {
  /** Properties with their treatments */
  properties: PropertyTreatments[];
  /** Maximum number of treatments to show initially */
  initialLimit?: number;
  /** Number of empty slots to display */
  emptySlots?: number;
}

/**
 * Matrix showing treatment availability across properties.
 *
 * Shows:
 * - Checkmark for available treatments
 * - Star for signature treatments
 * - Dash for unavailable
 */
export const TreatmentComparisonMatrix = forwardRef<HTMLDivElement, TreatmentComparisonMatrixProps>(
  (
    {
      properties,
      initialLimit = 15,
      emptySlots = 0,
      className,
      ...props
    },
    ref
  ) => {
    const [showAll, setShowAll] = useState(false);

    // Get union of all treatments, sorted by signature status and name
    const allTreatments = useMemo(() => {
      const treatmentMap = new Map<string, { id: string; name: string; isSignature: boolean }>();

      properties.forEach(property => {
        property.treatments.forEach(treatment => {
          const existing = treatmentMap.get(treatment.id);
          if (!existing) {
            treatmentMap.set(treatment.id, {
              id: treatment.id,
              name: treatment.name,
              isSignature: treatment.isSignature || false,
            });
          } else if (treatment.isSignature) {
            // If any property marks it as signature, consider it signature
            treatmentMap.set(treatment.id, { ...existing, isSignature: true });
          }
        });
      });

      // Sort: signature first, then alphabetically
      return Array.from(treatmentMap.values()).sort((a, b) => {
        if (a.isSignature && !b.isSignature) return -1;
        if (!a.isSignature && b.isSignature) return 1;
        return a.name.localeCompare(b.name);
      });
    }, [properties]);

    // Check if a property has a treatment
    const hasTreatment = (propertyId: string, treatmentId: string): { available: boolean; isSignature: boolean } => {
      const property = properties.find(p => p.propertyId === propertyId);
      if (!property) return { available: false, isSignature: false };

      const treatment = property.treatments.find(t => t.id === treatmentId);
      return {
        available: !!treatment,
        isSignature: treatment?.isSignature || false,
      };
    };

    const displayedTreatments = showAll ? allTreatments : allTreatments.slice(0, initialLimit);
    const hasMore = allTreatments.length > initialLimit;

    if (allTreatments.length === 0) {
      return (
        <div ref={ref} className={cn('px-4 py-8 text-center text-sm text-slate', className)} {...props}>
          No treatment data available for comparison.
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {/* Treatment rows */}
        <div className="divide-y divide-stone/50">
          {displayedTreatments.map((treatment) => (
            <div key={treatment.id} className="flex">
              {/* Treatment name */}
              <div className="flex w-48 shrink-0 items-center gap-2 px-4 py-2.5">
                <span className="text-sm text-clarus-navy">{treatment.name}</span>
                {treatment.isSignature && (
                  <span className="shrink-0 text-clarus-gold" title="Signature treatment">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Availability columns */}
              <div className="flex flex-1 divide-x divide-stone/50">
                {properties.map((property) => {
                  const status = hasTreatment(property.propertyId, treatment.id);
                  return (
                    <div
                      key={property.propertyId}
                      className="flex flex-1 items-center justify-center px-4 py-2.5"
                    >
                      {status.available ? (
                        status.isSignature ? (
                          <span className="flex items-center gap-1 text-clarus-gold" title="Signature treatment at this property">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </span>
                        ) : (
                          <svg className="h-5 w-5 text-verification-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )
                      ) : (
                        <span className="text-slate/50">—</span>
                      )}
                    </div>
                  );
                })}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex flex-1 items-center justify-center px-4 py-2.5 text-slate/50"
                  >
                    —
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Show more/less button */}
        {hasMore && (
          <div className="border-t border-stone/50 px-4 py-3">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-clarus-navy underline hover:no-underline"
            >
              {showAll ? `Show fewer treatments` : `Show all ${allTreatments.length} treatments`}
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 border-t border-stone/50 bg-warm-gray/30 px-4 py-2 text-xs text-slate">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-verification-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-clarus-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Signature treatment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate/50">—</span>
            <span>Not available</span>
          </div>
        </div>
      </div>
    );
  }
);

TreatmentComparisonMatrix.displayName = 'TreatmentComparisonMatrix';
