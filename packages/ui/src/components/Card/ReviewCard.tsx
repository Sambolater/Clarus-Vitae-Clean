import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  authorName: string;
  authorTitle?: string;
  date: string;
  rating: number;
  content: string;
  propertyName?: string;
  isVerified?: boolean;
  isExpert?: boolean;
  goalAchievement?: number;
  avatarUrl?: string;
}

/**
 * ReviewCard component for displaying user reviews.
 *
 * Features:
 * - Author information with optional avatar
 * - Star rating display
 * - Review content
 * - Verified visit badge
 * - Expert reviewer indicator
 * - Goal achievement score (for outcome-focused reviews)
 */
export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  (
    {
      authorName,
      authorTitle,
      date,
      rating,
      content,
      propertyName,
      isVerified = false,
      isExpert = false,
      goalAchievement,
      avatarUrl,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-lg bg-white p-5 shadow-card', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-stone">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-clarus-navy">{authorName}</span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-verification-green/10 px-2 py-0.5 text-xs font-medium text-verification-green">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
              {isExpert && (
                <span className="inline-flex items-center gap-1 rounded-full bg-clarus-gold/10 px-2 py-0.5 text-xs font-medium text-clarus-gold">
                  Expert
                </span>
              )}
            </div>
            {authorTitle && <p className="text-xs text-slate">{authorTitle}</p>}
          </div>

          <span className="text-xs text-slate">{date}</span>
        </div>

        {/* Property Name */}
        {propertyName && (
          <p className="mt-2 text-sm text-slate">
            Review of <span className="font-medium text-clarus-navy">{propertyName}</span>
          </p>
        )}

        {/* Rating Stars */}
        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn('h-4 w-4', i < rating ? 'text-clarus-gold' : 'text-stone')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-slate">{rating}/5</span>
        </div>

        {/* Goal Achievement */}
        {goalAchievement !== undefined && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-stone/50 px-3 py-2">
            <span className="text-xs text-slate">Goal Achievement:</span>
            <div className="flex-1 h-1.5 rounded-full bg-stone">
              <div
                className="h-full rounded-full bg-verification-green"
                style={{ width: `${goalAchievement}%` }}
              />
            </div>
            <span className="text-xs font-medium text-clarus-navy">{goalAchievement}%</span>
          </div>
        )}

        {/* Content */}
        <p className="mt-4 text-sm leading-relaxed text-clarus-navy">{content}</p>
      </div>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';
