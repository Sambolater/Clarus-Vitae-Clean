import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type EvidenceLevelType = 'STRONG' | 'MODERATE' | 'EMERGING' | 'EXPERIMENTAL' | 'TRADITIONAL';

export interface EvidenceLevelProps extends HTMLAttributes<HTMLDivElement> {
  level: EvidenceLevelType;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const evidenceConfig: Record<
  EvidenceLevelType,
  { label: string; description: string; color: string; bgColor: string; icon: string }
> = {
  STRONG: {
    label: 'Strong Evidence',
    description: 'Multiple high-quality studies support efficacy',
    color: 'text-verification-green',
    bgColor: 'bg-verification-green/10',
    icon: '●●●●',
  },
  MODERATE: {
    label: 'Moderate Evidence',
    description: 'Some clinical studies show positive results',
    color: 'text-clarus-navy',
    bgColor: 'bg-clarus-navy/10',
    icon: '●●●○',
  },
  EMERGING: {
    label: 'Emerging Evidence',
    description: 'Early research shows promise, more studies needed',
    color: 'text-clarus-gold',
    bgColor: 'bg-clarus-gold/10',
    icon: '●●○○',
  },
  EXPERIMENTAL: {
    label: 'Experimental',
    description: 'Limited clinical data, primarily theoretical basis',
    color: 'text-slate',
    bgColor: 'bg-slate/10',
    icon: '●○○○',
  },
  TRADITIONAL: {
    label: 'Traditional Practice',
    description: 'Based on historical use, limited modern research',
    color: 'text-tier-3',
    bgColor: 'bg-tier-3/10',
    icon: '◆',
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-1 gap-1.5',
  md: 'text-sm px-3 py-1.5 gap-2',
  lg: 'text-base px-4 py-2 gap-2.5',
};

/**
 * EvidenceLevel component for displaying research backing level of treatments.
 *
 * Levels indicate the scientific rigor behind a treatment:
 * - STRONG: Multiple high-quality clinical studies
 * - MODERATE: Some clinical evidence
 * - EMERGING: Early promising research
 * - EXPERIMENTAL: Limited scientific data
 * - TRADITIONAL: Historical practice-based
 */
export const EvidenceLevel = forwardRef<HTMLDivElement, EvidenceLevelProps>(
  ({ level, size = 'md', showDescription = false, className, ...props }, ref) => {
    const config = evidenceConfig[level];

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md font-medium',
          config.bgColor,
          config.color,
          sizeStyles[size],
          className
        )}
        role="status"
        aria-label={`Evidence level: ${config.label}`}
        {...props}
      >
        <span className="font-mono text-xs tracking-tighter">{config.icon}</span>
        <span>{config.label}</span>
        {showDescription && (
          <span className="ml-1 text-slate opacity-70">— {config.description}</span>
        )}
      </div>
    );
  }
);

EvidenceLevel.displayName = 'EvidenceLevel';
