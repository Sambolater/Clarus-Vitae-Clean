'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewSubmissionForm, type ReviewFormData } from '@clarus-vitae/ui';

interface ReviewWriteClientProps {
  propertyId: string;
  propertyName: string;
  propertyTier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  programs: Array<{ id: string; name: string }>;
}

export function ReviewWriteClient({
  propertyId,
  propertyName,
  propertyTier,
  programs,
}: ReviewWriteClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          programId: data.programId,
          visitDate: data.visitDate,
          stayDuration: data.stayDuration,
          programType: data.programType,
          statedGoals: [],
          isFirstVisit: data.isFirstVisit,
          ratingOverall: data.ratingOverall,
          outcomeRatings: data.outcomeRatings,
          experienceRatings: data.experienceRatings,
          title: data.title,
          reviewText: data.reviewText,
          pros: data.pros.filter((p) => p.trim()),
          cons: data.cons.filter((c) => c.trim()),
          outcomes: data.outcomes,
          displayNamePreference: data.displayNamePreference,
          customDisplayName: data.customDisplayName,
          email: data.email,
          publishConsent: data.publishConsent,
          followUpConsent: data.followUpConsent,
          genuineExperienceConfirm: data.genuineExperienceConfirm,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-verification-green/10 mb-4">
          <svg
            className="h-8 w-8 text-verification-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-clarus-navy mb-2">
          Review Submitted
        </h2>

        <p className="text-slate mb-6 max-w-md mx-auto">
          Thank you for sharing your experience. Please check your email to verify your review.
          Once verified, your review will be published after moderation.
        </p>

        <div className="space-y-3">
          <a
            href={`/properties/${propertyId}`}
            className="block w-full rounded-lg bg-clarus-navy px-6 py-3 font-medium text-white hover:bg-clarus-navy/90 transition-colors"
          >
            Return to Property
          </a>
          <a
            href="/properties"
            className="block w-full rounded-lg bg-stone px-6 py-3 font-medium text-clarus-navy hover:bg-stone/70 transition-colors"
          >
            Browse More Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {submitError && (
        <div className="mb-6 rounded-lg bg-error-red/10 p-4 text-sm text-error-red">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      <ReviewSubmissionForm
        propertyId={propertyId}
        propertyName={propertyName}
        propertyTier={propertyTier}
        programs={programs}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
