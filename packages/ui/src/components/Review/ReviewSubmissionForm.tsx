'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export type PropertyTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export interface Program {
  id: string;
  name: string;
}

export interface ReviewFormData {
  // Step 1: Visit Details
  visitDate: string;
  stayDuration: number;
  programType: string;
  programId?: string;
  isFirstVisit: boolean;

  // Step 2: Ratings
  ratingOverall: number;
  outcomeRatings?: {
    goalAchievement: number;
    protocolQuality: number;
    followupQuality: number;
    physicianEndorsement: number;
  };
  experienceRatings: {
    facilities: number;
    service: number;
    food: number;
    value: number;
  };

  // Step 3: Written Review
  title: string;
  reviewText: string;
  pros: string[];
  cons: string[];

  // Step 4: Measurable Outcomes (Optional)
  outcomes?: {
    biomarkers: Array<{
      name: string;
      before: number;
      after: number;
      unit: string;
    }>;
    biologicalAgeChange?: number;
    weightChange?: number;
    energyLevelChange?: number;
    sleepQualityChange?: number;
    stressLevelChange?: number;
    painLevelChange?: number;
  };

  // Step 5: Contact & Verification
  displayNamePreference: 'initials' | 'verified_guest' | 'custom';
  customDisplayName?: string;
  email: string;
  publishConsent: boolean;
  followUpConsent: boolean;
  genuineExperienceConfirm: boolean;
}

export interface ReviewSubmissionFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  propertyId: string;
  propertyName: string;
  propertyTier: PropertyTier;
  programs?: Program[];
  onSubmit: (data: ReviewFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

// ============================================================================
// Helper Components
// ============================================================================

function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                i + 1 < currentStep
                  ? 'bg-verification-green text-white'
                  : i + 1 === currentStep
                  ? 'bg-clarus-navy text-white'
                  : 'bg-stone text-slate'
              )}
            >
              {i + 1 < currentStep ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'hidden h-1 w-16 sm:block md:w-24',
                  i + 1 < currentStep ? 'bg-verification-green' : 'bg-stone'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate">
        {labels.map((label, i) => (
          <span key={i} className={cn(i + 1 === currentStep && 'font-medium text-clarus-navy')}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
  label,
  description,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
}) {
  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium text-clarus-navy">{label}</span>
        {description && <p className="text-xs text-slate">{description}</p>}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="group"
          >
            <svg
              className={cn(
                'h-8 w-8 transition-colors',
                star <= value
                  ? 'text-clarus-gold'
                  : 'text-stone group-hover:text-clarus-gold/50'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-slate">{value}/5</span>
      </div>
    </div>
  );
}

function ScaleRatingInput({
  value,
  onChange,
  label,
  description,
  leftLabel,
  rightLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-medium text-clarus-navy">{label}</span>
        {description && <p className="text-xs text-slate">{description}</p>}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={cn(
              'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
              val === value
                ? 'bg-clarus-navy text-white'
                : 'bg-stone/50 text-clarus-navy hover:bg-stone'
            )}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ReviewSubmissionForm - Multi-step review submission form.
 *
 * Steps:
 * 1. Visit Details
 * 2. Outcome Ratings (Tier 1 & 2) or Experience Ratings (Tier 3)
 * 3. Written Review
 * 4. Measurable Outcomes (Optional)
 * 5. Contact Info & Verification
 */
export const ReviewSubmissionForm = forwardRef<HTMLFormElement, ReviewSubmissionFormProps>(
  ({ propertyId, propertyName, propertyTier, programs = [], onSubmit, isSubmitting = false, className, ...props }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const stepLabels = ['Visit', 'Ratings', 'Review', 'Outcomes', 'Submit'];

    const isClinicalTier = propertyTier === 'TIER_1' || propertyTier === 'TIER_2';

    // Form state
    const [formData, setFormData] = useState<ReviewFormData>({
      visitDate: '',
      stayDuration: 7,
      programType: '',
      isFirstVisit: true,
      ratingOverall: 0,
      experienceRatings: {
        facilities: 0,
        service: 0,
        food: 0,
        value: 0,
      },
      title: '',
      reviewText: '',
      pros: [''],
      cons: [''],
      displayNamePreference: 'verified_guest',
      email: '',
      publishConsent: false,
      followUpConsent: false,
      genuineExperienceConfirm: false,
    });

    const updateFormData = useCallback(<K extends keyof ReviewFormData>(key: K, value: ReviewFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    // Validation
    const validateStep = (step: number): boolean => {
      switch (step) {
        case 1:
          return !!formData.visitDate && formData.stayDuration > 0 && !!formData.programType;
        case 2:
          return formData.ratingOverall > 0;
        case 3:
          return formData.reviewText.length >= 50;
        case 4:
          return true; // Optional step
        case 5:
          return (
            !!formData.email &&
            formData.publishConsent &&
            formData.genuineExperienceConfirm
          );
        default:
          return true;
      }
    };

    const handleNext = () => {
      if (validateStep(currentStep) && currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    };

    const handlePrevious = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        onSubmit(formData);
      }
    };

    // Add/remove list items
    const addListItem = (field: 'pros' | 'cons') => {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ''],
      }));
    };

    const updateListItem = (field: 'pros' | 'cons', index: number, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    };

    const removeListItem = (field: 'pros' | 'cons', index: number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} className={cn('space-y-6', className)} {...props}>
        {/* Header */}
        <div className="text-center border-b border-stone pb-6">
          <h2 className="text-2xl font-semibold text-clarus-navy">Share Your Experience</h2>
          <p className="text-slate mt-1">
            Review of <span className="font-medium">{propertyName}</span>
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />

        {/* Step 1: Visit Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-clarus-navy">Visit Details</h3>

            {/* Visit Date */}
            <div>
              <label htmlFor="visitDate" className="block text-sm font-medium text-clarus-navy mb-1">
                When did you visit? <span className="text-error-red">*</span>
              </label>
              <input
                type="date"
                id="visitDate"
                value={formData.visitDate}
                onChange={(e) => updateFormData('visitDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                required
              />
            </div>

            {/* Stay Duration */}
            <div>
              <label htmlFor="stayDuration" className="block text-sm font-medium text-clarus-navy mb-1">
                How long was your stay? <span className="text-error-red">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="stayDuration"
                  value={formData.stayDuration}
                  onChange={(e) => updateFormData('stayDuration', parseInt(e.target.value) || 0)}
                  min={1}
                  max={90}
                  className="w-24 rounded-lg border border-stone px-4 py-3 text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  required
                />
                <span className="text-slate">days</span>
              </div>
            </div>

            {/* Program Type */}
            <div>
              <label htmlFor="programType" className="block text-sm font-medium text-clarus-navy mb-1">
                Which program did you complete? <span className="text-error-red">*</span>
              </label>
              {programs.length > 0 ? (
                <select
                  id="programType"
                  value={formData.programId || ''}
                  onChange={(e) => {
                    const program = programs.find((p) => p.id === e.target.value);
                    updateFormData('programId', e.target.value);
                    updateFormData('programType', program?.name || 'General stay');
                  }}
                  className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                  <option value="general">General stay (no specific program)</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="programType"
                  value={formData.programType}
                  onChange={(e) => updateFormData('programType', e.target.value)}
                  placeholder="e.g., Longevity Assessment, Detox Program, General stay"
                  className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  required
                />
              )}
            </div>

            {/* First Visit */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFirstVisit"
                checked={formData.isFirstVisit}
                onChange={(e) => updateFormData('isFirstVisit', e.target.checked)}
                className="h-5 w-5 rounded border-stone text-clarus-navy focus:ring-clarus-navy"
              />
              <label htmlFor="isFirstVisit" className="text-sm text-clarus-navy">
                This was my first visit to this property
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Ratings */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-clarus-navy">Rate Your Experience</h3>

            {/* Overall Rating */}
            <StarRatingInput
              value={formData.ratingOverall}
              onChange={(v) => updateFormData('ratingOverall', v)}
              label="Overall Rating"
              description="How would you rate your overall experience?"
            />

            {/* Outcome Ratings (Tier 1 & 2) */}
            {isClinicalTier && (
              <div className="space-y-4 rounded-lg bg-stone/30 p-4">
                <h4 className="text-sm font-semibold text-clarus-navy">Outcome Ratings</h4>
                <p className="text-xs text-slate">
                  These help future guests understand health outcomes
                </p>

                <ScaleRatingInput
                  value={formData.outcomeRatings?.goalAchievement || 0}
                  onChange={(v) =>
                    updateFormData('outcomeRatings', {
                      ...(formData.outcomeRatings || { goalAchievement: 0, protocolQuality: 0, followupQuality: 0, physicianEndorsement: 0 }),
                      goalAchievement: v,
                    })
                  }
                  label="Goal Achievement"
                  description="Did you achieve your stated health goals?"
                  leftLabel="Far below expectations"
                  rightLabel="Exceeded all expectations"
                />

                <ScaleRatingInput
                  value={formData.outcomeRatings?.protocolQuality || 0}
                  onChange={(v) =>
                    updateFormData('outcomeRatings', {
                      ...(formData.outcomeRatings || { goalAchievement: 0, protocolQuality: 0, followupQuality: 0, physicianEndorsement: 0 }),
                      protocolQuality: v,
                    })
                  }
                  label="Protocol Quality"
                  description="How comprehensive and personalized was your treatment protocol?"
                  leftLabel="Generic, one-size-fits-all"
                  rightLabel="Deeply personalized"
                />

                <ScaleRatingInput
                  value={formData.outcomeRatings?.followupQuality || 0}
                  onChange={(v) =>
                    updateFormData('outcomeRatings', {
                      ...(formData.outcomeRatings || { goalAchievement: 0, protocolQuality: 0, followupQuality: 0, physicianEndorsement: 0 }),
                      followupQuality: v,
                    })
                  }
                  label="Follow-up Quality"
                  description="How useful was the take-home guidance and follow-up support?"
                  leftLabel="Minimal or none"
                  rightLabel="Comprehensive and actionable"
                />

                <ScaleRatingInput
                  value={formData.outcomeRatings?.physicianEndorsement || 0}
                  onChange={(v) =>
                    updateFormData('outcomeRatings', {
                      ...(formData.outcomeRatings || { goalAchievement: 0, protocolQuality: 0, followupQuality: 0, physicianEndorsement: 0 }),
                      physicianEndorsement: v,
                    })
                  }
                  label="Physician Endorsement"
                  description="Would your personal physician endorse this program?"
                  leftLabel="Definitely not"
                  rightLabel="Absolutely, evidence-based"
                />
              </div>
            )}

            {/* Experience Ratings */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-clarus-navy">Experience Ratings</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <StarRatingInput
                  value={formData.experienceRatings.facilities}
                  onChange={(v) =>
                    updateFormData('experienceRatings', { ...formData.experienceRatings, facilities: v })
                  }
                  label="Facilities"
                />
                <StarRatingInput
                  value={formData.experienceRatings.service}
                  onChange={(v) =>
                    updateFormData('experienceRatings', { ...formData.experienceRatings, service: v })
                  }
                  label="Service"
                />
                <StarRatingInput
                  value={formData.experienceRatings.food}
                  onChange={(v) =>
                    updateFormData('experienceRatings', { ...formData.experienceRatings, food: v })
                  }
                  label="Food & Dining"
                />
                <StarRatingInput
                  value={formData.experienceRatings.value}
                  onChange={(v) =>
                    updateFormData('experienceRatings', { ...formData.experienceRatings, value: v })
                  }
                  label="Value for Money"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Written Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-clarus-navy">Share Your Thoughts</h3>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-clarus-navy mb-1">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Summarize your experience in a few words"
                maxLength={100}
                className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
              />
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium text-clarus-navy mb-1">
                Your Experience <span className="text-error-red">*</span>
              </label>
              <textarea
                id="reviewText"
                value={formData.reviewText}
                onChange={(e) => updateFormData('reviewText', e.target.value)}
                rows={6}
                placeholder="Share the details of your experience. What were your goals? Were they met? What made this visit memorable?"
                className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                required
              />
              <p className="mt-1 text-xs text-slate">
                {formData.reviewText.length}/50 minimum characters
                {formData.reviewText.length < 50 && (
                  <span className="text-error-red"> (need {50 - formData.reviewText.length} more)</span>
                )}
              </p>
            </div>

            {/* Pros */}
            <div>
              <label className="block text-sm font-medium text-clarus-navy mb-2">
                What went well?
              </label>
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => updateListItem('pros', index, e.target.value)}
                    placeholder="e.g., Excellent medical staff"
                    className="flex-1 rounded-lg border border-stone px-4 py-2 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  />
                  {formData.pros.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('pros', index)}
                      className="text-slate hover:text-error-red"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {formData.pros.length < 5 && (
                <button
                  type="button"
                  onClick={() => addListItem('pros')}
                  className="text-sm text-clarus-navy hover:text-clarus-gold"
                >
                  + Add another
                </button>
              )}
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-clarus-navy mb-2">
                What could be improved?
              </label>
              {formData.cons.map((con, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => updateListItem('cons', index, e.target.value)}
                    placeholder="e.g., Limited vegetarian options"
                    className="flex-1 rounded-lg border border-stone px-4 py-2 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  />
                  {formData.cons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('cons', index)}
                      className="text-slate hover:text-error-red"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {formData.cons.length < 5 && (
                <button
                  type="button"
                  onClick={() => addListItem('cons')}
                  className="text-sm text-clarus-navy hover:text-clarus-gold"
                >
                  + Add another
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Measurable Outcomes (Optional) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-clarus-navy">Measurable Outcomes</h3>
              <p className="text-sm text-slate">
                Optional: Help future guests by sharing your results. All fields are optional and self-reported.
              </p>
            </div>

            {/* Bio Age Change */}
            <div>
              <label htmlFor="bioAgeChange" className="block text-sm font-medium text-clarus-navy mb-1">
                Biological Age Change (years)
              </label>
              <p className="text-xs text-slate mb-2">
                If you had epigenetic age testing, enter the change (negative = improvement)
              </p>
              <input
                type="number"
                id="bioAgeChange"
                value={formData.outcomes?.biologicalAgeChange || ''}
                onChange={(e) =>
                  updateFormData('outcomes', {
                    ...(formData.outcomes || { biomarkers: [] }),
                    biologicalAgeChange: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                step="0.1"
                placeholder="-2.5"
                className="w-32 rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
              />
            </div>

            {/* Weight Change */}
            <div>
              <label htmlFor="weightChange" className="block text-sm font-medium text-clarus-navy mb-1">
                Weight Change (kg)
              </label>
              <input
                type="number"
                id="weightChange"
                value={formData.outcomes?.weightChange || ''}
                onChange={(e) =>
                  updateFormData('outcomes', {
                    ...(formData.outcomes || { biomarkers: [] }),
                    weightChange: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                step="0.1"
                placeholder="-3.5"
                className="w-32 rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
              />
            </div>

            {/* Subjective Changes */}
            <div className="space-y-4 rounded-lg bg-stone/30 p-4">
              <h4 className="text-sm font-semibold text-clarus-navy">Subjective Improvements</h4>
              <p className="text-xs text-slate">Rate changes on a scale from -5 (much worse) to +5 (much better)</p>

              {[
                { key: 'energyLevelChange' as const, label: 'Energy Level' },
                { key: 'sleepQualityChange' as const, label: 'Sleep Quality' },
                { key: 'stressLevelChange' as const, label: 'Stress Level (negative = less stress)' },
                { key: 'painLevelChange' as const, label: 'Pain Level (negative = less pain)' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm text-clarus-navy">{label}</label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    value={formData.outcomes?.[key] || 0}
                    onChange={(e) =>
                      updateFormData('outcomes', {
                        ...(formData.outcomes || { biomarkers: [] }),
                        [key]: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-stone rounded-lg appearance-none cursor-pointer accent-clarus-navy"
                  />
                  <div className="flex justify-between text-xs text-slate">
                    <span>-5</span>
                    <span className="font-medium text-clarus-navy">
                      {(formData.outcomes?.[key] || 0) > 0 ? '+' : ''}
                      {formData.outcomes?.[key] || 0}
                    </span>
                    <span>+5</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate text-center">
              All outcomes are clearly labeled as "self-reported" when displayed.
            </p>
          </div>
        )}

        {/* Step 5: Contact & Verification */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-clarus-navy">Final Details</h3>

            {/* Display Name Preference */}
            <div>
              <label className="block text-sm font-medium text-clarus-navy mb-2">
                How should we display your name?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'initials' as const, label: 'Initials only (e.g., "J.S.")' },
                  { value: 'verified_guest' as const, label: '"Verified Guest"' },
                  { value: 'custom' as const, label: 'Custom name' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="displayNamePreference"
                      value={option.value}
                      checked={formData.displayNamePreference === option.value}
                      onChange={() => updateFormData('displayNamePreference', option.value)}
                      className="h-4 w-4 border-stone text-clarus-navy focus:ring-clarus-navy"
                    />
                    <span className="text-sm text-clarus-navy">{option.label}</span>
                  </label>
                ))}
              </div>
              {formData.displayNamePreference === 'custom' && (
                <input
                  type="text"
                  value={formData.customDisplayName || ''}
                  onChange={(e) => updateFormData('customDisplayName', e.target.value)}
                  placeholder="Enter display name"
                  className="mt-2 w-full rounded-lg border border-stone px-4 py-2 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                />
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-clarus-navy mb-1">
                Email <span className="text-error-red">*</span>
              </label>
              <p className="text-xs text-slate mb-2">
                For verification only. Your email will be encrypted and never shared.
              </p>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                required
              />
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 rounded-lg bg-stone/30 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.publishConsent}
                  onChange={(e) => updateFormData('publishConsent', e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-stone text-clarus-navy focus:ring-clarus-navy"
                  required
                />
                <span className="text-sm text-clarus-navy">
                  I consent to my review being published on Clarus Vitae <span className="text-error-red">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.followUpConsent}
                  onChange={(e) => updateFormData('followUpConsent', e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-stone text-clarus-navy focus:ring-clarus-navy"
                />
                <span className="text-sm text-clarus-navy">
                  Contact me for follow-up reviews at 30/90/180 days (helps track long-term results)
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.genuineExperienceConfirm}
                  onChange={(e) => updateFormData('genuineExperienceConfirm', e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-stone text-clarus-navy focus:ring-clarus-navy"
                  required
                />
                <span className="text-sm text-clarus-navy">
                  I confirm this review reflects my genuine experience <span className="text-error-red">*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-stone">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={cn(
              'rounded-lg px-6 py-3 font-medium transition-colors',
              currentStep === 1
                ? 'invisible'
                : 'bg-stone text-clarus-navy hover:bg-slate/20'
            )}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className={cn(
                'rounded-lg px-6 py-3 font-medium transition-colors',
                validateStep(currentStep)
                  ? 'bg-clarus-navy text-white hover:bg-clarus-navy/90'
                  : 'bg-stone text-slate cursor-not-allowed'
              )}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={!validateStep(currentStep) || isSubmitting}
              className={cn(
                'rounded-lg px-8 py-3 font-medium transition-colors',
                validateStep(currentStep) && !isSubmitting
                  ? 'bg-clarus-navy text-white hover:bg-clarus-navy/90'
                  : 'bg-stone text-slate cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          )}
        </div>
      </form>
    );
  }
);

ReviewSubmissionForm.displayName = 'ReviewSubmissionForm';
