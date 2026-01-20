import { cn } from '@clarus-vitae/utils';
import { forwardRef } from 'react';

export interface TeamMemberCardProps {
  name: string;
  title: string;
  specialty?: string;
  bio: string;
  propertiesVisited?: number;
  credentials?: string[];
  imageUrl?: string;
  href?: string;
  className?: string;
}

/**
 * TeamMemberCard component for displaying advisory team members.
 *
 * Features:
 * - Photo with professional treatment
 * - Name and title
 * - Specialty/expertise area
 * - Brief bio
 * - Credentials list
 * - Number of properties personally visited
 */
export const TeamMemberCard = forwardRef<HTMLDivElement, TeamMemberCardProps>(
  (
    {
      name,
      title,
      specialty,
      bio,
      propertiesVisited,
      credentials = [],
      imageUrl,
      href,
      className,
    },
    ref
  ) => {
    const cardContent = (
      <>
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-4xl text-slate">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-xl text-clarus-navy">{name}</h3>
          <p className="text-sm font-medium text-clarus-gold">{title}</p>
          {specialty && (
            <p className="mt-1 text-xs uppercase tracking-wide text-slate">{specialty}</p>
          )}

          <p className="mt-3 line-clamp-3 text-sm text-slate">{bio}</p>

          {/* Credentials */}
          {credentials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {credentials.slice(0, 3).map((credential) => (
                <span
                  key={credential}
                  className="rounded-md bg-stone px-2 py-0.5 text-xs text-slate"
                >
                  {credential}
                </span>
              ))}
            </div>
          )}

          {/* Properties Visited */}
          {propertiesVisited !== undefined && (
            <div className="mt-4 flex items-center gap-1 border-t border-stone pt-3">
              <svg className="h-4 w-4 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-slate">
                <span className="font-medium text-clarus-navy">{propertiesVisited}</span> properties visited
              </span>
            </div>
          )}
        </div>
      </>
    );

    const cardClassName = cn(
      'group block overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover',
      className
    );

    if (href) {
      return (
        <a href={href} className={cardClassName}>
          {cardContent}
        </a>
      );
    }

    return (
      <div ref={ref} className={cardClassName}>
        {cardContent}
      </div>
    );
  }
);

TeamMemberCard.displayName = 'TeamMemberCard';
