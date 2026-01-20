/**
 * User Types
 *
 * Types related to users and team members
 */

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
