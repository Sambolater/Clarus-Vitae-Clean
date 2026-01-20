'use client';

import { type PropertyTier } from '@clarus-vitae/database';
import { PropertyCard } from '@clarus-vitae/ui';
import Link from 'next/link';

import { formatPriceRange } from '@/lib/properties';

interface Property {
  id: string;
  slug: string;
  name: string;
  location: {
    city: string;
    country: string;
    region: string | null;
  };
  tier: PropertyTier;
  score: number | null;
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  priceAtProperty: number | null;
  notes: string | null;
  featuredImage: {
    url: string;
    alt: string;
  } | null;
}

interface WhereToGetItProps {
  properties: Property[];
  treatmentName: string;
  treatmentSlug: string;
}

export function WhereToGetIt({ properties, treatmentName, treatmentSlug }: WhereToGetItProps) {
  if (properties.length === 0) {
    return (
      <section className="py-12">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">Where To Get It</h2>
        <div className="mt-6 rounded-lg border border-stone bg-warm-gray p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate"
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
          <h3 className="mt-4 font-medium text-clarus-navy">No Properties Listed Yet</h3>
          <p className="mt-2 text-sm text-slate">
            We are currently researching properties that offer this treatment.
            Check back soon for updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Where To Get It</h2>
          <p className="mt-1 text-slate">
            {properties.length} {properties.length === 1 ? 'property offers' : 'properties offer'}{' '}
            {treatmentName}
          </p>
        </div>
        {properties.length > 6 && (
          <Link
            href={`/properties?treatment=${treatmentSlug}`}
            className="text-sm font-medium text-clarus-navy hover:underline"
          >
            View all properties
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.slice(0, 6).map((property) => (
          <Link key={property.id} href={`/properties/${property.slug}`}>
            <PropertyCard
              name={property.name}
              location={property.location.city}
              country={property.location.country}
              tier={property.tier}
              score={property.score ?? 0}
              imageUrl={property.featuredImage?.url}
              priceRange={
                property.priceAtProperty
                  ? `Treatment: $${property.priceAtProperty.toLocaleString()}`
                  : formatPriceRange(property.pricing.min, property.pricing.max, property.pricing.currency)
              }
              href={`/properties/${property.slug}`}
            />
          </Link>
        ))}
      </div>

      {/* Treatment-specific notes if available */}
      {properties.some((p) => p.notes) && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-clarus-navy">Property-Specific Notes</h3>
          <div className="mt-4 space-y-3">
            {properties
              .filter((p) => p.notes)
              .slice(0, 3)
              .map((property) => (
                <div
                  key={property.id}
                  className="rounded-lg border border-stone bg-warm-gray p-4"
                >
                  <p className="text-sm font-medium text-clarus-navy">{property.name}</p>
                  <p className="mt-1 text-sm text-slate">{property.notes}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
