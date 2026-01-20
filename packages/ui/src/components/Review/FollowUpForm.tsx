'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState } from 'react';

export type ResultsSustainedLevel = 'fully' | 'mostly' | 'partially' | 'not_sustained';

export interface FollowUpFormData {
  resultsSustained: ResultsSustainedLevel;
  notes: string;
  updatedOutcomes?: {
    energyLevelChange?: number;
    sleepQualityChange?: number;
    stressLevelChange?: number;
    painLevelChange?: number;
  };
}

export interface FollowUpFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  followUpPeriod: '30' | '90' | '180';
  originalVisitDate: Date;
  onSubmit: (data: FollowUpFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

const SUSTAINED_OPTIONS: Array<{
  value: ResultsSustainedLevel;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'fully',
    label: 'Fully Sustained',
    description: 'Still experiencing all benefits',
    icon: '✓✓',
  },
  {
    value: 'mostly',
    label: 'Mostly Sustained',
    description: 'Most benefits continue',
    icon: '✓',
  },
  {
    value: 'partially',
    label: 'Partially Sustained',
    description: 'Some benefits have faded',
    icon: '~',
  },
  {
    value: 'not_sustained',
    label: 'Not Sustained',
    description: 'Benefits have faded',
    icon: '✗',
  },
];

/**
 * Slider input for subjective metrics.
 */
function SubjectiveSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  const [isActive, setIsActive] = useState(value !== undefined);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-clarus-navy">{label}</label>
        <button
          type="button"
          onClick={() => {
            setIsActive(!isActive);
            if (isActive) onChange(undefined);
            else onChange(0);
          }}
          className="text-xs text-slate hover:text-clarus-navy"
        >
          {isActive ? 'Remove' : 'Add'}
        </button>
      </div>
      {isActive && (
        <div className="space-y-1">
          <input
            type="range"
            min="-5"
            max="5"
            value={value || 0}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-stone rounded-lg appearance-none cursor-pointer accent-clarus-navy"
          />
          <div className="flex justify-between text-xs text-slate">
            <span>Much Worse (-5)</span>
            <span className={cn(
              'font-medium',
              (value || 0) > 0 ? 'text-verification-green' : (value || 0) < 0 ? 'text-error-red' : 'text-slate'
            )}>
              {(value || 0) > 0 ? '+' : ''}{value || 0}
            </span>
            <span>Much Better (+5)</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FollowUpForm component for collecting 30/90/180 day follow-up reviews.
 *
 * Features:
 * - Results sustainability selection
 * - Optional updated outcome metrics
 * - Notes field for additional context
 * - Streamlined, focused design
 */
export const FollowUpForm = forwardRef<HTMLFormElement, FollowUpFormProps>(
  ({ followUpPeriod, originalVisitDate, onSubmit, isSubmitting = false, className, ...props }, ref) => {
    const [resultsSustained, setResultsSustained] = useState<ResultsSustainedLevel | null>(null);
    const [notes, setNotes] = useState('');
    const [updatedOutcomes, setUpdatedOutcomes] = useState<FollowUpFormData['updatedOutcomes']>({});

    const periodLabel = followUpPeriod === '30' ? '30-day' : followUpPeriod === '90' ? '90-day' : '6-month';
    const targetDate = new Date(originalVisitDate);
    targetDate.setDate(targetDate.getDate() + parseInt(followUpPeriod));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!resultsSustained) return;

      onSubmit({
        resultsSustained,
        notes,
        updatedOutcomes: Object.keys(updatedOutcomes || {}).length > 0 ? updatedOutcomes : undefined,
      });
    };

    const updateOutcome = (key: keyof NonNullable<FollowUpFormData['updatedOutcomes']>, value: number | undefined) => {
      setUpdatedOutcomes((prev) => {
        const updated = { ...prev };
        if (value === undefined) {
          delete updated[key];
        } else {
          updated[key] = value;
        }
        return updated;
      });
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className={cn('space-y-6', className)} {...props}>
        {/* Header */}
        <div className="text-center pb-4 border-b border-stone">
          <h2 className="text-xl font-semibold text-clarus-navy">
            {periodLabel} Follow-Up
          </h2>
          <p className="text-sm text-slate mt-1">
            How are your results holding up since your visit?
          </p>
        </div>

        {/* Results Sustainability */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-clarus-navy">
            How well have your results sustained? <span className="text-error-red">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUSTAINED_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setResultsSustained(option.value)}
                className={cn(
                  'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                  resultsSustained === option.value
                    ? 'border-clarus-navy bg-clarus-navy/5'
                    : 'border-stone hover:border-slate'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    option.value === 'fully'
                      ? 'bg-verification-green/20 text-verification-green'
                      : option.value === 'mostly'
                      ? 'bg-clarus-navy/20 text-clarus-navy'
                      : option.value === 'partially'
                      ? 'bg-clarus-gold/20 text-clarus-gold'
                      : 'bg-slate/20 text-slate'
                  )}
                >
                  {option.icon}
                </span>
                <div>
                  <div className="font-medium text-clarus-navy">{option.label}</div>
                  <div className="text-sm text-slate">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Updated Outcomes (Optional) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-clarus-navy">
              Update Your Outcomes <span className="text-xs text-slate font-normal">(optional)</span>
            </h3>
            <p className="text-xs text-slate mt-1">
              Track how specific areas have changed since your visit
            </p>
          </div>

          <div className="space-y-4 rounded-lg bg-stone/30 p-4">
            <SubjectiveSlider
              label="Energy Level"
              value={updatedOutcomes?.energyLevelChange}
              onChange={(v) => updateOutcome('energyLevelChange', v)}
            />
            <SubjectiveSlider
              label="Sleep Quality"
              value={updatedOutcomes?.sleepQualityChange}
              onChange={(v) => updateOutcome('sleepQualityChange', v)}
            />
            <SubjectiveSlider
              label="Stress Level"
              value={updatedOutcomes?.stressLevelChange}
              onChange={(v) => updateOutcome('stressLevelChange', v)}
            />
            <SubjectiveSlider
              label="Pain Level"
              value={updatedOutcomes?.painLevelChange}
              onChange={(v) => updateOutcome('painLevelChange', v)}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="followup-notes" className="block text-sm font-medium text-clarus-navy">
            Additional Notes
          </label>
          <textarea
            id="followup-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Share any additional thoughts on your long-term experience..."
            className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!resultsSustained || isSubmitting}
          className={cn(
            'w-full rounded-lg bg-clarus-navy px-6 py-3 font-medium text-white transition-colors',
            'hover:bg-clarus-navy/90 focus:outline-none focus:ring-2 focus:ring-clarus-navy focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Follow-Up'}
        </button>

        {/* Privacy note */}
        <p className="text-xs text-slate text-center">
          Your follow-up helps future guests understand long-term results.
          All data is kept confidential and used only in aggregate.
        </p>
      </form>
    );
  }
);

FollowUpForm.displayName = 'FollowUpForm';
