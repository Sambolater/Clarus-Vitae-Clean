'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface BiomarkerChange {
  name: string;
  before: number;
  after: number;
  unit: string;
}

export interface MeasurableOutcomes {
  biomarkers?: BiomarkerChange[];
  biologicalAgeChange?: number;
  weightChange?: number;
  energyLevelChange?: number;
  sleepQualityChange?: number;
  stressLevelChange?: number;
  painLevelChange?: number;
}

export interface MeasurableOutcomesDisplayProps extends HTMLAttributes<HTMLDivElement> {
  outcomes: MeasurableOutcomes;
  showLabel?: boolean;
  compact?: boolean;
}

function getChangeIndicator(
  change: number
): { color: string; bgColor: string; icon: string; label: string } {
  if (change > 0) {
    return {
      color: 'text-verification-green',
      bgColor: 'bg-verification-green/10',
      icon: '↑',
      label: 'Improved',
    };
  }
  if (change < 0) {
    return {
      color: 'text-error-red',
      bgColor: 'bg-error-red/10',
      icon: '↓',
      label: 'Declined',
    };
  }
  return {
    color: 'text-slate',
    bgColor: 'bg-slate/10',
    icon: '→',
    label: 'Unchanged',
  };
}

function formatChange(value: number, suffix: string = ''): string {
  if (value > 0) return `+${value}${suffix}`;
  return `${value}${suffix}`;
}

/**
 * BiomarkerCard component for displaying individual biomarker changes.
 */
function BiomarkerCard({
  biomarker,
  compact,
}: {
  biomarker: BiomarkerChange;
  compact?: boolean;
}) {
  const change = biomarker.after - biomarker.before;
  const percentChange = biomarker.before !== 0
    ? ((change / biomarker.before) * 100).toFixed(1)
    : '0';
  const isImprovement = change < 0; // Most biomarkers, lower is better (though this varies)
  const indicator = getChangeIndicator(isImprovement ? 1 : change < 0 ? -1 : 0);

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-stone/30 px-3 py-2">
        <span className="text-sm font-medium text-clarus-navy">{biomarker.name}</span>
        <span className={cn('text-sm font-mono', indicator.color)}>
          {formatChange(change, biomarker.unit)}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone p-3">
      <div className="mb-2 text-sm font-medium text-clarus-navy">{biomarker.name}</div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-slate">
          <div>Before: {biomarker.before} {biomarker.unit}</div>
          <div>After: {biomarker.after} {biomarker.unit}</div>
        </div>
        <div className={cn('text-right font-semibold', indicator.color)}>
          <div className="text-lg">{formatChange(change, ` ${biomarker.unit}`)}</div>
          <div className="text-xs opacity-75">({percentChange}%)</div>
        </div>
      </div>
    </div>
  );
}

/**
 * SubjectiveChangeItem component for displaying subjective improvement metrics.
 */
function SubjectiveChangeItem({
  label,
  change,
  compact,
}: {
  label: string;
  change: number;
  compact?: boolean;
}) {
  const indicator = getChangeIndicator(change);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', indicator.bgColor)}>
        <span className="text-xs font-mono">{indicator.icon}</span>
        <span className="text-xs text-clarus-navy">{label}</span>
        <span className={cn('text-xs font-semibold', indicator.color)}>
          {formatChange(change)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-stone/30 px-3 py-2">
      <span className="text-sm text-clarus-navy">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn('font-mono text-lg', indicator.color)}>
          {indicator.icon}
        </span>
        <span className={cn('text-sm font-semibold', indicator.color)}>
          {formatChange(change)}
        </span>
      </div>
    </div>
  );
}

/**
 * MeasurableOutcomesDisplay component for showing self-reported health outcomes.
 *
 * Features:
 * - Biomarker changes with before/after comparisons
 * - Biological age and weight changes
 * - Subjective improvements (energy, sleep, stress, pain)
 * - Clear "self-reported" labeling for transparency
 */
export const MeasurableOutcomesDisplay = forwardRef<HTMLDivElement, MeasurableOutcomesDisplayProps>(
  ({ outcomes, showLabel = true, compact = false, className, ...props }, ref) => {
    const hasOutcomes =
      outcomes.biomarkers?.length ||
      outcomes.biologicalAgeChange !== undefined ||
      outcomes.weightChange !== undefined ||
      outcomes.energyLevelChange !== undefined ||
      outcomes.sleepQualityChange !== undefined ||
      outcomes.stressLevelChange !== undefined ||
      outcomes.painLevelChange !== undefined;

    if (!hasOutcomes) return null;

    const subjectiveChanges = [
      { key: 'energy', label: 'Energy Level', value: outcomes.energyLevelChange },
      { key: 'sleep', label: 'Sleep Quality', value: outcomes.sleepQualityChange },
      { key: 'stress', label: 'Stress Level', value: outcomes.stressLevelChange },
      { key: 'pain', label: 'Pain Level', value: outcomes.painLevelChange },
    ].filter((item) => item.value !== undefined);

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* Header */}
        {showLabel && (
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-clarus-navy">Reported Outcomes</h4>
            <span className="rounded-full bg-stone px-2 py-0.5 text-xs text-slate">
              self-reported
            </span>
          </div>
        )}

        {/* Key Metrics (Bio Age & Weight) */}
        {(outcomes.biologicalAgeChange !== undefined || outcomes.weightChange !== undefined) && (
          <div className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
            {outcomes.biologicalAgeChange !== undefined && (
              <div className={cn(
                'rounded-lg p-4',
                outcomes.biologicalAgeChange < 0 ? 'bg-verification-green/10' : 'bg-stone/30'
              )}>
                <div className="text-xs text-slate uppercase tracking-wider mb-1">
                  Biological Age
                </div>
                <div className={cn(
                  'text-2xl font-semibold',
                  outcomes.biologicalAgeChange < 0 ? 'text-verification-green' : 'text-clarus-navy'
                )}>
                  {formatChange(outcomes.biologicalAgeChange, ' years')}
                </div>
              </div>
            )}
            {outcomes.weightChange !== undefined && (
              <div className="rounded-lg bg-stone/30 p-4">
                <div className="text-xs text-slate uppercase tracking-wider mb-1">
                  Weight Change
                </div>
                <div className="text-2xl font-semibold text-clarus-navy">
                  {formatChange(outcomes.weightChange, ' kg')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Biomarkers */}
        {outcomes.biomarkers && outcomes.biomarkers.length > 0 && (
          <div>
            {!compact && (
              <h5 className="text-xs text-slate uppercase tracking-wider mb-2">
                Biomarker Changes
              </h5>
            )}
            <div className={cn(
              'grid gap-2',
              compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            )}>
              {outcomes.biomarkers.map((biomarker, index) => (
                <BiomarkerCard key={index} biomarker={biomarker} compact={compact} />
              ))}
            </div>
          </div>
        )}

        {/* Subjective Changes */}
        {subjectiveChanges.length > 0 && (
          <div>
            {!compact && (
              <h5 className="text-xs text-slate uppercase tracking-wider mb-2">
                Subjective Improvements
              </h5>
            )}
            <div className={cn(
              compact ? 'flex flex-wrap gap-2' : 'grid gap-2 grid-cols-1 sm:grid-cols-2'
            )}>
              {subjectiveChanges.map((item) => (
                <SubjectiveChangeItem
                  key={item.key}
                  label={item.label}
                  change={item.value!}
                  compact={compact}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MeasurableOutcomesDisplay.displayName = 'MeasurableOutcomesDisplay';
