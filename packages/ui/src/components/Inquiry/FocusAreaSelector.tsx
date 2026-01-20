'use client';

import { FOCUS_AREA_OPTIONS } from '@clarus-vitae/types';
import { cn } from '@clarus-vitae/utils';

// ============================================
// TYPES
// ============================================

export interface FocusAreaSelectorProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  maxSelections?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Multi-select component for wellness focus areas.
 * Displays as a grid of toggleable chips.
 */
export function FocusAreaSelector({
  label,
  value,
  onChange,
  error,
  maxSelections = 5,
  className,
}: FocusAreaSelectorProps) {
  const handleToggle = (focusArea: string) => {
    if (value.includes(focusArea)) {
      onChange(value.filter((v) => v !== focusArea));
    } else if (value.length < maxSelections) {
      onChange([...value, focusArea]);
    }
  };

  const isMaxReached = value.length >= maxSelections;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-clarus-navy">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {FOCUS_AREA_OPTIONS.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              disabled={isDisabled}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm transition-colors',
                'border focus:outline-none focus:ring-2 focus:ring-clarus-navy focus:ring-offset-2',
                isSelected
                  ? 'border-clarus-navy bg-clarus-navy text-white'
                  : 'border-stone bg-white text-clarus-navy hover:border-clarus-navy/50',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="mt-2 text-sm text-slate">
          {value.length} of {maxSelections} selected
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-error-red" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

FocusAreaSelector.displayName = 'FocusAreaSelector';
