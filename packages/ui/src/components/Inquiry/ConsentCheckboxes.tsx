'use client';

import Link from 'next/link';

import type { InquiryFormErrors } from '@clarus-vitae/types';

import { Checkbox } from '../Form/Checkbox';

// ============================================
// TYPES
// ============================================

export interface ConsentCheckboxesProps {
  propertyName: string;
  consentContactProperty: boolean;
  consentFollowup: boolean;
  privacyPolicyAccepted: boolean;
  onConsentContactPropertyChange: (value: boolean) => void;
  onConsentFollowupChange: (value: boolean) => void;
  onPrivacyPolicyAcceptedChange: (value: boolean) => void;
  errors?: Pick<InquiryFormErrors, 'consentContactProperty' | 'privacyPolicyAccepted'>;
  isBatch?: boolean;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Consent checkboxes for inquiry forms.
 * Ensures GDPR compliance with clear consent requirements.
 */
export function ConsentCheckboxes({
  propertyName,
  consentContactProperty,
  consentFollowup,
  privacyPolicyAccepted,
  onConsentContactPropertyChange,
  onConsentFollowupChange,
  onPrivacyPolicyAcceptedChange,
  errors,
  isBatch = false,
}: ConsentCheckboxesProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-clarus-navy">Consent</h3>

      {/* Required: Contact property consent */}
      <Checkbox
        id="consent-contact-property"
        label={
          isBatch
            ? 'I consent to sharing my contact information with the selected properties so they can respond to my inquiry.'
            : `I consent to sharing my contact information with ${propertyName} so they can respond to my inquiry.`
        }
        checked={consentContactProperty}
        onChange={(e) => onConsentContactPropertyChange(e.target.checked)}
        error={errors?.consentContactProperty}
        description="Required"
      />

      {/* Required: Privacy policy acceptance */}
      <Checkbox
        id="consent-privacy-policy"
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
        checked={privacyPolicyAccepted}
        onChange={(e) => onPrivacyPolicyAcceptedChange(e.target.checked)}
        error={errors?.privacyPolicyAccepted}
        description="Required"
      />

      {/* Optional: Follow-up consent */}
      <Checkbox
        id="consent-followup"
        label="Clarus Vitae may contact me for feedback after my visit"
        checked={consentFollowup}
        onChange={(e) => onConsentFollowupChange(e.target.checked)}
        description="Optional - helps us improve our recommendations"
      />

      {/* Privacy policy summary */}
      <p className="text-sm text-slate">
        By submitting this inquiry, your information will be encrypted and only
        shared with the specific property you are inquiring about. We never sell
        your data to third parties.
      </p>
    </div>
  );
}

ConsentCheckboxes.displayName = 'ConsentCheckboxes';
