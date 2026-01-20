/**
 * User Types
 *
 * Types related to users and inquiries
 */

export interface Inquiry {
  id: string;
  propertyId: string;
  name?: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'secure';
  interests: string[];
  budgetRange?: string;
  travelDates?: {
    earliest?: Date;
    latest?: Date;
    flexible: boolean;
  };
  isSecure: boolean;
  createdAt: Date;
}

export interface AdvisoryTeamMember {
  id: string;
  slug: string;
  name: string;
  title: string;
  credentials: string[];
  bio: string;
  specializations: string[];
  propertiesVisited: number;
  photo?: {
    url: string;
    alt: string;
  };
  contactEmail?: string;
}
