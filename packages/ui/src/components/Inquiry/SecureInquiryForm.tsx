'use client';

import { cn } from '@clarus-vitae/utils';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import type {
  ContactMethod,
  InquiryFormErrors,
  SecureInquiryInput,
} from '@clarus-vitae/types';

import { Input } from '../Form/Input';
import { Textarea } from '../Form/Textarea';
import { RadioGroup } from '../Form/RadioGroup';
import { Checkbox } from '../Form/Checkbox';
import { Button } from '../Button/Button';
import { Alert } from '../Feedback/Alert';
import { FocusAreaSelector } from './FocusAreaSelector';

// ============================================
// TYPES
// ============================================

export interface SecureInquiryFormProperty {
  id: string;
  name: string;
  slug: string;
}

export interface SecureInquiryFormProps {
  property: SecureInquiryFormProperty;
  onSuccess?: (inquiryId: string) => void;
  onBackToStandard?: () => void;
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================

const CONTACT_METHOD_OPTIONS = [
  {
    value: 'EMAIL',
    label: 'Encrypted Email',
    description: 'Your email will be encrypted',
  },
  {
    value: 'SIGNAL',
    label: 'Signal',
    description: 'Most secure - end-to-end encrypted',
  },
  {
    value: 'SECURE_EMAIL',
    label: 'Secure Callback',
    description: 'We will call you from a private number',
  },
];

// ============================================
// ICONS
// ============================================

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

// ============================================
// COMPONENT
// ============================================

/**
 * Enhanced privacy inquiry form.
 * For sensitive situations requiring extra discretion.
 */
export function SecureInquiryForm({
  property,
  onSuccess,
  onBackToStandard,
  className,
}: SecureInquiryFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: 'EMAIL' as ContactMethod,
    contactValue: '',
    message: '',
    primaryGoals: [] as string[],
    autoDelete: true,
    noFollowup: true,
    consentContactProperty: false,
    privacyPolicyAccepted: false,
  });

  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get placeholder for contact value based on method
  const getContactPlaceholder = (): string => {
    switch (formData.contactMethod) {
      case 'EMAIL':
      case 'SECURE_EMAIL':
        return 'your@email.com';
      case 'SIGNAL':
        return '+1 555 123 4567 or @username';
      case 'PHONE':
        return '+1 555 123 4567';
      default:
        return '';
    }
  };

  const getContactLabel = (): string => {
    switch (formData.contactMethod) {
      case 'EMAIL':
      case 'SECURE_EMAIL':
        return 'Email Address';
      case 'SIGNAL':
        return 'Signal Number or Username';
      case 'PHONE':
        return 'Phone Number';
      default:
        return 'Contact';
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: InquiryFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name or pseudonym is required';
    }

    if (!formData.contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required';
    } else if (
      (formData.contactMethod === 'EMAIL' || formData.contactMethod === 'SECURE_EMAIL') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactValue)
    ) {
      newErrors.contactValue = 'Please enter a valid email address';
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
      const inquiryData: SecureInquiryInput = {
        propertyId: property.id,
        name: formData.name,
        contactMethod: formData.contactMethod,
        contactValue: formData.contactValue,
        message: formData.message || undefined,
        primaryGoals: formData.primaryGoals.length > 0 ? formData.primaryGoals : undefined,
        autoDelete: formData.autoDelete,
        noFollowup: formData.noFollowup,
        consentContactProperty: formData.consentContactProperty,
        privacyPolicyAccepted: formData.privacyPolicyAccepted,
      };

      const response = await fetch('/api/inquiries/secure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit secure inquiry');
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
      {/* Enhanced Privacy Explanation */}
      <div className="rounded-lg border border-clarus-navy/20 bg-clarus-navy/5 p-4">
        <div className="flex items-start gap-3">
          <LockIcon className="h-5 w-5 flex-shrink-0 text-clarus-navy mt-0.5" />
          <div>
            <h3 className="font-medium text-clarus-navy">Enhanced Privacy Inquiry</h3>
            <ul className="mt-2 space-y-1 text-sm text-clarus-navy/80">
              <li>Your inquiry is encrypted end-to-end</li>
              <li>We store minimal data</li>
              <li>Auto-deletion available after 7 days</li>
              <li>Alternative contact methods supported</li>
              <li>No tracking of this page visit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property Context */}
      <div className="border-b border-stone pb-4">
        <p className="text-sm text-slate">Secure inquiry about</p>
        <p className="font-display text-lg font-medium text-clarus-navy">
          {property.name}
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Contact Information</h3>

        <Input
          label="Name or Pseudonym"
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          required
          hint="You may use a pseudonym for additional privacy"
        />

        <RadioGroup
          label="Preferred Contact Method"
          name="contactMethod"
          value={formData.contactMethod}
          onChange={(value) => handleInputChange('contactMethod', value)}
          options={CONTACT_METHOD_OPTIONS}
        />

        <Input
          label={getContactLabel()}
          name="contactValue"
          value={formData.contactValue}
          onChange={(e) => handleInputChange('contactValue', e.target.value)}
          error={errors.contactValue}
          placeholder={getContactPlaceholder()}
          required
        />
      </div>

      {/* Inquiry Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Your Inquiry</h3>

        <Textarea
          label="Your inquiry (encrypted)"
          name="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Share only what you're comfortable sharing"
        />

        <FocusAreaSelector
          label="Areas of interest (optional)"
          value={formData.primaryGoals}
          onChange={(goals) => handleInputChange('primaryGoals', goals)}
        />
      </div>

      {/* Enhanced Privacy Options */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Privacy Options</h3>

        <Checkbox
          label="Auto-delete inquiry after property contact (7 days)"
          checked={formData.autoDelete}
          onChange={(e) => handleInputChange('autoDelete', e.target.checked)}
          description="Your data will be permanently deleted after 7 days"
        />

        <Checkbox
          label="Do not contact me for any follow-up"
          checked={formData.noFollowup}
          onChange={(e) => handleInputChange('noFollowup', e.target.checked)}
          description="We will only share your inquiry with the property"
        />
      </div>

      {/* Consent */}
      <div className="space-y-4">
        <h3 className="font-medium text-clarus-navy">Consent</h3>

        <Checkbox
          label={`I consent to sharing my contact information with ${property.name} so they can respond to my inquiry.`}
          checked={formData.consentContactProperty}
          onChange={(e) => handleInputChange('consentContactProperty', e.target.checked)}
          error={errors.consentContactProperty}
          description="Required"
        />

        <Checkbox
          label={
            <span>
              I have read and accept the{' '}
              <Link
                href="/privacy"
                className="text-clarus-navy underline hover:text-clarus-navy/80"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </span>
          }
          checked={formData.privacyPolicyAccepted}
          onChange={(e) => handleInputChange('privacyPolicyAccepted', e.target.checked)}
          error={errors.privacyPolicyAccepted}
          description="Required"
        />
      </div>

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
          {isSubmitting ? 'Sending Securely...' : 'Send Secure Inquiry'}
        </Button>

        {onBackToStandard && (
          <button
            type="button"
            onClick={onBackToStandard}
            className="text-sm text-slate hover:text-clarus-navy transition-colors text-center"
          >
            Use standard inquiry form instead
          </button>
        )}
      </div>
    </form>
  );
}

SecureInquiryForm.displayName = 'SecureInquiryForm';
