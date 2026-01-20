import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface PropertyRecognition {
  /** Properties that excel in specific areas */
  isEditorsChoice: boolean;
  /** Category of excellence, e.g., "Best for Longevity", "Best for Executive Burnout" */
  editorsChoiceCategory?: string;
  /** Properties where our team has completed full programs */
  isVerifiedExcellence: boolean;
  /** Newer properties showing exceptional promise */
  isRisingStar: boolean;
}

export interface RecognitionBadgesProps extends HTMLAttributes<HTMLDivElement> {
  recognition: PropertyRecognition;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'stacked';
  showLabels?: boolean;
}

const sizeStyles = {
  sm: {
    badge: 'px-2 py-0.5 text-[10px]',
    icon: 'h-3 w-3',
    gap: 'gap-1.5',
  },
  md: {
    badge: 'px-3 py-1 text-xs',
    icon: 'h-4 w-4',
    gap: 'gap-2',
  },
  lg: {
    badge: 'px-4 py-1.5 text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-3',
  },
};

/**
 * Editor's Choice shield icon
 */
function EditorsChoiceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

/**
 * Verified Excellence checkmark with star icon
 */
function VerifiedExcellenceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/**
 * Rising Star ascending star icon
 */
function RisingStarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
      <path d="M18 6l3-3M21 3v4M21 3h-4" />
    </svg>
  );
}

/**
 * Individual badge component
 */
interface BadgeProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  colorClasses: {
    bg: string;
    text: string;
    iconBg: string;
  };
  size: 'sm' | 'md' | 'lg';
  showLabel: boolean;
}

function Badge({ icon, label, sublabel, colorClasses, size, showLabel }: BadgeProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium uppercase tracking-wider',
        styles.badge,
        colorClasses.bg,
        colorClasses.text
      )}
      title={`${label}${sublabel ? `: ${sublabel}` : ''}`}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-full',
          showLabel ? 'mr-1.5' : '',
          colorClasses.iconBg
        )}
      >
        {icon}
      </span>
      {showLabel && (
        <span className="whitespace-nowrap">
          {label}
          {sublabel && size !== 'sm' && (
            <span className="ml-1 font-normal opacity-80">({sublabel})</span>
          )}
        </span>
      )}
    </div>
  );
}

/**
 * RecognitionBadges component displays recognition awards for properties.
 *
 * Shows Editor's Choice, Verified Excellence, and Rising Star badges
 * with visual distinction for each recognition type.
 */
export const RecognitionBadges = forwardRef<HTMLDivElement, RecognitionBadgesProps>(
  (
    {
      recognition,
      size = 'md',
      layout = 'inline',
      showLabels = true,
      className,
      ...props
    },
    ref
  ) => {
    const { isEditorsChoice, editorsChoiceCategory, isVerifiedExcellence, isRisingStar } =
      recognition;
    const styles = sizeStyles[size];

    // Don't render anything if no recognition
    if (!isEditorsChoice && !isVerifiedExcellence && !isRisingStar) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap',
          layout === 'inline' ? 'flex-row items-center' : 'flex-col items-start',
          styles.gap,
          className
        )}
        {...props}
      >
        {isEditorsChoice && (
          <Badge
            icon={<EditorsChoiceIcon className={styles.icon} />}
            label="Editor's Choice"
            sublabel={editorsChoiceCategory}
            colorClasses={{
              bg: 'bg-clarus-gold/10',
              text: 'text-clarus-gold',
              iconBg: '',
            }}
            size={size}
            showLabel={showLabels}
          />
        )}

        {isVerifiedExcellence && (
          <Badge
            icon={<VerifiedExcellenceIcon className={styles.icon} />}
            label="Verified Excellence"
            colorClasses={{
              bg: 'bg-verification-green/10',
              text: 'text-verification-green',
              iconBg: '',
            }}
            size={size}
            showLabel={showLabels}
          />
        )}

        {isRisingStar && (
          <Badge
            icon={<RisingStarIcon className={styles.icon} />}
            label="Rising Star"
            colorClasses={{
              bg: 'bg-clarus-navy/10',
              text: 'text-clarus-navy',
              iconBg: '',
            }}
            size={size}
            showLabel={showLabels}
          />
        )}
      </div>
    );
  }
);

RecognitionBadges.displayName = 'RecognitionBadges';
