'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState, useCallback } from 'react';

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  showValues?: boolean;
}

/**
 * RangeSlider component for selecting a range of values.
 *
 * Used for:
 * - Price range filters
 * - Duration filters
 * - Score range filters
 */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      label,
      min,
      max,
      step = 1,
      value,
      onChange,
      formatValue = (v) => v.toString(),
      showValues = true,
      className,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);

    const handleMinChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), localValue[1] - step);
        const newValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
      },
      [localValue, step, onChange]
    );

    const handleMaxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), localValue[0] + step);
        const newValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newValue);
        onChange(newValue);
      },
      [localValue, step, onChange]
    );

    const minPercent = ((localValue[0] - min) / (max - min)) * 100;
    const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-clarus-navy">{label}</label>
        )}

        {showValues && (
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-clarus-navy">{formatValue(localValue[0])}</span>
            <span className="text-slate">to</span>
            <span className="font-medium text-clarus-navy">{formatValue(localValue[1])}</span>
          </div>
        )}

        <div className="relative h-2">
          {/* Track background */}
          <div className="absolute inset-0 rounded-full bg-stone" />

          {/* Active track */}
          <div
            className="absolute top-0 h-2 rounded-full bg-clarus-navy"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* Min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[0]}
            onChange={handleMinChange}
            className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-clarus-navy [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            aria-label="Minimum value"
          />

          {/* Max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[1]}
            onChange={handleMaxChange}
            className="pointer-events-none absolute inset-0 h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-clarus-navy [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            aria-label="Maximum value"
          />
        </div>

        {/* Min/Max labels */}
        <div className="mt-1 flex items-center justify-between text-xs text-slate">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
