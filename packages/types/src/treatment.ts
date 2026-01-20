/**
 * Treatment Types
 *
 * Types related to wellness treatments and modalities
 */

export type EvidenceLevel =
  | 'STRONG'
  | 'MODERATE'
  | 'EMERGING'
  | 'TRADITIONAL'
  | 'INSUFFICIENT';

export type TreatmentCategory =
  | 'LONGEVITY'
  | 'DETOX'
  | 'METABOLIC'
  | 'STRESS'
  | 'FITNESS'
  | 'BEAUTY'
  | 'HOLISTIC'
  | 'DIAGNOSTIC'
  | 'RECOVERY'
  | 'ADDICTION'
  | 'COGNITIVE'
  | 'SLEEP'
  | 'WOMENS_HEALTH'
  | 'MENS_HEALTH'
  | 'GENERAL';

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: TreatmentCategory;
  evidenceLevel: EvidenceLevel;
  overview: string;
  benefits: string[];
  considerations: string[];
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  typicalDuration?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TreatmentCard {
  id: string;
  slug: string;
  name: string;
  category: TreatmentCategory;
  evidenceLevel: EvidenceLevel;
  shortDescription: string;
  propertyCount: number;
}
