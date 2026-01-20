import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState } from 'react';

export type PropertyTier = 'medical_longevity' | 'integrated_wellness' | 'luxury_destination';

// Support both legacy and new dimension keys
export type IndexDimension =
  | 'scientific_rigor'
  | 'safety_profile'
  | 'efficacy_data'
  | 'provider_quality'
  | 'value_alignment'
  | 'clinicalRigor'
  | 'outcomeEvidence'
  | 'programDepth'
  | 'programEffectiveness'
  | 'holisticIntegration'
  | 'practitionerQuality'
  | 'wellnessDepth'
  | 'transformativePotential'
  | 'settingEnvironment'
  | 'experienceQuality'
  | 'valueAlignment';

export interface DimensionScore {
  dimension: string;
  score: number;
  label?: string;
  description?: string;
  weight?: number;
}

export interface ScoreBreakdownProps extends HTMLAttributes<HTMLDivElement> {
  overallScore: number;
  dimensions: DimensionScore[];
  tier?: PropertyTier;
  size?: 'sm' | 'md' | 'lg';
  showOverall?: boolean;
  showWeights?: boolean;
  showComparison?: boolean;
  comparisonLabel?: string;
  comparisonScore?: number;
  expandable?: boolean;
}

const dimensionLabels: Record<string, string> = {
  // Tier 1 dimensions
  clinicalRigor: 'Clinical Rigor',
  outcomeEvidence: 'Outcome Evidence',
  programDepth: 'Program Depth',
  // Tier 2 dimensions
  programEffectiveness: 'Program Effectiveness',
  holisticIntegration: 'Holistic Integration',
  practitionerQuality: 'Practitioner Quality',
  // Tier 3 dimensions
  wellnessDepth: 'Wellness Offering Depth',
  transformativePotential: 'Transformative Potential',
  settingEnvironment: 'Setting & Environment',
  // Shared dimensions
  experienceQuality: 'Experience Quality',
  valueAlignment: 'Value Alignment',
  // Legacy generic dimensions (for backwards compatibility)
  scientific_rigor: 'Scientific Rigor',
  safety_profile: 'Safety Profile',
  efficacy_data: 'Efficacy Data',
  provider_quality: 'Provider Quality',
  value_alignment: 'Value Alignment',
};

const dimensionDescriptions: Record<string, string> = {
  // Tier 1 dimensions
  clinicalRigor: 'Medical credentials, diagnostic depth, evidence-based protocols, physician ratios',
  outcomeEvidence: 'Published results, guest-reported outcomes, follow-up protocols',
  programDepth: 'Comprehensiveness, customization, duration options',
  // Tier 2 dimensions
  programEffectiveness: 'Guest-reported outcomes, expert assessment',
  holisticIntegration: 'How well clinical and wellness elements combine',
  practitionerQuality: 'Credentials, experience, guest feedback on individuals',
  // Tier 3 dimensions
  wellnessDepth: 'Range and quality of treatments, practitioner skill',
  transformativePotential: 'Can this stay create lasting change?',
  settingEnvironment: 'Location, natural surroundings, sense of escape',
  // Shared dimensions
  experienceQuality: 'Facilities, service, accommodation, dining',
  valueAlignment: 'Price relative to what is delivered',
  // Legacy generic dimensions
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

function getScoreTextColor(score: number): string {
  if (score >= 90) return 'text-verification-green';
  if (score >= 70) return 'text-clarus-navy';
  if (score >= 50) return 'text-slate';
  return 'text-alert-amber';
}

const sizeStyles = {
  sm: {
    label: 'text-xs',
    score: 'text-xs',
    bar: 'h-1.5',
    gap: 'gap-2',
    padding: 'py-1.5',
    description: 'text-[10px]',
    weight: 'text-[10px]',
  },
  md: {
    label: 'text-sm',
    score: 'text-sm font-medium',
    bar: 'h-2',
    gap: 'gap-3',
    padding: 'py-2',
    description: 'text-xs',
    weight: 'text-xs',
  },
  lg: {
    label: 'text-base',
    score: 'text-base font-semibold',
    bar: 'h-3',
    gap: 'gap-4',
    padding: 'py-3',
    description: 'text-sm',
    weight: 'text-sm',
  },
};

/**
 * ScoreBreakdown component showing all Clarus Index dimensions.
 *
 * Displays horizontal progress bars for each dimension with scores.
 * Supports tier-specific dimensions, weights display, and comparison views.
 */
export const ScoreBreakdown = forwardRef<HTMLDivElement, ScoreBreakdownProps>(
  (
    {
      overallScore,
      dimensions,
      tier: _tier,
      size = 'md',
      showOverall = true,
      showWeights = false,
      showComparison = false,
      comparisonLabel,
      comparisonScore,
      expandable = false,
      className,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

    const toggleExpand = (dimension: string) => {
      if (expandable) {
        setExpandedDimension(expandedDimension === dimension ? null : dimension);
      }
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showOverall && (
          <div className="mb-6 flex items-center justify-between border-b border-stone pb-4">
            <div>
              <span className="text-sm font-medium text-slate uppercase tracking-wide">
                Clarus Index
              </span>
              {showComparison && comparisonLabel && comparisonScore !== undefined && (
                <p className={cn('mt-1 text-slate', styles.description)}>
                  {comparisonLabel}: {comparisonScore}
                </p>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl text-clarus-gold">{overallScore}</span>
              <span className="text-sm text-slate">/100</span>
            </div>
          </div>
        )}

        <div className={cn('space-y-1', styles.gap)}>
          {dimensions.map(({ dimension, score, label, description, weight }) => {
            const isExpanded = expandedDimension === dimension;
            const displayLabel = label || dimensionLabels[dimension] || dimension;
            const displayDescription =
              description || dimensionDescriptions[dimension] || '';

            return (
              <div
                key={dimension}
                className={cn(
                  styles.padding,
                  expandable && 'cursor-pointer rounded-md transition-colors hover:bg-warm-gray/50'
                )}
                onClick={() => toggleExpand(dimension)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(dimension);
                  }
                }}
                role={expandable ? 'button' : undefined}
                tabIndex={expandable ? 0 : undefined}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-clarus-navy font-medium', styles.label)}>
                      {displayLabel}
                    </span>
                    {showWeights && weight !== undefined && (
                      <span className={cn('text-slate', styles.weight)}>
                        ({Math.round(weight * 100)}%)
                      </span>
                    )}
                    {expandable && (
                      <svg
                        className={cn(
                          'h-4 w-4 text-slate transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={cn(getScoreTextColor(score), styles.score)}>{score}</span>
                </div>
                <div
                  className={cn('w-full rounded-full bg-stone overflow-hidden', styles.bar)}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      getScoreColor(score)
                    )}
                    style={{ width: `${score}%` }}
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${displayLabel}: ${score} out of 100`}
                  />
                </div>
                {(size === 'lg' || isExpanded) && displayDescription && (
                  <p className={cn('mt-1.5 text-slate leading-relaxed', styles.description)}>
                    {displayDescription}
                  </p>
                )}
                {isExpanded && weight !== undefined && (
                  <p className={cn('mt-1 text-slate italic', styles.description)}>
                    Contributes {Math.round(score * weight * 10) / 10} points to overall score
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Score Legend */}
        {size === 'lg' && (
          <div className="mt-6 flex flex-wrap gap-4 border-t border-stone pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-verification-green" />
              <span className="text-xs text-slate">90+: Exceptional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-clarus-navy" />
              <span className="text-xs text-slate">70-89: Strong</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate" />
              <span className="text-xs text-slate">50-69: Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-alert-amber" />
              <span className="text-xs text-slate">&lt;50: Developing</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ScoreBreakdown.displayName = 'ScoreBreakdown';
