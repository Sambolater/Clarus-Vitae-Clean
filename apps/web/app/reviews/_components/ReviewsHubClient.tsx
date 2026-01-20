'use client';

import {
  ReviewFilters,
  type ReviewFiltersState,
  StarRating,
  VerifiedBadge,
  TeamReviewBadge,
  OutcomeIndicator,
} from '@clarus-vitae/ui';
import { useState, useCallback } from 'react';

interface ReviewData {
  id: string;
  property: {
    id: string;
    name: string;
    slug: string;
    tier: string;
    location: string;
  };
  reviewer: {
    name: string;
    isTeamReview: boolean;
    teamMember?: {
      name: string;
      title: string;
      slug: string;
    } | null;
  };
  rating: number;
  goalAchievement: string | null;
  excerpt: string;
  reviewText: string;
  verified: boolean;
  visitDate: string;
  createdAt: string;
  stayLengthDays: number;
  programType: string;
  pros: string[];
  cons: string[];
  outcomeRatings: {
    protocolQuality: number | null;
    followupQuality: number | null;
    physicianEndorsement: string | null;
  };
}

interface ReviewsHubClientProps {
  initialReviews: ReviewData[];
  initialTotal: number;
}

export function ReviewsHubClient({ initialReviews, initialTotal }: ReviewsHubClientProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const [filters, setFilters] = useState<ReviewFiltersState>({
    sortBy: 'recent',
    timeframe: 'all',
    verifiedOnly: false,
    teamReviewsOnly: false,
  });

  const fetchReviews = useCallback(async (newFilters: ReviewFiltersState, newPage: number = 1) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: newPage.toString(),
        limit: '10',
        sort: newFilters.sortBy === 'recent' ? 'newest' :
              newFilters.sortBy === 'highest_rating' ? 'highest' :
              newFilters.sortBy === 'lowest_rating' ? 'lowest' :
              newFilters.sortBy === 'most_helpful' ? 'helpful' : 'newest',
      });

      if (newFilters.verifiedOnly) {
        params.set('verified', 'true');
      }

      if (newFilters.teamReviewsOnly) {
        params.set('team', 'true');
      }

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (newPage === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }
      setTotal(data.pagination.totalCount);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = (newFilters: ReviewFiltersState) => {
    setFilters(newFilters);
    fetchReviews(newFilters, 1);
  };

  const loadMore = () => {
    fetchReviews(filters, page + 1);
  };

  const toggleExpand = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getGoalLevel = (achievement: string | null): 'exceeded' | 'achieved' | 'partial' | 'not_achieved' => {
    switch (achievement) {
      case 'FULLY':
        return 'achieved';
      case 'PARTIALLY':
        return 'partial';
      case 'NOT_ACHIEVED':
        return 'not_achieved';
      default:
        return 'partial';
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ReviewFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        showOutcomeFilters={true}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate">
          Showing {reviews.length} of {total} reviews
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => {
          const isExpanded = expandedReview === review.id;

          return (
            <div
              key={review.id}
              className="rounded-xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {/* Property Link */}
                  <a
                    href={`/properties/${review.property.slug}`}
                    className="text-lg font-semibold text-clarus-navy hover:text-clarus-gold transition-colors"
                  >
                    {review.property.name}
                  </a>
                  <p className="text-sm text-slate">{review.property.location}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="md" showValue />
                </div>
              </div>

              {/* Reviewer info */}
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-clarus-navy">
                  {review.reviewer.name}
                </span>
                <span className="text-slate">·</span>
                <span className="text-sm text-slate">
                  {formatDate(review.visitDate)}
                </span>
                <span className="text-slate">·</span>
                <span className="text-sm text-slate">
                  {review.stayLengthDays} days
                </span>

                {/* Badges */}
                {review.verified && (
                  <VerifiedBadge type="visit" size="sm" />
                )}
                {review.reviewer.isTeamReview && review.reviewer.teamMember && (
                  <TeamReviewBadge
                    teamMember={review.reviewer.teamMember}
                  />
                )}
              </div>

              {/* Program type */}
              <div className="mt-2">
                <span className="inline-block rounded-full bg-stone/50 px-3 py-1 text-xs text-slate">
                  {review.programType}
                </span>
              </div>

              {/* Goal Achievement */}
              {review.goalAchievement && (
                <div className="mt-4">
                  <OutcomeIndicator
                    level={getGoalLevel(review.goalAchievement)}
                    size="sm"
                  />
                </div>
              )}

              {/* Review Content */}
              <div className="mt-4">
                <p className="text-sm leading-relaxed text-clarus-navy">
                  {isExpanded ? review.reviewText : review.excerpt}
                </p>
                {review.reviewText.length > 200 && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="mt-2 text-sm font-medium text-clarus-navy hover:text-clarus-gold transition-colors"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* Pros/Cons */}
              {isExpanded && (review.pros.length > 0 || review.cons.length > 0) && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {review.pros.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-verification-green uppercase tracking-wider mb-2">
                        Pros
                      </h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-slate flex items-start gap-2">
                            <span className="text-verification-green">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">
                        Cons
                      </h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm text-slate flex items-start gap-2">
                            <span className="text-slate">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-stone flex items-center justify-between">
                <a
                  href={`/properties/${review.property.slug}`}
                  className="text-sm text-clarus-navy hover:text-clarus-gold transition-colors"
                >
                  View Property →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-clarus-navy border-t-transparent" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone/50 mb-4">
            <svg className="h-8 w-8 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-clarus-navy mb-2">
            No reviews found
          </h3>
          <p className="text-sm text-slate mb-6">
            Try adjusting your filters or be the first to write a review.
          </p>
          <a
            href="/properties?action=review"
            className="inline-block rounded-lg bg-clarus-navy px-6 py-3 font-medium text-white hover:bg-clarus-navy/90 transition-colors"
          >
            Write a Review
          </a>
        </div>
      )}

      {/* Load More */}
      {!isLoading && reviews.length < total && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="rounded-lg bg-stone px-8 py-3 font-medium text-clarus-navy hover:bg-stone/70 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
