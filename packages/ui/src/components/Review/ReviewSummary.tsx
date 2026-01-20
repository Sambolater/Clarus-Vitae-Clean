'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface ReviewAggregation {
  totalReviews: number;
  verifiedCount: number;
  teamReviewCount: number;
  overallAverage: number;
  goalAchievementAvg?: number;
  protocolQualityAvg?: number;
  followupQualityAvg?: number;
  physicianEndorsementAvg?: number;
  facilitiesAvg?: number;
  serviceAvg?: number;
  foodAvg?: number;
  valueAvg?: number;
  followUpData?: {
    thirtyDayCount: number;
    thirtyDayFullySustained: number;
    ninetyDayCount: number;
    ninetyDayFullySustained: number;
    oneEightyDayCount: number;
    oneEightyDayFullySustained: number;
  };
  goalAchievementDistribution?: {
    fully: number;
    partially: number;
    notAchieved: number;
  };
}

export interface ReviewSummaryProps extends HTMLAttributes<HTMLDivElement> {
  aggregation: ReviewAggregation;
  propertyTier?: 'TIER_1' | 'TIER_2' | 'TIER_3';
  showOutcomes?: boolean;
  compact?: boolean;
}

/**
 * MetricCard for displaying individual metrics.
 */
function MetricCard({
  label,
  value,
  maxValue = 5,
  size = 'md',
}: {
  label: string;
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="text-center">
      <div
        className={cn(
          'font-semibold text-clarus-navy',
          size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'
        )}
      >
        {value.toFixed(1)}
      </div>
      <div className={cn('text-slate', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {label}
      </div>
      {/* Rating bar */}
      <div className="mt-1 h-1.5 w-full rounded-full bg-stone">
        <div
          className="h-full rounded-full bg-clarus-gold"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Star display for overall rating.
 */
function StarDisplay({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <svg
            key={i}
            className={cn(
              'h-5 w-5',
              filled ? 'text-clarus-gold' : partial ? 'text-clarus-gold/50' : 'text-stone'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

/**
 * ResultsSustainabilityChart for showing follow-up data.
 */
function ResultsSustainabilityChart({
  followUpData,
}: {
  followUpData: NonNullable<ReviewAggregation['followUpData']>;
}) {
  const periods = [
    { label: '30 days', count: followUpData.thirtyDayCount, sustained: followUpData.thirtyDayFullySustained },
    { label: '90 days', count: followUpData.ninetyDayCount, sustained: followUpData.ninetyDayFullySustained },
    { label: '180 days', count: followUpData.oneEightyDayCount, sustained: followUpData.oneEightyDayFullySustained },
  ];

  const hasData = periods.some((p) => p.count > 0);
  if (!hasData) return null;

  return (
    <div className="rounded-lg bg-stone/30 p-4">
      <h4 className="text-sm font-medium text-clarus-navy mb-3">Results Sustainability</h4>
      <div className="space-y-2">
        {periods.map((period) => {
          if (period.count === 0) return null;
          const sustainedPercent = (period.sustained / period.count) * 100;
          return (
            <div key={period.label} className="flex items-center gap-3">
              <span className="w-16 text-xs text-slate">{period.label}</span>
              <div className="flex-1 h-2 rounded-full bg-stone">
                <div
                  className="h-full rounded-full bg-verification-green"
                  style={{ width: `${sustainedPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-clarus-navy w-12 text-right">
                {sustainedPercent.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate">
        Percentage of guests reporting fully sustained results
      </p>
    </div>
  );
}

/**
 * GoalAchievementDistribution chart.
 */
function GoalAchievementDistribution({
  distribution,
  total,
}: {
  distribution: NonNullable<ReviewAggregation['goalAchievementDistribution']>;
  total: number;
}) {
  if (total === 0) return null;

  const segments = [
    { label: 'Fully Achieved', count: distribution.fully, color: 'bg-verification-green' },
    { label: 'Partially Achieved', count: distribution.partially, color: 'bg-clarus-gold' },
    { label: 'Not Achieved', count: distribution.notAchieved, color: 'bg-slate' },
  ];

  return (
    <div className="rounded-lg bg-stone/30 p-4">
      <h4 className="text-sm font-medium text-clarus-navy mb-3">Goal Achievement</h4>
      {/* Stacked bar */}
      <div className="h-4 w-full rounded-full bg-stone flex overflow-hidden">
        {segments.map((segment) => {
          const percent = (segment.count / total) * 100;
          if (percent === 0) return null;
          return (
            <div
              key={segment.label}
              className={cn('h-full', segment.color)}
              style={{ width: `${percent}%` }}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5 text-xs">
            <div className={cn('h-2.5 w-2.5 rounded-full', segment.color)} />
            <span className="text-slate">{segment.label}</span>
            <span className="font-medium text-clarus-navy">{segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ReviewSummary component for displaying aggregated review statistics.
 *
 * Features:
 * - Overall rating with star display
 * - Outcome metrics (for Tier 1 & 2 properties)
 * - Experience metrics
 * - Results sustainability chart
 * - Goal achievement distribution
 * - Review counts and verification stats
 */
export const ReviewSummary = forwardRef<HTMLDivElement, ReviewSummaryProps>(
  ({ aggregation, propertyTier, showOutcomes = true, compact = false, className, ...props }, ref) => {
    const isClinicalTier = propertyTier === 'TIER_1' || propertyTier === 'TIER_2';
    const verifiedPercent = aggregation.totalReviews > 0
      ? ((aggregation.verifiedCount / aggregation.totalReviews) * 100).toFixed(0)
      : 0;

    if (compact) {
      return (
        <div ref={ref} className={cn('flex items-center gap-6', className)} {...props}>
          {/* Overall rating */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold text-clarus-navy">
              {aggregation.overallAverage.toFixed(1)}
            </span>
            <StarDisplay rating={aggregation.overallAverage} />
          </div>
          {/* Review count */}
          <div className="text-sm text-slate">
            {aggregation.totalReviews} reviews
            <span className="text-xs ml-1">({verifiedPercent}% verified)</span>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Header with overall rating */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold text-clarus-navy">
                {aggregation.overallAverage.toFixed(1)}
              </span>
              <div>
                <StarDisplay rating={aggregation.overallAverage} />
                <p className="text-sm text-slate mt-1">
                  Based on {aggregation.totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-verification-green">
                {verifiedPercent}%
              </div>
              <div className="text-xs text-slate">Verified</div>
            </div>
            {aggregation.teamReviewCount > 0 && (
              <div>
                <div className="text-xl font-semibold text-clarus-gold">
                  {aggregation.teamReviewCount}
                </div>
                <div className="text-xs text-slate">Team Reviews</div>
              </div>
            )}
          </div>
        </div>

        {/* Outcome metrics (Tier 1 & 2) */}
        {showOutcomes && isClinicalTier && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {aggregation.goalAchievementAvg !== undefined && (
              <MetricCard label="Goals" value={aggregation.goalAchievementAvg} />
            )}
            {aggregation.protocolQualityAvg !== undefined && (
              <MetricCard label="Protocol" value={aggregation.protocolQualityAvg} />
            )}
            {aggregation.followupQualityAvg !== undefined && (
              <MetricCard label="Follow-up" value={aggregation.followupQualityAvg} />
            )}
            {aggregation.physicianEndorsementAvg !== undefined && (
              <MetricCard label="Medical" value={aggregation.physicianEndorsementAvg} />
            )}
          </div>
        )}

        {/* Experience metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {aggregation.serviceAvg !== undefined && (
            <MetricCard label="Service" value={aggregation.serviceAvg} size="sm" />
          )}
          {aggregation.facilitiesAvg !== undefined && (
            <MetricCard label="Facilities" value={aggregation.facilitiesAvg} size="sm" />
          )}
          {aggregation.foodAvg !== undefined && (
            <MetricCard label="Dining" value={aggregation.foodAvg} size="sm" />
          )}
          {aggregation.valueAvg !== undefined && (
            <MetricCard label="Value" value={aggregation.valueAvg} size="sm" />
          )}
        </div>

        {/* Goal Achievement Distribution */}
        {showOutcomes && aggregation.goalAchievementDistribution && (
          <GoalAchievementDistribution
            distribution={aggregation.goalAchievementDistribution}
            total={
              aggregation.goalAchievementDistribution.fully +
              aggregation.goalAchievementDistribution.partially +
              aggregation.goalAchievementDistribution.notAchieved
            }
          />
        )}

        {/* Results Sustainability */}
        {showOutcomes && aggregation.followUpData && (
          <ResultsSustainabilityChart followUpData={aggregation.followUpData} />
        )}
      </div>
    );
  }
);

ReviewSummary.displayName = 'ReviewSummary';
