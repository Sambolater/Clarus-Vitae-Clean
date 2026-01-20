'use client';

import { cn } from '@clarus-vitae/utils';
import { useState, type FormEvent } from 'react';

import type {
  BudgetRange,
  InquiryFormErrors,
  InquiryInput,
} from '@clarus-vitae/types';

import { Input } from '../Form/Input';
import { Textarea } from '../Form/Textarea';
import { Select } from '../Form/Select';
import { Button } from '../Button/Button';
import { Alert } from '../Feedback/Alert';
import { ConsentCheckboxes } from './ConsentCheckboxes';
import { PrivacyNote } from './PrivacyNote';
import { FocusAreaSelector } from './FocusAreaSelector';

// ============================================
// TYPES
// ============================================

export interface InquiryFormProperty {
  id: string;
  name: string;
  slug: string;
}

export interface InquiryFormProgram {
  id: string;
  name: string;
}

export interface InquiryFormProps {
  property: InquiryFormProperty;
  program?: InquiryFormProgram;
  variant?: 'modal' | 'inline' | 'page';
  onSuccess?: (inquiryId: string) => void;
  onSecureInquiryClick?: () => void;
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================

const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'UNDER_5K', label: 'Under $5,000' },
  { value: 'FIVE_TO_10K', label: '$5,000 - $10,000' },
  { value: 'TEN_TO_25K', label: '$10,000 - $25,000' },
  { value: 'TWENTYFIVE_TO_50K', label: '$25,000 - $50,000' },
  { value: 'FIFTY_TO_100K', label: '$50,000 - $100,000' },
  { value: 'OVER_100K', label: '$100,000+' },
];

// ============================================
// COMPONENT
// ============================================

/**
 * Standard inquiry form for contacting properties.
 * Privacy-focused with clear consent requirements.
 */
export function InquiryForm({
  property,
  program,
  variant = 'inline',
  onSuccess,
  onSecureInquiryClick,
  className,
}: InquiryFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredDates: '',
    budgetRange: '' as BudgetRange | '',
    primaryGoals: [] as string[],
    consentContactProperty: false,
    consentFollowup: false,
    privacyPolicyAccepted: false,
  });

  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: InquiryFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[\d\s\-()]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.consentContactProperty) {
      newErrors.consentContactProperty = 'You must consent to share your contact information';
    }

    if (!formData.privacyPolicyAccepted) {
      newErrors.privacyPolicyAccepted = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const inquiryData: InquiryInput = {
        propertyId: property.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message || undefined,
        preferredDates: formData.preferredDates || undefined,
        budgetRange: formData.budgetRange || undefined,
        primaryGoals: formData.primaryGoals.length > 0 ? formData.primaryGoals : undefined,
        programId: program?.id,
        consentContactProperty: formData.consentContactProperty,
        consentFollowup: formData.consentFollowup,
        privacyPolicyAccepted: formData.privacyPolicyAccepted,
      };

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      onSuccess?.(result.inquiryId);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input handlers
  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof InquiryFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Property Context */}
      <div className="border-b border-stone pb-4">
        <p className="text-sm text-slate">Inquiring about</p>
        <p className="font-display text-lg font-medium text-clarus-navy">
          {property.name}
        </p>
        {program && (
          <p className="text-sm text-slate mt-1">
            Program: {program.name}
          </p>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Contact Information</h3>

        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          autoComplete="name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          hint="Include country code for international"
          autoComplete="tel"
        />
      </div>

      {/* Inquiry Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Your Inquiry</h3>

        <Textarea
          label="Tell us about your goals"
          name="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="What are you hoping to achieve? Any specific health concerns or interests?"
          hint="Share as much or as little as you're comfortable with"
        />

        <Input
          label="Preferred dates (optional)"
          name="preferredDates"
          value={formData.preferredDates}
          onChange={(e) => handleInputChange('preferredDates', e.target.value)}
          placeholder="e.g., Late March 2026 or flexible"
        />

        <Select
          label="Budget range (optional)"
          name="budgetRange"
          value={formData.budgetRange}
          onChange={(e) => handleInputChange('budgetRange', e.target.value)}
          options={BUDGET_OPTIONS}
        />

        <FocusAreaSelector
          label="Areas of interest (optional)"
          value={formData.primaryGoals}
          onChange={(goals) => handleInputChange('primaryGoals', goals)}
        />
      </div>

      {/* Consent */}
      <ConsentCheckboxes
        propertyName={property.name}
        consentContactProperty={formData.consentContactProperty}
        consentFollowup={formData.consentFollowup}
        privacyPolicyAccepted={formData.privacyPolicyAccepted}
        onConsentContactPropertyChange={(v) => handleInputChange('consentContactProperty', v)}
        onConsentFollowupChange={(v) => handleInputChange('consentFollowup', v)}
        onPrivacyPolicyAcceptedChange={(v) => handleInputChange('privacyPolicyAccepted', v)}
        errors={errors}
      />

      {/* Privacy Note */}
      <PrivacyNote onSecureInquiryClick={onSecureInquiryClick} />

      {/* Submit Error */}
      {submitError && (
        <Alert variant="error" title="Submission Failed">
          {submitError}
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>

        {onSecureInquiryClick && (
          <button
            type="button"
            onClick={onSecureInquiryClick}
            className="text-sm text-slate hover:text-clarus-navy transition-colors text-center"
          >
            Need extra privacy? Use our secure inquiry form
          </button>
        )}
      </div>
    </form>
  );
}

InquiryForm.displayName = 'InquiryForm';
