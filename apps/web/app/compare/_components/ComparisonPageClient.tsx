'use client';

import {
  Container,
  ComparisonHeader,
  ComparisonSection,
  ComparisonActions,
  TreatmentComparisonMatrix,
  ComparisonEmptyState,
  ClarusIndexBadge,
} from '@clarus-vitae/ui';
import { useComparison } from '@clarus-vitae/utils';
import { useRouter } from 'next/navigation';
import { useState, useCallback, type ReactNode } from 'react';

import { tierLabels, focusAreaLabels } from '@/lib/properties';

// Types for comparison data
interface PropertyForComparison {
  id: string;
  slug: string;
  name: string;
  tier: string;
  approach: string | null;
  city: string;
  country: string;
  region: string | null;
  nearestAirport: string | null;
  transferTime: string | null;
  priceMin: number;
  priceMax: number;
  currency: string;
  overallScore: number | null;
  clinicalRigorScore: number | null;
  outcomeEvidenceScore: number | null;
  programDepthScore: number | null;
  experienceQualityScore: number | null;
  valueAlignmentScore: number | null;
  verifiedExcellence: boolean;
  editorChoice: string | null;
  risingStar: boolean;
  focusAreas: string[];
  darkData: {
    physicianPatientRatio: string | null;
    avgBookingLeadTime: string | null;
    returnGuestPercentage: number | null;
    staffTenure: string | null;
    actualCustomization: string | null;
    postVisitFollowup: string | null;
    discretionLevel: string | null;
  };
  cultural: {
    genderSeparatedFacilities: string | null;
    religiousDietaryOptions: string[];
    privacyArchitecture: string | null;
    languagesMedical: string[];
    languagesService: string[];
    soloTravelerFriendly: string | null;
    lgbtqWelcoming: string | null;
  };
  treatments: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    isSignature: boolean;
  }>;
  programsCount: number;
  programPriceRange: {
    min: number | null;
    max: number | null;
  };
  durationRange: {
    min: number | null;
    max: number | null;
  };
  reviews: {
    count: number;
    averageRating: number | null;
    goalAchievementRate: number | null;
  };
  heroImage: { url: string; alt: string } | null;
  foundedYear: number | null;
  capacity: number | null;
  website: string | null;
}

interface ComparisonPageClientProps {
  initialProperties: PropertyForComparison[];
  requestedSlugs: string[];
}

function formatPrice(amount: number | null, currency: string): string {
  if (amount === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPriceRange(min: number | null, max: number | null, currency: string): string {
  if (min === null && max === null) return '—';
  if (min === null) return `Up to ${formatPrice(max, currency)}`;
  if (max === null) return `From ${formatPrice(min, currency)}`;
  if (min === max) return formatPrice(min, currency);
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

// Row component for comparison table
function ComparisonRow({
  label,
  values,
  highlight = 'none',
  renderValue,
  tooltip,
}: {
  label: string;
  values: (string | number | null | ReactNode)[];
  highlight?: 'highest' | 'lowest' | 'none';
  renderValue?: (value: any, index: number) => ReactNode;
  tooltip?: string;
}) {
  // Determine which values to highlight
  const numericValues = values.map((v) => (typeof v === 'number' ? v : null));
  const highlightedIndexes = new Set<number>();

  if (highlight !== 'none') {
    const validValues = numericValues.filter((v): v is number => v !== null);
    if (validValues.length > 0) {
      const targetValue =
        highlight === 'highest' ? Math.max(...validValues) : Math.min(...validValues);
      numericValues.forEach((v, i) => {
        if (v === targetValue) highlightedIndexes.add(i);
      });
    }
  }

  return (
    <div className="flex">
      {/* Label column */}
      <div
        className="flex w-48 shrink-0 items-center px-4 py-3 text-sm font-medium text-clarus-navy"
        title={tooltip}
      >
        {label}
        {tooltip && (
          <svg
            className="ml-1 h-3.5 w-3.5 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Value columns */}
      <div className="flex flex-1 divide-x divide-stone/50">
        {values.map((value, index) => {
          const isHighlighted = highlightedIndexes.has(index);
          return (
            <div
              key={index}
              className={`flex flex-1 items-center justify-center px-4 py-3 text-center text-sm ${
                isHighlighted
                  ? 'bg-verification-green/10 font-medium text-verification-green'
                  : 'text-slate'
              }`}
            >
              {renderValue ? renderValue(value, index) : value ?? '—'}
            </div>
          );
        })}

        {/* Empty slots */}
        {Array.from({ length: 4 - values.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex flex-1 items-center justify-center px-4 py-3 text-center text-sm text-slate/50"
          >
            —
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonPageClient({
  initialProperties,
  requestedSlugs: _requestedSlugs,
}: ComparisonPageClientProps) {
  const router = useRouter();
  const { removeFromComparison } = useComparison();
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const properties = initialProperties;
  const emptySlots = 4 - properties.length;

  // Handle removing a property
  const handleRemoveProperty = useCallback(
    (propertyId: string) => {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        removeFromComparison(propertyId);
        const newSlugs = properties.filter((p) => p.id !== propertyId).map((p) => p.slug);
        if (newSlugs.length > 0) {
          router.push(`/compare?properties=${newSlugs.join(',')}`);
        } else {
          router.push('/compare');
        }
      }
    },
    [properties, removeFromComparison, router]
  );

  // Handle adding a property (navigate to browse)
  const handleAddProperty = useCallback(() => {
    router.push('/properties');
  }, [router]);

  // Handle PDF export
  const handleExportPdf = useCallback(async () => {
    setIsPdfLoading(true);
    try {
      const response = await fetch('/api/compare/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds: properties.map((p) => p.slug) }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clarus-vitae-comparison-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsPdfLoading(false);
    }
  }, [properties]);

  // Handle batch inquiry
  const handleBatchInquiry = useCallback(() => {
    const slugs = properties.map((p) => p.slug).join(',');
    router.push(`/inquire?properties=${slugs}`);
  }, [properties, router]);

  // Empty state
  if (properties.length === 0) {
    return (
      <Container>
        <ComparisonEmptyState
          popularComparisons={[
            {
              title: 'Top Longevity Clinics',
              properties: ['clinique-la-prairie', 'lanserhof-tegernsee'],
              url: '/compare?properties=clinique-la-prairie,lanserhof-tegernsee',
            },
            {
              title: 'Best of Switzerland',
              properties: ['clinique-la-prairie', 'chenot-palace-weggis'],
              url: '/compare?properties=clinique-la-prairie,chenot-palace-weggis',
            },
          ]}
        />
      </Container>
    );
  }

  return (
    <>
      {/* Desktop comparison table */}
      <div className="hidden lg:block">
        <Container>
          {/* Property headers */}
          <ComparisonHeader
            properties={properties.map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              city: p.city,
              country: p.country,
              tier: p.tier as 'TIER_1' | 'TIER_2' | 'TIER_3',
              score: p.overallScore,
              imageUrl: p.heroImage?.url,
            }))}
            maxItems={4}
            onRemoveProperty={handleRemoveProperty}
            onAddProperty={handleAddProperty}
          />

          {/* Comparison sections */}
          <div className="divide-y divide-stone border-b border-stone">
            {/* Overview Section */}
            <ComparisonSection title="Overview">
              <ComparisonRow
                label="Property Tier"
                values={properties.map((p) => tierLabels[p.tier as keyof typeof tierLabels] || p.tier)}
              />
              <ComparisonRow
                label="Approach"
                values={properties.map((p) =>
                  p.approach ? p.approach.replace(/_/g, ' ').toLowerCase() : '—'
                )}
              />
              <ComparisonRow
                label="Location"
                values={properties.map((p) => `${p.city}, ${p.country}`)}
              />
              <ComparisonRow
                label="Year Established"
                values={properties.map((p) => p.foundedYear)}
              />
              <ComparisonRow
                label="Capacity"
                values={properties.map((p) => (p.capacity ? `${p.capacity} rooms` : null))}
              />
              <ComparisonRow
                label="Focus Areas"
                values={properties.map((p) =>
                  p.focusAreas
                    .slice(0, 3)
                    .map((fa) => focusAreaLabels[fa as keyof typeof focusAreaLabels] || fa)
                    .join(', ')
                )}
              />
            </ComparisonSection>

            {/* Pricing Section */}
            <ComparisonSection title="Pricing">
              <ComparisonRow
                label="Price Range"
                values={properties.map((p) =>
                  formatPriceRange(p.priceMin, p.priceMax, p.currency)
                )}
                highlight="lowest"
              />
              <ComparisonRow
                label="Program Prices"
                values={properties.map((p) =>
                  formatPriceRange(p.programPriceRange.min, p.programPriceRange.max, p.currency)
                )}
              />
              <ComparisonRow
                label="Typical Stay"
                values={properties.map((p) => {
                  if (p.durationRange.min === null) return '—';
                  if (p.durationRange.min === p.durationRange.max) return `${p.durationRange.min} days`;
                  return `${p.durationRange.min}-${p.durationRange.max} days`;
                })}
              />
              <ComparisonRow
                label="Programs Available"
                values={properties.map((p) => `${p.programsCount} ${p.programsCount === 1 ? 'program' : 'programs'}`)}
                highlight="highest"
              />
            </ComparisonSection>

            {/* Clarus Index Section */}
            <ComparisonSection title="Clarus Index Scores">
              <ComparisonRow
                label="Overall Score"
                values={properties.map((p) => p.overallScore)}
                highlight="highest"
                renderValue={(value) =>
                  value ? (
                    <ClarusIndexBadge score={value} size="sm" />
                  ) : (
                    <span className="text-slate/50">Not rated</span>
                  )
                }
              />
              <ComparisonRow
                label="Clinical Rigor"
                values={properties.map((p) => p.clinicalRigorScore)}
                highlight="highest"
                tooltip="Medical credentials, diagnostic depth, evidence-based protocols"
              />
              <ComparisonRow
                label="Outcome Evidence"
                values={properties.map((p) => p.outcomeEvidenceScore)}
                highlight="highest"
                tooltip="Published results, guest-reported outcomes, follow-up protocols"
              />
              <ComparisonRow
                label="Program Depth"
                values={properties.map((p) => p.programDepthScore)}
                highlight="highest"
                tooltip="Comprehensiveness, customization, duration options"
              />
              <ComparisonRow
                label="Experience Quality"
                values={properties.map((p) => p.experienceQualityScore)}
                highlight="highest"
                tooltip="Facilities, service, accommodation, dining"
              />
              <ComparisonRow
                label="Value Alignment"
                values={properties.map((p) => p.valueAlignmentScore)}
                highlight="highest"
                tooltip="Price relative to what's delivered"
              />
            </ComparisonSection>

            {/* Dark Data Section */}
            <ComparisonSection title="Insider Intelligence" collapsible defaultCollapsed={false}>
              <ComparisonRow
                label="Physician-to-Patient Ratio"
                values={properties.map((p) => p.darkData.physicianPatientRatio)}
                tooltip="Quality of medical attention"
              />
              <ComparisonRow
                label="Booking Lead Time"
                values={properties.map((p) => p.darkData.avgBookingLeadTime)}
                tooltip="How far in advance you need to book"
              />
              <ComparisonRow
                label="Return Guest Rate"
                values={properties.map((p) =>
                  p.darkData.returnGuestPercentage ? `${p.darkData.returnGuestPercentage}%` : null
                )}
                highlight="highest"
                tooltip="Percentage of guests who return"
              />
              <ComparisonRow
                label="Staff Tenure"
                values={properties.map((p) => p.darkData.staffTenure)}
                tooltip="Average years of staff experience"
              />
              <ComparisonRow
                label="Discretion Level"
                values={properties.map((p) =>
                  p.darkData.discretionLevel?.replace(/_/g, ' ').toLowerCase()
                )}
              />
            </ComparisonSection>

            {/* Cultural Fit Section */}
            <ComparisonSection title="Cultural Fit" collapsible defaultCollapsed={false}>
              <ComparisonRow
                label="Languages (Medical)"
                values={properties.map((p) =>
                  p.cultural.languagesMedical.length > 0
                    ? p.cultural.languagesMedical.join(', ')
                    : null
                )}
              />
              <ComparisonRow
                label="Dietary Options"
                values={properties.map((p) =>
                  p.cultural.religiousDietaryOptions.length > 0
                    ? p.cultural.religiousDietaryOptions.join(', ')
                    : null
                )}
              />
              <ComparisonRow
                label="Privacy Architecture"
                values={properties.map((p) => p.cultural.privacyArchitecture)}
              />
              <ComparisonRow
                label="Solo Traveler Friendly"
                values={properties.map((p) =>
                  p.cultural.soloTravelerFriendly?.replace(/_/g, ' ').toLowerCase()
                )}
              />
              <ComparisonRow
                label="Gender-Separated Facilities"
                values={properties.map((p) =>
                  p.cultural.genderSeparatedFacilities?.replace(/_/g, ' ').toLowerCase()
                )}
              />
            </ComparisonSection>

            {/* Treatments Section */}
            <ComparisonSection title="Treatments" collapsible defaultCollapsed={false}>
              <TreatmentComparisonMatrix
                properties={properties.map((p) => ({
                  propertyId: p.id,
                  propertyName: p.name,
                  treatments: p.treatments,
                }))}
                initialLimit={15}
                emptySlots={emptySlots}
              />
            </ComparisonSection>

            {/* Reviews Section */}
            <ComparisonSection title="Guest Reviews" collapsible defaultCollapsed={false}>
              <ComparisonRow
                label="Review Count"
                values={properties.map((p) => p.reviews.count)}
                highlight="highest"
              />
              <ComparisonRow
                label="Average Rating"
                values={properties.map((p) =>
                  p.reviews.averageRating ? `${p.reviews.averageRating}/5` : null
                )}
                highlight="highest"
              />
              <ComparisonRow
                label="Goal Achievement Rate"
                values={properties.map((p) =>
                  p.reviews.goalAchievementRate ? `${p.reviews.goalAchievementRate}%` : null
                )}
                highlight="highest"
                tooltip="Percentage of guests who achieved their wellness goals"
              />
            </ComparisonSection>

            {/* Practical Section */}
            <ComparisonSection title="Practical Information" collapsible defaultCollapsed>
              <ComparisonRow
                label="Nearest Airport"
                values={properties.map((p) => p.nearestAirport)}
              />
              <ComparisonRow
                label="Transfer Time"
                values={properties.map((p) => p.transferTime)}
              />
              <ComparisonRow
                label="Website"
                values={properties.map((p) =>
                  p.website ? (
                    <a
                      key={p.id}
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-clarus-navy underline hover:no-underline"
                    >
                      Visit
                    </a>
                  ) : null
                )}
              />
            </ComparisonSection>
          </div>

          {/* Actions */}
          <ComparisonActions
            properties={properties.map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
            }))}
            isPdfLoading={isPdfLoading}
            onExportPdf={handleExportPdf}
            onBatchInquiry={handleBatchInquiry}
          />
        </Container>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        <MobileComparison
          properties={properties}
          onRemoveProperty={handleRemoveProperty}
          isPdfLoading={isPdfLoading}
          onExportPdf={handleExportPdf}
          onBatchInquiry={handleBatchInquiry}
        />
      </div>
    </>
  );
}

// Mobile comparison component
function MobileComparison({
  properties,
  onRemoveProperty,
  isPdfLoading,
  onExportPdf,
  onBatchInquiry,
}: {
  properties: PropertyForComparison[];
  onRemoveProperty: (id: string) => void;
  isPdfLoading: boolean;
  onExportPdf: () => void;
  onBatchInquiry: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview', 'scores'])
  );

  const activeProperty = properties[activeIndex];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const renderDataRow = (label: string, value: string | number | null | undefined) => (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-slate">{label}</span>
      <span className="font-medium text-clarus-navy">{value ?? '—'}</span>
    </div>
  );

  return (
    <div className="p-4">
      {/* Tab navigation */}
      <div className="mb-4 flex overflow-x-auto rounded-lg border border-stone bg-white">
        {properties.map((property, index) => (
          <button
            key={property.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`flex min-w-0 flex-1 flex-col items-center px-3 py-3 text-center transition-colors ${
              index === activeIndex
                ? 'border-b-2 border-clarus-navy bg-warm-gray/50 text-clarus-navy'
                : 'text-slate hover:bg-warm-gray/30'
            }`}
          >
            <span className="truncate text-xs font-medium">{property.name}</span>
            {property.overallScore && (
              <span className="mt-0.5 text-[10px] text-slate">Score: {property.overallScore}</span>
            )}
          </button>
        ))}
      </div>

      {/* Active property */}
      {activeProperty && (
        <div className="space-y-4">
          {/* Property card */}
          <div className="relative overflow-hidden rounded-lg bg-white shadow-card">
            <div className="relative h-40 bg-stone">
              {activeProperty.heroImage ? (
                <img
                  src={activeProperty.heroImage.url}
                  alt={activeProperty.heroImage.alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate">
                  No image
                </div>
              )}
              {activeProperty.overallScore && (
                <div className="absolute bottom-3 right-3">
                  <ClarusIndexBadge score={activeProperty.overallScore} size="sm" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveProperty(activeProperty.id)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate hover:bg-white hover:text-clarus-navy"
                aria-label={`Remove ${activeProperty.name}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h2 className="font-display text-xl font-medium text-clarus-navy">
                {activeProperty.name}
              </h2>
              <p className="mt-1 text-sm text-slate">
                {activeProperty.city}, {activeProperty.country}
              </p>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="divide-y divide-stone overflow-hidden rounded-lg border border-stone bg-white">
            {/* Overview */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('overview')}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-clarus-navy">Overview</span>
                <svg
                  className={`h-5 w-5 text-slate transition-transform ${
                    expandedSections.has('overview') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.has('overview') && (
                <div className="border-t border-stone/50 bg-warm-gray/30 px-4 py-3">
                  {renderDataRow('Tier', tierLabels[activeProperty.tier as keyof typeof tierLabels])}
                  {renderDataRow('Price Range', formatPriceRange(activeProperty.priceMin, activeProperty.priceMax, activeProperty.currency))}
                  {renderDataRow('Programs', `${activeProperty.programsCount} available`)}
                  {renderDataRow('Established', activeProperty.foundedYear)}
                </div>
              )}
            </div>

            {/* Scores */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('scores')}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-clarus-navy">Clarus Index</span>
                <svg
                  className={`h-5 w-5 text-slate transition-transform ${
                    expandedSections.has('scores') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.has('scores') && (
                <div className="border-t border-stone/50 bg-warm-gray/30 px-4 py-3">
                  {renderDataRow('Overall', activeProperty.overallScore)}
                  {renderDataRow('Clinical Rigor', activeProperty.clinicalRigorScore)}
                  {renderDataRow('Outcome Evidence', activeProperty.outcomeEvidenceScore)}
                  {renderDataRow('Program Depth', activeProperty.programDepthScore)}
                  {renderDataRow('Experience Quality', activeProperty.experienceQualityScore)}
                  {renderDataRow('Value Alignment', activeProperty.valueAlignmentScore)}
                </div>
              )}
            </div>

            {/* Dark Data */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('darkdata')}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-clarus-navy">Insider Intelligence</span>
                <svg
                  className={`h-5 w-5 text-slate transition-transform ${
                    expandedSections.has('darkdata') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.has('darkdata') && (
                <div className="border-t border-stone/50 bg-warm-gray/30 px-4 py-3">
                  {renderDataRow('Physician Ratio', activeProperty.darkData.physicianPatientRatio)}
                  {renderDataRow('Lead Time', activeProperty.darkData.avgBookingLeadTime)}
                  {renderDataRow('Return Rate', activeProperty.darkData.returnGuestPercentage ? `${activeProperty.darkData.returnGuestPercentage}%` : null)}
                  {renderDataRow('Staff Tenure', activeProperty.darkData.staffTenure)}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('reviews')}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-clarus-navy">Reviews</span>
                <svg
                  className={`h-5 w-5 text-slate transition-transform ${
                    expandedSections.has('reviews') ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.has('reviews') && (
                <div className="border-t border-stone/50 bg-warm-gray/30 px-4 py-3">
                  {renderDataRow('Reviews', activeProperty.reviews.count)}
                  {renderDataRow('Avg Rating', activeProperty.reviews.averageRating ? `${activeProperty.reviews.averageRating}/5` : null)}
                  {renderDataRow('Goal Achievement', activeProperty.reviews.goalAchievementRate ? `${activeProperty.reviews.goalAchievementRate}%` : null)}
                </div>
              )}
            </div>
          </div>

          {/* Swipe indicator */}
          {properties.length > 1 && (
            <div className="flex justify-center gap-1.5 py-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-clarus-navy' : 'bg-stone'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <ComparisonActions
            properties={properties.map((p) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
            }))}
            isPdfLoading={isPdfLoading}
            onExportPdf={onExportPdf}
            onBatchInquiry={onBatchInquiry}
          />
        </div>
      )}
    </div>
  );
}
