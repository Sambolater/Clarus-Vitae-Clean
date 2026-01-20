import { db } from '@clarus-vitae/database';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface DestinationPageProps {
  params: Promise<{ country: string }>;
}

// Format country slug to display name (e.g., "united-states" -> "United States")
function formatCountryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format display name to URL slug
function toCountrySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const countryName = formatCountryName(countrySlug);

  // Verify the country has properties
  const count = await db.property.count({
    where: {
      published: true,
      country: {
        equals: countryName,
        mode: 'insensitive',
      },
    },
  });

  if (count === 0) {
    return { title: 'Destination Not Found | Clarus Vitae' };
  }

  return {
    title: `Wellness Retreats in ${countryName} | Clarus Vitae`,
    description: `Discover ${count} premium wellness destinations in ${countryName}. Independent research and Clarus Index scores for medical longevity clinics, integrated retreats, and luxury spas.`,
    openGraph: {
      title: `Wellness Retreats in ${countryName} | Clarus Vitae`,
      description: `Discover ${count} premium wellness destinations in ${countryName}. Independently evaluated by the Clarus Index.`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  // Get unique countries from published properties
  const countries = await db.property.findMany({
    where: { published: true },
    select: { country: true },
    distinct: ['country'],
  });

  return countries.map((p) => ({
    country: toCountrySlug(p.country),
  }));
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { country: countrySlug } = await params;
  const countryName = formatCountryName(countrySlug);

  // Redirect to main properties page with country filter
  redirect(`/properties?country=${encodeURIComponent(countryName)}`);
}
