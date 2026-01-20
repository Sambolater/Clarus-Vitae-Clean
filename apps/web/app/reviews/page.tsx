import { db } from '@clarus-vitae/database';
import type { Metadata } from 'next';

import { ReviewsHubClient } from './_components/ReviewsHubClient';

export const metadata: Metadata = {
  title: 'Reviews | Clarus Vitae',
  description:
    'Outcome-focused reviews from verified guests, measuring what actually matters: health results, protocol quality, and long-term sustainability.',
};

export default async function ReviewsPage() {
  // Get initial reviews for SSR
  const reviews = await db.review.findMany({
    where: {
      status: 'APPROVED',
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      property: {
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          city: true,
          country: true,
        },
      },
      teamMember: {
        select: {
          name: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const totalCount = await db.review.count({
    where: { status: 'APPROVED' },
  });

  // Transform reviews for client
  const initialReviews = reviews.map((review) => ({
    id: review.id,
    property: {
      id: review.property.id,
      name: review.property.name,
      slug: review.property.slug,
      tier: review.property.tier,
      location: `${review.property.city}, ${review.property.country}`,
    },
    reviewer: {
      name: review.isTeamReview
        ? review.teamMember?.name || 'Clarus Team'
        : review.reviewerName || 'Verified Guest',
      isTeamReview: review.isTeamReview,
      teamMember: review.teamMember,
    },
    rating: review.overallRating,
    goalAchievement: review.goalAchievement,
    excerpt:
      review.reviewText.length > 200
        ? review.reviewText.substring(0, 200) + '...'
        : review.reviewText,
    reviewText: review.reviewText,
    verified: review.verified,
    visitDate: review.visitDate.toISOString(),
    createdAt: review.createdAt.toISOString(),
    stayLengthDays: review.stayLengthDays,
    programType: review.programType,
    pros: review.pros,
    cons: review.cons,
    outcomeRatings: {
      protocolQuality: review.protocolQualityRating,
      followupQuality: review.followupQualityRating,
      physicianEndorsement: review.physicianEndorsement,
    },
  }));

  // Get aggregate stats
  const verifiedCount = await db.review.count({
    where: { status: 'APPROVED', verified: true },
  });

  const teamReviewCount = await db.review.count({
    where: { status: 'APPROVED', isTeamReview: true },
  });

  return (
    <main className="min-h-screen bg-warm-gray">
      {/* Hero Section */}
      <section className="bg-clarus-navy py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
              Guest Reviews
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Outcome-focused reviews that ask &ldquo;Did it work?&rdquo; not just &ldquo;Was it nice?&rdquo;
              Read verified experiences measuring health results, protocol quality,
              and long-term sustainability.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-semibold text-clarus-gold">
                  {totalCount}
                </div>
                <div className="text-sm text-white/70">Total Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-verification-green">
                  {verifiedCount}
                </div>
                <div className="text-sm text-white/70">Verified Stays</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-clarus-gold">
                  {teamReviewCount}
                </div>
                <div className="text-sm text-white/70">Team Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-stone/50 border-b border-stone">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-lg font-semibold text-clarus-navy">
                Have you visited a wellness property?
              </h2>
              <p className="text-sm text-slate">
                Share your experience and help others make informed decisions.
              </p>
            </div>
            <a
              href="/properties?action=review"
              className="rounded-lg bg-clarus-navy px-6 py-3 font-medium text-white hover:bg-clarus-navy/90 transition-colors"
            >
              Write a Review
            </a>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="container mx-auto px-6 py-12">
        <ReviewsHubClient
          initialReviews={initialReviews}
          initialTotal={totalCount}
        />
      </section>
    </main>
  );
}
