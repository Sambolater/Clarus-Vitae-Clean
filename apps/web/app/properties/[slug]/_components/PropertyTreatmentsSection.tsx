'use client';

import { type TreatmentCategory, type EvidenceLevel as EvidenceLevelType, type DiagnosticCategory, type EquipmentCategory } from '@clarus-vitae/database';
import { EvidenceLevel } from '@clarus-vitae/ui';
import Link from 'next/link';

interface Treatment {
  id: string;
  slug: string;
  name: string;
  category: TreatmentCategory;
  evidenceLevel: EvidenceLevelType;
  description: string;
  priceAtProperty: number | null;
  notes: string | null;
}

interface Diagnostic {
  id: string;
  slug: string;
  name: string;
  category: DiagnosticCategory;
  description: string;
  notes: string | null;
}

interface Equipment {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: EquipmentCategory;
  installationYear: number | null;
  notes: string | null;
}

interface PropertyTreatmentsSectionProps {
  treatments: Treatment[];
  diagnostics: Diagnostic[];
  equipment: Equipment[];
  currency: string;
}

const categoryLabels: Record<TreatmentCategory, string> = {
  DIAGNOSTICS: 'Diagnostics',
  REGENERATIVE: 'Regenerative',
  CELLULAR: 'Cellular Therapy',
  DETOXIFICATION: 'Detoxification',
  HYPERBARIC: 'Hyperbaric',
  CRYOTHERAPY: 'Cryotherapy',
  IV_THERAPIES: 'IV Therapies',
  HORMONE: 'Hormone Therapy',
  AESTHETIC: 'Aesthetic',
  BODY_MANUAL: 'Body & Manual',
  MIND_NEURO: 'Mind & Neuro',
  TRADITIONAL: 'Traditional',
};

const diagnosticCategoryLabels: Record<DiagnosticCategory, string> = {
  IMAGING: 'Imaging',
  GENETIC: 'Genetic Testing',
  BIOMARKERS: 'Biomarkers',
  MICROBIOME: 'Microbiome',
  CARDIOVASCULAR: 'Cardiovascular',
  COGNITIVE: 'Cognitive',
  METABOLIC: 'Metabolic',
};

export function PropertyTreatmentsSection({
  treatments,
  diagnostics,
  equipment,
  currency,
}: PropertyTreatmentsSectionProps) {
  if (treatments.length === 0 && diagnostics.length === 0 && equipment.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Group treatments by category
  const treatmentsByCategory = treatments.reduce((acc, treatment) => {
    const category = treatment.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(treatment);
    return acc;
  }, {} as Record<TreatmentCategory, Treatment[]>);

  // Group diagnostics by category
  const diagnosticsByCategory = diagnostics.reduce((acc, diagnostic) => {
    const category = diagnostic.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(diagnostic);
    return acc;
  }, {} as Record<DiagnosticCategory, Diagnostic[]>);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">
          Treatments & Diagnostics
        </h2>
        <p className="mt-2 text-slate">
          Available treatments, diagnostic capabilities, and equipment at this property.
        </p>

        {/* Treatments */}
        {treatments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-clarus-navy">Treatments</h3>
            <div className="mt-4 space-y-6">
              {Object.entries(treatmentsByCategory).map(([category, categoryTreatments]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium uppercase tracking-wide text-slate">
                    {categoryLabels[category as TreatmentCategory]}
                  </h4>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {categoryTreatments.map((treatment) => (
                      <Link
                        key={treatment.id}
                        href={`/treatments/${treatment.slug}`}
                        className="flex items-start justify-between rounded-lg border border-stone bg-white p-4 transition-shadow hover:shadow-card"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium text-clarus-navy">
                            {treatment.name}
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            <EvidenceLevel level={treatment.evidenceLevel} size="sm" />
                            {treatment.priceAtProperty && (
                              <span className="text-xs text-slate">
                                {formatPrice(treatment.priceAtProperty)}
                              </span>
                            )}
                          </div>
                        </div>
                        <svg className="h-4 w-4 shrink-0 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostics */}
        {diagnostics.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-medium text-clarus-navy">Diagnostic Capabilities</h3>
            <div className="mt-4 space-y-6">
              {Object.entries(diagnosticsByCategory).map(([category, categoryDiagnostics]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium uppercase tracking-wide text-slate">
                    {diagnosticCategoryLabels[category as DiagnosticCategory]}
                  </h4>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {categoryDiagnostics.map((diagnostic) => (
                      <div
                        key={diagnostic.id}
                        className="rounded-lg border border-stone bg-white p-4"
                      >
                        <span className="text-sm font-medium text-clarus-navy">
                          {diagnostic.name}
                        </span>
                        {diagnostic.notes && (
                          <p className="mt-1 text-xs text-slate">{diagnostic.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {equipment.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-medium text-clarus-navy">Equipment</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-stone bg-white p-4"
                >
                  <span className="text-sm font-medium text-clarus-navy">{item.name}</span>
                  {(item.brand || item.model) && (
                    <p className="mt-1 text-xs text-slate">
                      {[item.brand, item.model].filter(Boolean).join(' ')}
                    </p>
                  )}
                  {item.installationYear && (
                    <p className="mt-1 text-xs text-slate">Installed {item.installationYear}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
