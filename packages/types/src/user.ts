/**
 * User Types
 *
 * Types related to users and team members
 */

import type { TeamMemberSummary } from './team';

/**
 * Advisory team member interface for backward compatibility.
 * For full team member types, use types from './team'.
 * @deprecated Use TeamMember or TeamMemberSummary from './team' instead
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

/**
 * Convert AdvisoryTeamMember to TeamMemberSummary
 */
export function toTeamMemberSummary(member: AdvisoryTeamMember): TeamMemberSummary {
  return {
    id: member.id,
    slug: member.slug,
    name: member.name,
    title: member.title,
    photoUrl: member.photo?.url,
    credentials: member.credentials,
    propertiesVisited: member.propertiesVisited,
  };
}
