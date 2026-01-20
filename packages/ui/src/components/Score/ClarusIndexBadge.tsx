import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type IndexTier = 'EXCEPTIONAL' | 'DISTINGUISHED' | 'NOTABLE' | 'CURATED';

export interface ClarusIndexBadgeProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  size?: BadgeSize;
  showLabel?: boolean;
}

function getTier(score: number): IndexTier {
  if (score >= 90) return 'EXCEPTIONAL';
  if (score >= 80) return 'DISTINGUISHED';
  if (score >= 70) return 'NOTABLE';
  return 'CURATED';
}

function getTierLabel(tier: IndexTier): string {
  const labels: Record<IndexTier, string> = {
    EXCEPTIONAL: 'Exceptional',
    DISTINGUISHED: 'Distinguished',
    NOTABLE: 'Notable',
    CURATED: 'Curated',
  };
  return labels[tier];
}

const sizeStyles: Record<BadgeSize, { container: string; score: string; label: string }> = {
  sm: {
    container: 'h-8 w-8',
    score: 'text-sm font-semibold',
    label: 'hidden',
  },
  md: {
    container: 'h-16 w-16',
    score: 'text-2xl font-display',
    label: 'text-[10px] uppercase tracking-wider',
  },
  lg: {
    container: 'h-[120px] w-[120px]',
    score: 'text-index-score font-display',
    label: 'text-label uppercase tracking-wider mt-1',
  },
};

const tierStyles: Record<IndexTier, { bg: string; scoreColor: string; labelColor: string }> = {
  EXCEPTIONAL: {
    bg: 'bg-clarus-navy',
    scoreColor: 'text-clarus-gold',
    labelColor: 'text-clarus-gold',
  },
  DISTINGUISHED: {
    bg: 'bg-clarus-navy',
    scoreColor: 'text-white',
    labelColor: 'text-white/80',
  },
  NOTABLE: {
    bg: 'bg-slate',
    scoreColor: 'text-white',
    labelColor: 'text-white/80',
  },
  CURATED: {
    bg: 'bg-stone',
    scoreColor: 'text-clarus-navy',
    labelColor: 'text-clarus-navy/70',
  },
};

/**
 * Clarus Index score badge component
 */
export const ClarusIndexBadge = forwardRef<HTMLDivElement, ClarusIndexBadgeProps>(
  ({ score, size = 'md', showLabel = true, className, ...props }, ref) => {
    const tier = getTier(score);
    const tierLabel = getTierLabel(tier);
    const styles = sizeStyles[size];
    const colors = tierStyles[tier];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-full',
          styles.container,
          colors.bg,
          className
        )}
        aria-label={`Clarus Index Score: ${score} - ${tierLabel}`}
        {...props}
      >
        <span className={cn(styles.score, colors.scoreColor)}>{score}</span>
        {showLabel && size !== 'sm' && (
          <span className={cn(styles.label, colors.labelColor)}>{tierLabel}</span>
        )}
      </div>
    );
  }
);

ClarusIndexBadge.displayName = 'ClarusIndexBadge';
