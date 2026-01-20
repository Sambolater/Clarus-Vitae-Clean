/**
 * Treatment-related utility functions and types
 */

import { TreatmentCategory, EvidenceLevel, DiagnosticCategory, EquipmentCategory } from '@clarus-vitae/database';

// Category labels for display
export const treatmentCategoryLabels: Record<TreatmentCategory, string> = {
  DIAGNOSTICS: 'Diagnostics',
  REGENERATIVE: 'Regenerative Medicine',
  CELLULAR: 'Cellular Therapy',
  DETOXIFICATION: 'Detoxification',
  HYPERBARIC: 'Hyperbaric Therapy',
  CRYOTHERAPY: 'Cryotherapy',
  IV_THERAPIES: 'IV Therapies',
  HORMONE: 'Hormone Optimization',
  AESTHETIC: 'Aesthetic Treatments',
  BODY_MANUAL: 'Manual & Body Therapies',
  MIND_NEURO: 'Mind & Neurotherapy',
  TRADITIONAL: 'Traditional Medicine',
};

export const treatmentCategoryDescriptions: Record<TreatmentCategory, string> = {
  DIAGNOSTICS: 'Imaging, testing, and assessment protocols',
  REGENERATIVE: 'Stem cells, PRP, exosomes, and peptide therapies',
  CELLULAR: 'NAD+, mitochondrial support, and senolytics',
  DETOXIFICATION: 'Plasma exchange, EBOO, chelation, and fasting protocols',
  HYPERBARIC: 'Hyperbaric oxygen therapy variations',
  CRYOTHERAPY: 'Whole body and localized cryotherapy',
  IV_THERAPIES: 'Nutrient IVs, ozone therapy, Myers cocktail',
  HORMONE: 'Hormone optimization and replacement therapies',
  AESTHETIC: 'Non-surgical rejuvenation and beauty treatments',
  BODY_MANUAL: 'Physiotherapy, osteopathy, massage, and bodywork',
  MIND_NEURO: 'Neurofeedback, psychotherapy, and stress protocols',
  TRADITIONAL: 'Ayurveda, TCM, naturopathy, and traditional practices',
};

// Evidence level labels and styling
export const evidenceLevelLabels: Record<EvidenceLevel, string> = {
  STRONG: 'Strong Evidence',
  MODERATE: 'Moderate Evidence',
  EMERGING: 'Emerging Evidence',
  EXPERIMENTAL: 'Experimental',
  TRADITIONAL: 'Traditional Practice',
};

export const evidenceLevelDescriptions: Record<EvidenceLevel, string> = {
  STRONG: 'Supported by multiple randomized controlled trials and meta-analyses',
  MODERATE: 'Some RCTs with consistent results across studies',
  EMERGING: 'Limited studies showing promising results; more research needed',
  EXPERIMENTAL: 'Early-stage research or theoretical basis; limited clinical data',
  TRADITIONAL: 'Historical use with cultural basis; limited modern research',
};

export const evidenceLevelConfig: Record<EvidenceLevel, { label: string; color: string; bgColor: string; badgeClass: string }> = {
  STRONG: {
    label: 'Strong Evidence',
    color: 'text-verification-green',
    bgColor: 'bg-verification-green/10',
    badgeClass: 'border-verification-green/20'
  },
  MODERATE: {
    label: 'Moderate Evidence',
    color: 'text-clarus-navy',
    bgColor: 'bg-clarus-navy/10',
    badgeClass: 'border-clarus-navy/20'
  },
  EMERGING: {
    label: 'Emerging Evidence',
    color: 'text-clarus-gold',
    bgColor: 'bg-clarus-gold/10',
    badgeClass: 'border-clarus-gold/20'
  },
  EXPERIMENTAL: {
    label: 'Experimental',
    color: 'text-slate',
    bgColor: 'bg-slate/10',
    badgeClass: 'border-slate/20'
  },
  TRADITIONAL: {
    label: 'Traditional Practice',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    badgeClass: 'border-amber-200'
  },
};

// Diagnostic category labels
export const diagnosticCategoryLabels: Record<DiagnosticCategory, string> = {
  IMAGING: 'Imaging',
  GENETIC: 'Genetic Testing',
  BIOMARKERS: 'Biomarker Panels',
  MICROBIOME: 'Microbiome Analysis',
  CARDIOVASCULAR: 'Cardiovascular Assessment',
  COGNITIVE: 'Cognitive Testing',
  METABOLIC: 'Metabolic Testing',
};

// Equipment category labels
export const equipmentCategoryLabels: Record<EquipmentCategory, string> = {
  MRI: 'MRI Systems',
  CT: 'CT Scanners',
  ULTRASOUND: 'Ultrasound',
  HYPERBARIC: 'Hyperbaric Chambers',
  CRYOTHERAPY: 'Cryotherapy Equipment',
  IV_INFUSION: 'IV Infusion Systems',
  LASER: 'Laser Equipment',
  OTHER: 'Other Equipment',
};

// Format price range for display
export function formatTreatmentPriceRange(min?: number | null, max?: number | null, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!min && !max) {
    return 'Price varies';
  }

  if (min && !max) {
    return `From ${formatter.format(min)}`;
  }

  if (!min && max) {
    return `Up to ${formatter.format(max)}`;
  }

  if (min === max) {
    return formatter.format(min!);
  }

  return `${formatter.format(min!)} - ${formatter.format(max!)}`;
}

// Sort options for treatments
export const treatmentSortOptions = [
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'properties_desc', label: 'Most Available' },
  { value: 'evidence_desc', label: 'Strongest Evidence' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export type TreatmentSortOption = typeof treatmentSortOptions[number]['value'];

// Sort options for diagnostics
export const diagnosticSortOptions = [
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'properties_desc', label: 'Most Available' },
  { value: 'category', label: 'By Category' },
] as const;

export type DiagnosticSortOption = typeof diagnosticSortOptions[number]['value'];

// Treatment listing type from API
export interface TreatmentListItem {
  id: string;
  slug: string;
  name: string;
  category: TreatmentCategory;
  description: string;
  evidenceLevel: EvidenceLevel;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertiesCount: number;
}

export interface TreatmentsResponse {
  treatments: TreatmentListItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Diagnostic listing type from API
export interface DiagnosticListItem {
  id: string;
  slug: string;
  name: string;
  category: DiagnosticCategory;
  description: string;
  propertiesCount: number;
}

export interface DiagnosticsResponse {
  diagnostics: DiagnosticListItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Equipment listing type from API
export interface EquipmentListItem {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: EquipmentCategory;
  description: string;
  propertiesCount: number;
  treatmentsCount: number;
}

// Medical disclaimer text
export const medicalDisclaimer = `The information provided is for educational purposes only and is not intended as medical advice. Individual results vary. Always consult with qualified healthcare providers before pursuing any treatment. Clarus Vitae does not endorse specific treatments or make claims about efficacy.`;

// Get all categories as options for filters
export function getTreatmentCategoryOptions(): { value: TreatmentCategory; label: string }[] {
  return Object.entries(treatmentCategoryLabels).map(([value, label]) => ({
    value: value as TreatmentCategory,
    label,
  }));
}

export function getEvidenceLevelOptions(): { value: EvidenceLevel; label: string }[] {
  return Object.entries(evidenceLevelLabels).map(([value, label]) => ({
    value: value as EvidenceLevel,
    label,
  }));
}

export function getDiagnosticCategoryOptions(): { value: DiagnosticCategory; label: string }[] {
  return Object.entries(diagnosticCategoryLabels).map(([value, label]) => ({
    value: value as DiagnosticCategory,
    label,
  }));
}

export function getEquipmentCategoryOptions(): { value: EquipmentCategory; label: string }[] {
  return Object.entries(equipmentCategoryLabels).map(([value, label]) => ({
    value: value as EquipmentCategory,
    label,
  }));
}
