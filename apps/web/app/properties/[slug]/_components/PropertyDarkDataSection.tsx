'use client';

import { DiscretionLevel } from '@clarus-vitae/database';

interface DarkData {
  physicianPatientRatio: string | null;
  avgBookingLeadTime: string | null;
  returnGuestPercentage: number | null;
  staffTenure: string | null;
  actualCustomization: string | null;
  postVisitFollowup: string | null;
  discretionLevel: DiscretionLevel | null;
}

interface PropertyDarkDataSectionProps {
  darkData: DarkData;
}

const discretionLabels: Record<DiscretionLevel, string> = {
  ULTRA_HIGH: 'Ultra-High (NDA standard, no social media)',
  HIGH: 'High',
  STANDARD: 'Standard',
};

interface DataPointProps {
  label: string;
  value: string | number | null;
  description: string;
  isVerified?: boolean;
}

function DataPoint({ label, value, description, isVerified = true }: DataPointProps) {
  if (value === null) return null;

  return (
    <div className="rounded-lg border border-stone bg-white p-4">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-clarus-navy">{label}</span>
        {isVerified && (
          <span className="flex items-center gap-1 text-xs text-verification-green">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        )}
      </div>
      <p className="mt-2 text-lg font-medium text-clarus-navy">
        {typeof value === 'number' ? `${value}%` : value}
      </p>
      <p className="mt-1 text-xs text-slate">{description}</p>
    </div>
  );
}

export function PropertyDarkDataSection({ darkData }: PropertyDarkDataSectionProps) {
  // Check if there's any dark data to display
  const hasData = Object.values(darkData).some((v) => v !== null);

  if (!hasData) {
    return null;
  }

  return (
    <section className="py-12 bg-warm-gray">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Insider Intelligence
          </h2>
          <span className="rounded-md bg-clarus-navy px-2 py-1 text-xs font-medium text-white">
            Proprietary
          </span>
        </div>
        <p className="mt-2 text-slate">
          Data points that properties typically don&apos;t publish, gathered through direct
          research and verified guest reports.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <DataPoint
            label="Physician-to-Patient Ratio"
            value={darkData.physicianPatientRatio}
            description="The level of medical attention you can expect during your stay"
          />

          <DataPoint
            label="Average Booking Lead Time"
            value={darkData.avgBookingLeadTime}
            description="How far in advance you typically need to book"
          />

          <DataPoint
            label="Return Guest Rate"
            value={darkData.returnGuestPercentage}
            description="Percentage of guests who return for additional visits"
          />

          <DataPoint
            label="Staff Tenure"
            value={darkData.staffTenure}
            description="Average length of employment, indicating team stability"
          />

          {darkData.discretionLevel && (
            <DataPoint
              label="Discretion Level"
              value={discretionLabels[darkData.discretionLevel]}
              description="Privacy and confidentiality protocols in place"
            />
          )}
        </div>

        {/* Extended text-based insights */}
        {(darkData.actualCustomization || darkData.postVisitFollowup) && (
          <div className="mt-8 space-y-6">
            {darkData.actualCustomization && (
              <div className="rounded-lg border border-stone bg-white p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-clarus-navy">
                    Actual Customization Reality
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-verification-green">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate">{darkData.actualCustomization}</p>
              </div>
            )}

            {darkData.postVisitFollowup && (
              <div className="rounded-lg border border-stone bg-white p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-clarus-navy">
                    Post-Visit Follow-up Reality
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-verification-green">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate">{darkData.postVisitFollowup}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
