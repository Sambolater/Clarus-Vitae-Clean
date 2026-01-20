import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type IndexDimension =
  | 'scientific_rigor'
  | 'safety_profile'
  | 'efficacy_data'
  | 'provider_quality'
  | 'value_alignment';

export interface DimensionScore {
  dimension: IndexDimension;
  score: number;
  label?: string;
}

export interface ScoreBreakdownProps extends HTMLAttributes<HTMLDivElement> {
  overallScore: number;
  dimensions: DimensionScore[];
  size?: 'sm' | 'md' | 'lg';
  showOverall?: boolean;
}

const dimensionLabels: Record<IndexDimension, string> = {
  scientific_rigor: 'Scientific Rigor',
  safety_profile: 'Safety Profile',
  efficacy_data: 'Efficacy Data',
  provider_quality: 'Provider Quality',
  value_alignment: 'Value Alignment',
};

const dimensionDescriptions: Record<IndexDimension, string> = {
  scientific_rigor: 'Evidence quality and research backing',
  safety_profile: 'Risk assessment and contraindications',
  efficacy_data: 'Measured outcomes and effectiveness',
  provider_quality: 'Practitioner credentials and facility standards',
  value_alignment: 'Match to individual health goals',
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'bg-verification-green';
  if (score >= 70) return 'bg-clarus-navy';
  if (score >= 50) return 'bg-slate';
  return 'bg-alert-amber';
}

const sizeStyles = {
  sm: {
    label: 'text-xs',
    score: 'text-xs',
    bar: 'h-1.5',
    gap: 'gap-2',
    padding: 'py-1.5',
  },
  md: {
    label: 'text-sm',
    score: 'text-sm font-medium',
    bar: 'h-2',
    gap: 'gap-3',
    padding: 'py-2',
  },
  lg: {
    label: 'text-base',
    score: 'text-base font-semibold',
    bar: 'h-3',
    gap: 'gap-4',
    padding: 'py-3',
  },
};

/**
 * ScoreBreakdown component showing all five Clarus Index dimensions.
 *
 * Displays horizontal progress bars for each dimension with scores.
 */
export const ScoreBreakdown = forwardRef<HTMLDivElement, ScoreBreakdownProps>(
  ({ overallScore, dimensions, size = 'md', showOverall = true, className, ...props }, ref) => {
    const styles = sizeStyles[size];

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showOverall && (
          <div className="mb-4 flex items-center justify-between border-b border-stone pb-3">
            <span className="text-sm font-medium text-slate uppercase tracking-wide">
              Clarus Index
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl text-clarus-gold">{overallScore}</span>
              <span className="text-sm text-slate">/100</span>
            </div>
          </div>
        )}

        <div className={cn('space-y-1', styles.gap)}>
          {dimensions.map(({ dimension, score, label }) => (
            <div key={dimension} className={styles.padding}>
              <div className="mb-1 flex items-center justify-between">
                <span className={cn('text-clarus-navy', styles.label)}>
                  {label || dimensionLabels[dimension]}
                </span>
                <span className={cn('text-clarus-navy', styles.score)}>{score}</span>
              </div>
              <div className={cn('w-full rounded-full bg-stone overflow-hidden', styles.bar)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-500', getScoreColor(score))}
                  style={{ width: `${score}%` }}
                  role="progressbar"
                  aria-valuenow={score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${dimensionLabels[dimension]}: ${score} out of 100`}
                />
              </div>
              {size === 'lg' && (
                <p className="mt-1 text-xs text-slate">{dimensionDescriptions[dimension]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ScoreBreakdown.displayName = 'ScoreBreakdown';
