'use client';

import { type GenderSeparation, type SoloFriendliness, type LGBTQWelcoming } from '@clarus-vitae/database';

interface CulturalFit {
  genderSeparatedFacilities: GenderSeparation | null;
  religiousDietaryOptions: string[];
  privacyArchitecture: string | null;
  prayerFacilities: string | null;
  languagesMedical: string[];
  languagesService: string[];
  soloTravelerFriendly: SoloFriendliness | null;
  lgbtqWelcoming: LGBTQWelcoming | null;
}

interface PropertyCulturalFitSectionProps {
  culturalFit: CulturalFit;
}

const genderSeparationLabels: Record<GenderSeparation, string> = {
  FULL: 'Full separation available',
  PARTIAL: 'Partial separation available',
  NONE: 'No separation',
  ON_REQUEST: 'Available on request',
};

const soloFriendlinessLabels: Record<SoloFriendliness, string> = {
  OPTIMIZED: 'Optimized for solo travelers',
  GOOD: 'Solo-friendly',
  COUPLES_FOCUSED: 'Couples-focused',
};

const lgbtqLabels: Record<LGBTQWelcoming, string> = {
  EXPLICITLY_WELCOMING: 'Explicitly welcoming',
  WELCOMING: 'Welcoming',
  CULTURALLY_CONSERVATIVE: 'Culturally conservative',
};

interface FitIndicatorProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

function FitIndicator({ icon, label, value }: FitIndicatorProps) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-stone bg-white p-4">
      <div className="text-clarus-navy">{icon}</div>
      <div>
        <span className="text-sm font-medium text-clarus-navy">{label}</span>
        <p className="mt-1 text-sm text-slate">{value}</p>
      </div>
    </div>
  );
}

export function PropertyCulturalFitSection({ culturalFit }: PropertyCulturalFitSectionProps) {
  // Check if there's any cultural fit data to display
  const hasData =
    culturalFit.genderSeparatedFacilities !== null ||
    culturalFit.religiousDietaryOptions.length > 0 ||
    culturalFit.privacyArchitecture !== null ||
    culturalFit.prayerFacilities !== null ||
    culturalFit.languagesMedical.length > 0 ||
    culturalFit.languagesService.length > 0 ||
    culturalFit.soloTravelerFriendly !== null ||
    culturalFit.lgbtqWelcoming !== null;

  if (!hasData) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">
          Cultural Fit
        </h2>
        <p className="mt-2 text-slate">
          Key indicators to help ensure this property aligns with your personal requirements.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Gender Separation */}
          {culturalFit.genderSeparatedFacilities && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              label="Gender-Separated Facilities"
              value={genderSeparationLabels[culturalFit.genderSeparatedFacilities]}
            />
          )}

          {/* Dietary Options */}
          {culturalFit.religiousDietaryOptions.length > 0 && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="Dietary Accommodations"
              value={culturalFit.religiousDietaryOptions.join(', ')}
            />
          )}

          {/* Privacy Architecture */}
          {culturalFit.privacyArchitecture && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              label="Privacy Architecture"
              value={culturalFit.privacyArchitecture}
            />
          )}

          {/* Prayer Facilities */}
          {culturalFit.prayerFacilities && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              label="Prayer/Meditation Facilities"
              value={culturalFit.prayerFacilities}
            />
          )}

          {/* Languages - Medical */}
          {culturalFit.languagesMedical.length > 0 && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              }
              label="Medical Staff Languages"
              value={culturalFit.languagesMedical.join(', ')}
            />
          )}

          {/* Languages - Service */}
          {culturalFit.languagesService.length > 0 && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              label="Service Languages"
              value={culturalFit.languagesService.join(', ')}
            />
          )}

          {/* Solo Traveler */}
          {culturalFit.soloTravelerFriendly && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Solo Traveler Suitability"
              value={soloFriendlinessLabels[culturalFit.soloTravelerFriendly]}
            />
          )}

          {/* LGBTQ+ Welcoming */}
          {culturalFit.lgbtqWelcoming && (
            <FitIndicator
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              label="LGBTQ+ Environment"
              value={lgbtqLabels[culturalFit.lgbtqWelcoming]}
            />
          )}
        </div>
      </div>
    </section>
  );
}
