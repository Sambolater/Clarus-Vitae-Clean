import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';
import { type PropertyRecognition, RecognitionBadges } from './RecognitionBadges';

export type PropertyTier = 'medical_longevity' | 'integrated_wellness' | 'luxury_destination';

export interface ScoreCardProperty {
  name: string;
  tier: PropertyTier;
  score: {
    overall: number;
    dimensions?: Array<{
      key: string;
      label: string;
      score: number;
    }>;
  };
  recognition: PropertyRecognition;
}

export interface ScoreCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'property'> {
  property: ScoreCardProperty;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
}

const tierLabels: Record<PropertyTier, string> = {
  medical_longevity: 'Medical Longevity',
  integrated_wellness: 'Integrated Wellness',
  luxury_destination: 'Luxury Destination',
};

const tierColors: Record<PropertyTier, string> = {
  medical_longevity: 'text-verification-green',
  integrated_wellness: 'text-clarus-navy',
  luxury_destination: 'text-clarus-gold',
};

function getScoreTier(score: number): {
  label: string;
  bgClass: string;
  textClass: string;
} {
  if (score >= 90) {
    return {
      label: 'Exceptional',
      bgClass: 'bg-clarus-navy',
      textClass: 'text-clarus-gold',
    };
  }
  if (score >= 80) {
    return {
      label: 'Distinguished',
      bgClass: 'bg-clarus-navy',
      textClass: 'text-white',
    };
  }
  if (score >= 70) {
    return {
      label: 'Notable',
      bgClass: 'bg-slate',
      textClass: 'text-white',
    };
  }
  return {
    label: 'Curated',
    bgClass: 'bg-stone',
    textClass: 'text-clarus-navy',
  };
}

function getScoreBarColor(score: number): string {
  if (score >= 90) return 'bg-verification-green';
  if (score >= 70) return 'bg-clarus-navy';
  if (score >= 50) return 'bg-slate';
  return 'bg-alert-amber';
}

/**
 * ScoreCard component for displaying property scores in listings.
 *
 * Provides compact and detailed variants for different display contexts.
 */
export const ScoreCard = forwardRef<HTMLDivElement, ScoreCardProps>(
  ({ property, variant = 'compact', onClick, className, ...props }, ref) => {
    const { name, tier, score, recognition } = property;
    const scoreTier = getScoreTier(score.overall);

    // Get top 3 dimensions for detailed variant
    const topDimensions = score.dimensions
      ?.slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-3 rounded-lg border border-stone p-3',
            onClick && 'cursor-pointer transition-shadow hover:shadow-md',
            className
          )}
          onClick={onClick}
          onKeyDown={(e) => {
            if (onClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onClick();
            }
          }}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
          {...props}
        >
          {/* Score Badge */}
          <div
            className={cn(
              'flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full',
              scoreTier.bgClass
            )}
          >
            <span className={cn('font-display text-xl', scoreTier.textClass)}>
              {score.overall}
            </span>
          </div>

          {/* Property Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-clarus-navy truncate">{name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('text-xs font-medium uppercase tracking-wide', tierColors[tier])}>
                {tierLabels[tier]}
              </span>
              <span className={cn('text-xs', scoreTier.textClass === 'text-clarus-gold' ? 'text-clarus-gold' : 'text-slate')}>
                {scoreTier.label}
              </span>
            </div>

            {/* Recognition badges (compact) */}
            {(recognition.isEditorsChoice || recognition.isVerifiedExcellence || recognition.isRisingStar) && (
              <div className="mt-1.5">
                <RecognitionBadges recognition={recognition} size="sm" showLabels={false} />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Detailed variant
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-stone bg-white p-4',
          onClick && 'cursor-pointer transition-shadow hover:shadow-md',
          className
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="font-display text-lg font-medium text-clarus-navy">{name}</h4>
            <span className={cn('text-xs font-medium uppercase tracking-wide', tierColors[tier])}>
              {tierLabels[tier]}
            </span>
          </div>

          {/* Score Badge */}
          <div
            className={cn(
              'flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full',
              scoreTier.bgClass
            )}
          >
            <span className={cn('font-display text-2xl', scoreTier.textClass)}>
              {score.overall}
            </span>
            <span className={cn('text-[10px] uppercase tracking-wider', scoreTier.textClass, 'opacity-80')}>
              {scoreTier.label}
            </span>
          </div>
        </div>

        {/* Top Dimensions */}
        {topDimensions && topDimensions.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-slate uppercase tracking-wide">
              Top Strengths
            </p>
            {topDimensions.map(({ key, label, score: dimScore }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-clarus-navy">{label}</span>
                  <span className="text-sm font-medium text-clarus-navy">{dimScore}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', getScoreBarColor(dimScore))}
                    style={{ width: `${dimScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recognition badges */}
        {(recognition.isEditorsChoice || recognition.isVerifiedExcellence || recognition.isRisingStar) && (
          <div className="pt-3 border-t border-stone">
            <RecognitionBadges recognition={recognition} size="sm" layout="inline" />
          </div>
        )}
      </div>
    );
  }
);

ScoreCard.displayName = 'ScoreCard';
