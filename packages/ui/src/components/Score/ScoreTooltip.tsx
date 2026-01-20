import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react';

export type PropertyTier = 'medical_longevity' | 'integrated_wellness' | 'luxury_destination';

export interface ScoreTooltipProps extends HTMLAttributes<HTMLDivElement> {
  dimension: string;
  score: number;
  weight: number;
  tier: PropertyTier;
  tierAverage?: number;
  children: React.ReactNode;
}

const dimensionData: Record<
  string,
  {
    label: string;
    descriptions: Partial<Record<PropertyTier, string>>;
  }
> = {
  // Tier 1 dimensions
  clinicalRigor: {
    label: 'Clinical Rigor',
    descriptions: {
      medical_longevity:
        'Evaluates medical credentials, diagnostic depth, evidence-based protocols, and physician-to-patient ratios. Higher scores indicate more rigorous clinical oversight.',
    },
  },
  outcomeEvidence: {
    label: 'Outcome Evidence',
    descriptions: {
      medical_longevity:
        'Measures published results, guest-reported outcomes, and quality of follow-up protocols. Based on documented health improvements.',
      integrated_wellness:
        'Evaluates guest-reported wellness outcomes and evidence of program effectiveness.',
    },
  },
  programDepth: {
    label: 'Program Depth',
    descriptions: {
      medical_longevity:
        'Assesses comprehensiveness, customization options, and available duration choices. Deeper programs score higher.',
      integrated_wellness:
        'Measures the range and depth of wellness programming available.',
    },
  },
  // Tier 2 dimensions
  programEffectiveness: {
    label: 'Program Effectiveness',
    descriptions: {
      integrated_wellness:
        'Combines guest-reported outcomes with expert assessment of program design and delivery.',
    },
  },
  holisticIntegration: {
    label: 'Holistic Integration',
    descriptions: {
      integrated_wellness:
        'Evaluates how well clinical and holistic wellness elements combine into a cohesive experience.',
    },
  },
  practitionerQuality: {
    label: 'Practitioner Quality',
    descriptions: {
      integrated_wellness:
        'Assesses credentials, experience levels, and guest feedback on individual practitioners.',
    },
  },
  // Tier 3 dimensions
  wellnessDepth: {
    label: 'Wellness Offering Depth',
    descriptions: {
      luxury_destination:
        'Measures the range and quality of treatments available, as well as practitioner skill levels.',
    },
  },
  transformativePotential: {
    label: 'Transformative Potential',
    descriptions: {
      luxury_destination:
        'Evaluates whether a stay can create lasting positive change beyond immediate relaxation.',
    },
  },
  settingEnvironment: {
    label: 'Setting & Environment',
    descriptions: {
      luxury_destination:
        'Assesses location quality, natural surroundings, and the overall sense of escape.',
    },
  },
  // Shared dimensions
  experienceQuality: {
    label: 'Experience Quality',
    descriptions: {
      medical_longevity:
        'Evaluates facilities, service standards, accommodation quality, and dining.',
      integrated_wellness:
        'Assesses the overall quality of facilities, service, accommodation, and dining.',
      luxury_destination:
        'Measures facilities quality, service excellence, ambiance, and accommodation standards.',
    },
  },
  valueAlignment: {
    label: 'Value Alignment',
    descriptions: {
      medical_longevity:
        'Assesses whether the price reflects the quality and outcomes delivered.',
      integrated_wellness:
        'Evaluates price relative to the wellness value and outcomes provided.',
      luxury_destination:
        'Measures whether the luxury experience justifies the investment.',
    },
  },
};

function getScoreLevel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: 'Exceptional', color: 'text-verification-green' };
  if (score >= 75) return { label: 'Strong', color: 'text-clarus-navy' };
  if (score >= 60) return { label: 'Good', color: 'text-slate' };
  if (score >= 45) return { label: 'Developing', color: 'text-alert-amber' };
  return { label: 'Needs Improvement', color: 'text-error-red' };
}

function getComparisonText(score: number, average: number): string {
  const diff = score - average;
  if (diff >= 10) return 'Well above average';
  if (diff >= 3) return 'Above average';
  if (diff >= -3) return 'Average';
  if (diff >= -10) return 'Below average';
  return 'Well below average';
}

/**
 * ScoreTooltip component provides contextual information about a score dimension.
 *
 * Shows on hover/focus with details about what the dimension measures,
 * the score interpretation, weight in calculation, and comparison to tier average.
 */
export const ScoreTooltip = forwardRef<HTMLDivElement, ScoreTooltipProps>(
  (
    { dimension, score, weight, tier, tierAverage, children, className, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('top');
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Determine tooltip position based on available space
    useEffect(() => {
      if (isVisible && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        // Prefer top, but use bottom if not enough space
        if (spaceAbove < 200 && spaceBelow > spaceAbove) {
          setPosition('bottom');
        } else {
          setPosition('top');
        }
      }
    }, [isVisible]);

    const dimData = dimensionData[dimension];
    const label = dimData?.label || dimension;
    const description = dimData?.descriptions[tier] || `Measures ${label.toLowerCase()} performance.`;
    const scoreLevel = getScoreLevel(score);
    const contribution = Math.round(score * weight * 10) / 10;

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        {...props}
      >
        {/* Trigger */}
        <div
          ref={triggerRef}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
          tabIndex={0}
          role="button"
          aria-describedby={isVisible ? `tooltip-${dimension}` : undefined}
        >
          {children}
        </div>

        {/* Tooltip */}
        {isVisible && (
          <div
            ref={tooltipRef}
            id={`tooltip-${dimension}`}
            role="tooltip"
            className={cn(
              'absolute z-50 w-72 rounded-lg border border-stone bg-white p-4 shadow-lg',
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'left-1/2 -translate-x-1/2'
            )}
          >
            {/* Arrow */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border bg-white',
                position === 'top'
                  ? 'top-full -mt-1 border-b border-r border-stone'
                  : 'bottom-full -mb-1 border-t border-l border-stone'
              )}
            />

            {/* Content */}
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-clarus-navy">{label}</h4>
                  <p className={cn('text-xs font-medium', scoreLevel.color)}>
                    {scoreLevel.label}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl text-clarus-gold">{score}</span>
                  <span className="text-sm text-slate">/100</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate leading-relaxed">{description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone">
                <div>
                  <p className="text-[10px] text-slate uppercase tracking-wide">Weight</p>
                  <p className="text-sm font-medium text-clarus-navy">
                    {Math.round(weight * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate uppercase tracking-wide">Contribution</p>
                  <p className="text-sm font-medium text-clarus-navy">
                    {contribution} pts
                  </p>
                </div>
              </div>

              {/* Tier comparison */}
              {tierAverage !== undefined && (
                <div className="pt-2 border-t border-stone">
                  <p className="text-[10px] text-slate uppercase tracking-wide">
                    vs. Tier Average ({tierAverage})
                  </p>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      score > tierAverage
                        ? 'text-verification-green'
                        : score < tierAverage
                        ? 'text-alert-amber'
                        : 'text-slate'
                    )}
                  >
                    {getComparisonText(score, tierAverage)}
                    {score !== tierAverage && (
                      <span className="ml-1">
                        ({score > tierAverage ? '+' : ''}
                        {score - tierAverage})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ScoreTooltip.displayName = 'ScoreTooltip';
