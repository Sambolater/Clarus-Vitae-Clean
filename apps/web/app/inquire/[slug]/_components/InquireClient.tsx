'use client';

import {
  InquiryForm,
  SecureInquiryForm,
  InquiryConfirmation,
  TabNav,
} from '@clarus-vitae/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

interface InquireClientProps {
  property: {
    id: string;
    name: string;
    slug: string;
  };
  programs: Array<{
    id: string;
    name: string;
  }>;
  featuredImage: {
    url: string;
    alt: string;
  } | null;
}

type InquiryMode = 'standard' | 'secure';

// ============================================
// COMPONENT
// ============================================

export function InquireClient({
  property,
  programs,
  featuredImage,
}: InquireClientProps) {
  const router = useRouter();
  const [mode, setMode] = useState<InquiryMode>('standard');
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');

  // Handle successful submission
  const handleSuccess = (inquiryId: string, email?: string) => {
    setSubmittedInquiryId(inquiryId);
    if (email) {
      setSubmittedEmail(email);
    }
  };

  // If submitted, show confirmation
  if (submittedInquiryId) {
    return (
      <InquiryConfirmation
        inquiryId={submittedInquiryId}
        propertyName={property.name}
        propertySlug={property.slug}
        email={submittedEmail}
        isSecure={mode === 'secure'}
        onClose={() => router.push(`/properties/${property.slug}`)}
      />
    );
  }

  const tabs = [
    {
      id: 'standard',
      label: 'Standard Inquiry',
      href: '#standard',
    },
    {
      id: 'secure',
      label: 'Secure Inquiry',
      href: '#secure',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      {featuredImage && (
        <div className="aspect-video rounded-lg overflow-hidden bg-warm-gray">
          <img
            src={featuredImage.url}
            alt={featuredImage.alt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Mode Tabs */}
      <TabNav
        tabs={tabs}
        activeTab={mode}
        onTabChange={(tabId) => setMode(tabId as InquiryMode)}
      />

      {/* Form */}
      <div className="bg-white rounded-lg border border-stone p-6">
        {mode === 'standard' ? (
          <InquiryForm
            property={property}
            program={programs.length === 1 ? programs[0] : undefined}
            variant="page"
            onSuccess={(inquiryId) => handleSuccess(inquiryId, '')}
            onSecureInquiryClick={() => setMode('secure')}
          />
        ) : (
          <SecureInquiryForm
            property={property}
            onSuccess={(inquiryId) => handleSuccess(inquiryId)}
            onBackToStandard={() => setMode('standard')}
          />
        )}
      </div>

      {/* Program Selection (if multiple programs) */}
      {programs.length > 1 && mode === 'standard' && (
        <div className="p-4 rounded-lg border border-stone bg-warm-gray/30">
          <h3 className="font-medium text-clarus-navy mb-2">Available Programs</h3>
          <p className="text-sm text-slate mb-3">
            You can mention your program of interest in your message
          </p>
          <ul className="space-y-1 text-sm">
            {programs.map((program) => (
              <li key={program.id} className="text-clarus-navy">
                {program.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
