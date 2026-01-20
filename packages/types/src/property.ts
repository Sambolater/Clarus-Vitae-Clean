/**
 * Property Types
 *
 * Types related to wellness properties/facilities
 */

export type PropertyTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export type PropertyTierLabel =
  | 'Medical Longevity & Clinical Wellness'
  | 'Integrated Wellness Retreats'
  | 'Luxury Destination Wellness';

export interface PropertyBase {
  id: string;
  slug: string;
  name: string;
  tier: PropertyTier;
  location: PropertyLocation;
  overview: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyLocation {
  country: string;
  region?: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyPricing {
  minPrice: number;
  maxPrice: number;
  currency: string;
  typicalStayDays: {
    min: number;
    max: number;
  };
}

export interface PropertyContact {
  website?: string;
  email?: string;
  phone?: string;
}

export interface Property extends PropertyBase {
  pricing: PropertyPricing;
  contact: PropertyContact;
  clarusIndexScore?: number;
  images: PropertyImage[];
  featuredImage?: PropertyImage;
  focusAreas: string[];
  verificationDate?: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface PropertyCard {
  id: string;
  slug: string;
  name: string;
  tier: PropertyTier;
  location: {
    country: string;
    city?: string;
  };
  clarusIndexScore?: number;
  featuredImage?: PropertyImage;
  priceRange: string;
}
