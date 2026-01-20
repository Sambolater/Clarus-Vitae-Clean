import { cn } from '@clarus-vitae/utils';
import { forwardRef } from 'react';

import { type EvidenceLevelType } from '../Badge/EvidenceLevel';

export interface TreatmentCardProps {
  name: string;
  category: string;
  evidenceLevel: EvidenceLevelType;
  description: string;
  propertiesCount?: number;
  priceRange?: string;
  imageUrl?: string;
  href?: string;
  className?: string;
}

const evidenceConfig: Record<EvidenceLevelType, { label: string; color: string; bgColor: string }> = {
  STRONG: { label: 'Strong Evidence', color: 'text-verification-green', bgColor: 'bg-verification-green/10' },
  MODERATE: { label: 'Moderate Evidence', color: 'text-clarus-navy', bgColor: 'bg-clarus-navy/10' },
  EMERGING: { label: 'Emerging Evidence', color: 'text-clarus-gold', bgColor: 'bg-clarus-gold/10' },
  EXPERIMENTAL: { label: 'Experimental', color: 'text-slate', bgColor: 'bg-slate/10' },
  TRADITIONAL: { label: 'Traditional Practice', color: 'text-tier-3', bgColor: 'bg-tier-3/10' },
};

/**
 * TreatmentCard component for displaying treatment/modality listings.
 *
 * Features:
 * - Treatment name and category
 * - Evidence level indicator
 * - Brief description
 * - Number of properties offering this treatment
 * - Price range indicator
 */
export const TreatmentCard = forwardRef<HTMLDivElement, TreatmentCardProps>(
  (
    {
      name,
      category,
      evidenceLevel,
      description,
      propertiesCount,
      priceRange,
      imageUrl,
      href,
      className,
    },
    ref
  ) => {
    const evidence = evidenceConfig[evidenceLevel];

    const cardContent = (
      <>
        {imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden bg-stone">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-4">
          {/* Category */}
          <span className="text-xs font-medium uppercase tracking-wide text-slate">
            {category}
          </span>

          {/* Name */}
          <h3 className="mt-1 font-display text-lg text-clarus-navy">{name}</h3>

          {/* Evidence Level */}
          <span
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
              evidence.bgColor,
              evidence.color
            )}
          >
            {evidence.label}
          </span>

          {/* Description */}
          <p className="mt-3 line-clamp-2 text-sm text-slate">{description}</p>

          {/* Footer Info */}
          <div className="mt-4 flex items-center justify-between border-t border-stone pt-3">
            {propertiesCount !== undefined && (
              <span className="text-xs text-slate">
                <span className="font-medium text-clarus-navy">{propertiesCount}</span>{' '}
                {propertiesCount === 1 ? 'property' : 'properties'}
              </span>
            )}
            {priceRange && (
              <span className="text-xs font-medium text-clarus-navy">{priceRange}</span>
            )}
          </div>
        </div>
      </>
    );

    const cardClassName = cn(
      'group block overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover',
      className
    );

    if (href) {
      return (
        <a href={href} className={cardClassName}>
          {cardContent}
        </a>
      );
    }

    return (
      <div ref={ref} className={cardClassName}>
        {cardContent}
      </div>
    );
  }
);

TreatmentCard.displayName = 'TreatmentCard';
