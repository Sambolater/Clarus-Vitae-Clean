'use client';

import { type PropertyTier } from '@clarus-vitae/database';
import { Button, StarRating, OutcomeIndicator, VerifiedBadge, LoadingSpinner } from '@clarus-vitae/ui';
import { useState } from 'react';

interface ReviewStats {
  totalReviews: number;
  averageRating: number | null;
  ratings: {
    overall: number;
    service: number | null;
    facilities: number | null;
    dining: number | null;
    value: number | null;
  } | null;
  outcomeStats: {
    totalWithOutcomes: number;
    fullyAchieved: number;
    partiallyAchieved: number;
    notAchieved: number;
  } | null;
}

interface PropertyReviewsSectionProps {
  propertySlug: string;
  tier: PropertyTier;
  reviewStats: ReviewStats;
}

export function PropertyReviewsSection({
  propertySlug,
  tier,
  reviewStats,
}: PropertyReviewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'team'>('all');

  if (reviewStats.totalReviews === 0) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Reviews</h2>
          <div className="mt-8 rounded-lg border border-stone bg-white p-8 text-center">
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-clarus-navy">No reviews yet</h3>
            <p className="mt-2 text-sm text-slate">
              Be the first to share your experience at this property.
            </p>
            <Button variant="primary" className="mt-4" href={`/reviews/write?property=${propertySlug}`}>
              Write a Review
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const showOutcomes = tier === 'TIER_1' || tier === 'TIER_2';

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Reviews</h2>
          <Button variant="secondary" size="sm" href={`/reviews/write?property=${propertySlug}`}>
            Write a Review
          </Button>
        </div>

        {/* Review Summary */}
        <div className="mt-8 grid gap-6 rounded-lg border border-stone bg-white p-6 md:grid-cols-2">
          {/* Rating Summary */}
          <div>
            <div className="flex items-center gap-4">
              <span className="font-display text-5xl text-clarus-navy">
                {reviewStats.averageRating?.toFixed(1)}
              </span>
              <div>
                <StarRating rating={reviewStats.averageRating || 0} size="lg" />
                <p className="mt-1 text-sm text-slate">
                  Based on {reviewStats.totalReviews}{' '}
                  {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {/* Category Ratings */}
            {reviewStats.ratings && (
              <div className="mt-6 space-y-3">
                {reviewStats.ratings.service !== null && (
                  <RatingRow label="Service" rating={reviewStats.ratings.service} />
                )}
                {reviewStats.ratings.facilities !== null && (
                  <RatingRow label="Facilities" rating={reviewStats.ratings.facilities} />
                )}
                {reviewStats.ratings.dining !== null && (
                  <RatingRow label="Dining" rating={reviewStats.ratings.dining} />
                )}
                {reviewStats.ratings.value !== null && (
                  <RatingRow label="Value" rating={reviewStats.ratings.value} />
                )}
              </div>
            )}
          </div>

          {/* Outcome Summary (Tier 1 & 2 only) */}
          {showOutcomes && reviewStats.outcomeStats && (
            <div className="border-t border-stone pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <h3 className="text-sm font-medium text-clarus-navy">Outcome Achievement</h3>
              <p className="mt-1 text-xs text-slate">
                Based on {reviewStats.outcomeStats.totalWithOutcomes} reviews with outcome data
              </p>

              <div className="mt-4 space-y-3">
                <OutcomeRow
                  label="Fully achieved goals"
                  count={reviewStats.outcomeStats.fullyAchieved}
                  total={reviewStats.outcomeStats.totalWithOutcomes}
                  color="bg-verification-green"
                />
                <OutcomeRow
                  label="Partially achieved"
                  count={reviewStats.outcomeStats.partiallyAchieved}
                  total={reviewStats.outcomeStats.totalWithOutcomes}
                  color="bg-clarus-gold"
                />
                <OutcomeRow
                  label="Not achieved"
                  count={reviewStats.outcomeStats.notAchieved}
                  total={reviewStats.outcomeStats.totalWithOutcomes}
                  color="bg-slate"
                />
              </div>
            </div>
          )}
        </div>

        {/* Review Tabs */}
        <div className="mt-8 border-b border-stone">
          <div className="flex gap-6">
            <TabButton
              label="All Reviews"
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <TabButton
              label="Verified"
              active={activeTab === 'verified'}
              onClick={() => setActiveTab('verified')}
            />
            <TabButton
              label="Team Reviews"
              active={activeTab === 'team'}
              onClick={() => setActiveTab('team')}
            />
          </div>
        </div>

        {/* Reviews List Placeholder */}
        <div className="mt-6">
          <p className="text-center text-sm text-slate">
            Review list loads dynamically. Visit{' '}
            <a
              href={`/properties/${propertySlug}/reviews`}
              className="text-clarus-navy underline hover:no-underline"
            >
              all reviews
            </a>{' '}
            to see full list.
          </p>
        </div>
      </div>
    </section>
  );
}

function RatingRow({ label, rating }: { label: string; rating: number }) {
  const percentage = (rating / 5) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-slate">{label}</span>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-stone">
          <div
            className="h-full rounded-full bg-clarus-navy"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-sm font-medium text-clarus-navy">{rating.toFixed(1)}</span>
    </div>
  );
}

function OutcomeRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate">{label}</span>
          <span className="font-medium text-clarus-navy">
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
        active
          ? 'border-clarus-navy text-clarus-navy'
          : 'border-transparent text-slate hover:text-clarus-navy'
      }`}
    >
      {label}
    </button>
  );
}
