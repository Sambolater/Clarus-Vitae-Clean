'use client';

import React from 'react';
import Link from 'next/link';
import { ClarusIndexBadge, TierBadge } from '@clarus-vitae/ui';
import type { PropertyTier } from '@clarus-vitae/types';

interface PropertyData {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string | null;
  tier: number;
  heroImageUrl: string | null;
  propertyScore: {
    overallScore: number;
  } | null;
}

interface RelatedPropertiesProps {
  properties: PropertyData[];
}

const tierMap: Record<number, PropertyTier> = {
  1: 'TIER_1',
  2: 'TIER_2',
  3: 'TIER_3',
};

export function RelatedProperties({ properties }: RelatedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-2xl font-medium text-clarus-navy">
        Featured Properties
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <article
            key={property.id}
            className="group overflow-hidden rounded-lg border border-stone bg-white transition-shadow hover:shadow-md"
          >
            <Link href={`/properties/${property.slug}`}>
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                {property.heroImageUrl ? (
                  <img
                    src={property.heroImageUrl}
                    alt={property.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                    No Image
                  </div>
                )}
                {/* Score Badge */}
                {property.propertyScore && (
                  <div className="absolute right-3 top-3">
                    <ClarusIndexBadge
                      score={property.propertyScore.overallScore}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <TierBadge tier={tierMap[property.tier] || 'TIER_2'} size="sm" />
                </div>
                <h3 className="font-serif text-lg font-medium text-clarus-navy group-hover:text-clarus-gold">
                  {property.name}
                </h3>
                <p className="mt-1 text-sm text-slate">
                  {property.city ? `${property.city}, ` : ''}
                  {property.country}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {properties.length > 3 && (
        <div className="mt-6 text-center">
          <Link
            href="/properties"
            className="inline-block rounded bg-clarus-navy px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
          >
            View All Properties
          </Link>
        </div>
      )}
    </div>
  );
}
