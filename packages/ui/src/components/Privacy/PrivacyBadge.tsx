import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type PrivacyLevel = 'standard' | 'enhanced' | 'maximum';

export interface PrivacyBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  level: PrivacyLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const levelConfig: Record<PrivacyLevel, { label: string; description: string; color: string }> = {
  standard: {
    label: 'Privacy Protected',
    description: 'Standard data protection',
    color: 'bg-slate/10 text-slate',
  },
  enhanced: {
    label: 'Enhanced Privacy',
    description: 'Additional encryption for sensitive data',
    color: 'bg-verification-green/10 text-verification-green',
  },
  maximum: {
    label: 'Maximum Privacy',
    description: 'End-to-end encryption, no data retention',
    color: 'bg-clarus-gold/10 text-clarus-gold',
  },
};

/**
 * PrivacyBadge component showing data handling policy level.
 */
export const PrivacyBadge = forwardRef<HTMLSpanElement, PrivacyBadgeProps>(
  ({ level, showLabel = true, size = 'md', className, ...props }, ref) => {
    const config = levelConfig[level];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          config.color,
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          className
        )}
        title={config.description}
        {...props}
      >
        <svg className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {showLabel && config.label}
      </span>
    );
  }
);

PrivacyBadge.displayName = 'PrivacyBadge';
