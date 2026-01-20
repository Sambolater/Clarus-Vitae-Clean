import type { Metadata } from 'next';
import { db } from '@clarus-vitae/database';
import { notFound, redirect } from 'next/navigation';
import { ReviewWriteClient } from './_components/ReviewWriteClient';

export const metadata: Metadata = {
  title: 'Write a Review | Clarus Vitae',
  description:
    'Share your wellness experience with outcome-focused reviews. Help others understand what actually works.',
};

interface ReviewWritePageProps {
  searchParams: Promise<{ property?: string }>;
}

export default async function ReviewWritePage({ searchParams }: ReviewWritePageProps) {
  const params = await searchParams;
  const propertySlug = params.property;

  // If no property specified, redirect to properties browse
  if (!propertySlug) {
    redirect('/properties?action=review');
  }

  // Fetch property details
  const property = await db.property.findUnique({
    where: { slug: propertySlug, published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      tier: true,
      city: true,
      country: true,
      programs: {
        where: { published: true },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-warm-gray">
      {/* Header */}
      <div className="bg-clarus-navy py-8">
        <div className="container mx-auto px-6">
          <nav className="mb-4">
            <a
              href={`/properties/${property.slug}`}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              ← Back to {property.name}
            </a>
          </nav>
          <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
            Write a Review
          </h1>
          <p className="mt-2 text-white/80">
            {property.name} · {property.city}, {property.country}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl bg-white p-6 shadow-card md:p-8">
            <ReviewWriteClient
              propertyId={property.id}
              propertyName={property.name}
              propertyTier={property.tier}
              programs={property.programs}
            />
          </div>

          {/* Guidelines */}
          <div className="mt-8 rounded-lg bg-stone/30 p-6">
            <h2 className="text-sm font-semibold text-clarus-navy mb-4">
              Review Guidelines
            </h2>

            <div className="space-y-4 text-sm text-slate">
              <div>
                <h3 className="font-medium text-clarus-navy">What makes a helpful review</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Specific health goals you had and whether they were met</li>
                  <li>Details about your personalized protocol</li>
                  <li>Measurable outcomes (biomarkers, weight, energy levels)</li>
                  <li>Quality of medical staff and their attention</li>
                  <li>Follow-up support you received</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-clarus-navy">Please avoid</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Including identifying information about other guests</li>
                  <li>Sharing specific medical advice</li>
                  <li>Reviewing properties you haven't visited</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-clarus-navy">Verification</h3>
                <p className="mt-2">
                  Reviews marked "Verified Stay" have been confirmed through email verification,
                  booking confirmation, or property confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
