'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import type { TeamMember, TeamRole } from '@clarus-vitae/types';

import { TeamMemberCard } from '../Card/TeamMemberCard';

export interface TeamGridProps extends HTMLAttributes<HTMLElement> {
  members: TeamMember[];
  showRoleFilters?: boolean;
  columns?: 2 | 3 | 4;
}

const roleOrder: TeamRole[] = [
  'founder',
  'medical_advisor',
  'senior_advisor',
  'advisor',
  'contributor',
];

function getRolePriority(role: TeamRole): number {
  const index = roleOrder.indexOf(role);
  return index === -1 ? roleOrder.length : index;
}

/**
 * TeamGrid component for displaying team members in a responsive grid.
 *
 * Features:
 * - Responsive grid layout (2-4 columns)
 * - Members sorted by role priority and display order
 * - Links to individual profiles
 * - Consistent card styling
 */
export const TeamGrid = forwardRef<HTMLElement, TeamGridProps>(
  (
    {
      members,
      showRoleFilters: _showRoleFilters = false,
      columns = 3,
      className,
      ...props
    },
    ref
  ) => {
    // Sort members by role priority, then by display order
    const sortedMembers = [...members].sort((a, b) => {
      const rolePriorityDiff = getRolePriority(a.role) - getRolePriority(b.role);
      if (rolePriorityDiff !== 0) return rolePriorityDiff;
      return a.displayOrder - b.displayOrder;
    });

    const gridCols = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <section
        ref={ref}
        className={cn('py-12 md:py-16', className)}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className={cn('grid gap-6 md:gap-8', gridCols[columns])}>
            {sortedMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                title={member.title}
                specialty={member.specializations[0]}
                bio={member.shortBio}
                propertiesVisited={member.propertiesVisited}
                credentials={member.credentials}
                imageUrl={member.photoUrl}
                href={`/team/${member.slug}`}
              />
            ))}
          </div>

          {members.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate">No team members to display.</p>
            </div>
          )}
        </div>
      </section>
    );
  }
);

TeamGrid.displayName = 'TeamGrid';
