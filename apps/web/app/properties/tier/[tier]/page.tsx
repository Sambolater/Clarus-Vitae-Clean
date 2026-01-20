import { type PropertyTier } from '@clarus-vitae/database';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// tierLabels and tierDescriptions are defined in tierMetadata below

interface TierPageProps {
  params: Promise<{ tier: string }>;
}

// Map URL slugs to tier enum values
const tierSlugMap: Record<string, PropertyTier> = {
  'medical-longevity': 'TIER_1',
  'integrated-wellness': 'TIER_2',
  'luxury-destination': 'TIER_3',
};

const tierMetadata: Record<PropertyTier, { title: string; description: string }> = {
  TIER_1: {
    title: 'Medical Longevity Clinics | Clarus Vitae',
    description:
      'Discover elite medical longevity clinics with advanced diagnostics, physician oversight, and evidence-based protocols. Programs from $20K-$150K+. Independently evaluated.',
  },
  TIER_2: {
    title: 'Integrated Wellness Retreats | Clarus Vitae',
    description:
      'Explore integrated wellness retreats combining medical consultations with holistic approaches. Programs from $5K-$30K. Independently evaluated by the Clarus Index.',
  },
  TIER_3: {
    title: 'Luxury Destination Spas | Clarus Vitae',
    description:
      "Discover the world's finest luxury destination spas for relaxation and rejuvenation. Programs from $3K-$15K. Independently evaluated by the Clarus Index.",
  },
};

export async function generateMetadata({ params }: TierPageProps): Promise<Metadata> {
  const { tier: tierSlug } = await params;
  const tier = tierSlugMap[tierSlug];

  if (!tier) {
    return { title: 'Not Found | Clarus Vitae' };
  }

  const metadata = tierMetadata[tier]!;
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(tierSlugMap).map((tier) => ({ tier }));
}

export default async function TierPage({ params }: TierPageProps) {
  const { tier: tierSlug } = await params;
  const tier = tierSlugMap[tierSlug];

  if (!tier) {
    notFound();
  }

  // Redirect to main properties page with tier filter
  redirect(`/properties?tier=${tier}`);
}
