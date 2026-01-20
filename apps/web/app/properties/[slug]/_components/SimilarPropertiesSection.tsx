'use client';

import { type PropertyTier } from '@clarus-vitae/database';
import { ClarusIndexBadge, TierBadge } from '@clarus-vitae/ui';
import Image from 'next/image';
import Link from 'next/link';

import { formatPriceRange } from '@/lib/properties';

interface SimilarProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  tier: PropertyTier;
  score: number | null;
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  featuredImage: {
    url: string;
    alt: string;
  } | null;
}

interface SimilarPropertiesSectionProps {
  properties: SimilarProperty[];
  currentPropertySlug: string;
}

export function SimilarPropertiesSection({
  properties,
  currentPropertySlug,
}: SimilarPropertiesSectionProps) {
  if (properties.length === 0) {
    return null;
  }

  // Build comparison URL with similar properties
  const compareUrl = `/compare?properties=${[currentPropertySlug, ...properties.slice(0, 3).map((p) => p.slug)].join(',')}`;

  return (
    <section className="py-12 bg-warm-gray">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium text-clarus-navy">
              Similar Properties
            </h2>
            <p className="mt-2 text-slate">
              Based on tier, location, and focus areas
            </p>
          </div>
          <Link
            href={compareUrl}
            className="inline-flex h-9 items-center justify-center rounded-md border border-clarus-navy bg-transparent px-4 text-sm font-medium text-clarus-navy transition-colors hover:bg-stone"
          >
            Compare These
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.slug}`}
              className="group overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              {/* Image */}
              <div className="relative aspect-[3/2]">
                {property.featuredImage ? (
                  <Image
                    src={property.featuredImage.url}
                    alt={property.featuredImage.alt || property.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone">
                    <span className="text-xs text-slate">No image</span>
                  </div>
                )}

                {/* Score Badge */}
                {property.score !== null && (
                  <div className="absolute bottom-2 right-2">
                    <ClarusIndexBadge score={property.score} size="sm" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <TierBadge tier={property.tier} size="sm" />
                <h3 className="mt-2 font-display text-lg text-clarus-navy line-clamp-1">
                  {property.name}
                </h3>
                <p className="mt-1 text-sm text-slate">
                  {property.city}, {property.country}
                </p>
                <p className="mt-2 text-sm font-medium text-clarus-navy">
                  {formatPriceRange(property.pricing.min, property.pricing.max, property.pricing.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
