'use client';

import type {
  BudgetRange,
  BatchInquiryInput,
  InquiryFormErrors,
} from '@clarus-vitae/types';
import { cn } from '@clarus-vitae/utils';
import { useState, type FormEvent } from 'react';

import { Button } from '../Button/Button';
import { Alert } from '../Feedback/Alert';
import { Checkbox } from '../Form/Checkbox';
import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { Textarea } from '../Form/Textarea';
import { ConsentCheckboxes } from './ConsentCheckboxes';
import { FocusAreaSelector } from './FocusAreaSelector';
import { PrivacyNote } from './PrivacyNote';

// ============================================
// TYPES
// ============================================

export interface BatchInquiryProperty {
  id: string;
  name: string;
  slug: string;
  tier?: string;
  overallScore?: number;
}

export interface BatchInquiryFormProps {
  properties: BatchInquiryProperty[];
  onSuccess?: (inquiryIds: string[]) => void;
  onRemoveProperty?: (propertyId: string) => void;
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
 * Batch inquiry form for contacting multiple properties at once.
 * Used from the comparison tool.
 */
export function BatchInquiryForm({
  properties,
  onSuccess,
  onRemoveProperty,
  className,
}: BatchInquiryFormProps) {
  // Property selection state
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(
    new Set(properties.map((p) => p.id))
  );

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

  // Toggle property selection
  const handlePropertyToggle = (propertyId: string) => {
    const newSelected = new Set(selectedPropertyIds);
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId);
    } else {
      newSelected.add(propertyId);
    }
    setSelectedPropertyIds(newSelected);
  };

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

    if (selectedPropertyIds.size === 0) {
      newErrors.general = 'Please select at least one property';
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
      const inquiryData: BatchInquiryInput = {
        propertyIds: Array.from(selectedPropertyIds),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message || undefined,
        preferredDates: formData.preferredDates || undefined,
        budgetRange: formData.budgetRange || undefined,
        primaryGoals: formData.primaryGoals.length > 0 ? formData.primaryGoals : undefined,
        consentContactProperty: formData.consentContactProperty,
        consentFollowup: formData.consentFollowup,
        privacyPolicyAccepted: formData.privacyPolicyAccepted,
      };

      const response = await fetch('/api/inquiries/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit inquiries');
      }

      onSuccess?.(result.inquiryIds);
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
    if (errors[field as keyof InquiryFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedCount = selectedPropertyIds.size;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Header */}
      <div className="border-b border-stone pb-4">
        <h2 className="font-display text-xl font-medium text-clarus-navy">
          Inquire About {selectedCount} {selectedCount === 1 ? 'Property' : 'Properties'}
        </h2>
        <p className="text-sm text-slate mt-1">
          This message will be sent to all selected properties
        </p>
      </div>

      {/* Property Selection */}
      <div className="space-y-3">
        <h3 className="font-medium text-clarus-navy">Send inquiry to:</h3>
        {properties.map((property) => (
          <div
            key={property.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border',
              selectedPropertyIds.has(property.id)
                ? 'border-clarus-navy bg-clarus-navy/5'
                : 'border-stone'
            )}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                label=""
                checked={selectedPropertyIds.has(property.id)}
                onChange={() => handlePropertyToggle(property.id)}
              />
              <div>
                <p className="font-medium text-clarus-navy">{property.name}</p>
                {property.overallScore && (
                  <p className="text-sm text-slate">
                    Clarus Index: {property.overallScore}
                  </p>
                )}
              </div>
            </div>
            {onRemoveProperty && (
              <button
                type="button"
                onClick={() => onRemoveProperty(property.id)}
                className="text-slate hover:text-error-red transition-colors p-1"
                aria-label={`Remove ${property.name}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {errors.general && (
          <p className="text-sm text-error-red" role="alert">
            {errors.general}
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
          autoComplete="tel"
        />
      </div>

      {/* Inquiry Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Your Inquiry</h3>

        <Textarea
          label="Your message"
          name="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Share your goals and what you're looking for. This message will be sent to all selected properties."
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
        propertyName="the selected properties"
        consentContactProperty={formData.consentContactProperty}
        consentFollowup={formData.consentFollowup}
        privacyPolicyAccepted={formData.privacyPolicyAccepted}
        onConsentContactPropertyChange={(v) => handleInputChange('consentContactProperty', v)}
        onConsentFollowupChange={(v) => handleInputChange('consentFollowup', v)}
        onPrivacyPolicyAcceptedChange={(v) => handleInputChange('privacyPolicyAccepted', v)}
        errors={errors}
        isBatch
      />

      {/* Privacy Note */}
      <PrivacyNote />

      {/* Submit Error */}
      {submitError && (
        <Alert variant="error" title="Submission Failed">
          {submitError}
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting || selectedCount === 0}
      >
        {isSubmitting
          ? 'Sending...'
          : `Send to ${selectedCount} ${selectedCount === 1 ? 'Property' : 'Properties'}`}
      </Button>
    </form>
  );
}

BatchInquiryForm.displayName = 'BatchInquiryForm';
