import { cn } from '@clarus-vitae/utils';
import { type InputHTMLAttributes, forwardRef, createContext, useContext } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const RadioGroupContext = createContext<{
  name: string;
  value?: string;
  onChange?: (value: string) => void;
} | null>(null);

interface RadioItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  description?: string;
  value: string;
}

const RadioItem = forwardRef<HTMLInputElement, RadioItemProps>(
  ({ label, description, value, className, id, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('RadioItem must be used within RadioGroup');

    const radioId = id || `${context.name}-${value}`;
    const isChecked = context.value === value;

    return (
      <div className={cn('flex items-start', className)}>
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={context.name}
            value={value}
            checked={isChecked}
            onChange={() => context.onChange?.(value)}
            className={cn(
              'h-5 w-5 border-stone text-clarus-navy',
              'focus:ring-2 focus:ring-clarus-navy focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            {...props}
          />
        </div>
        <div className="ml-3">
          <label htmlFor={radioId} className="text-sm font-medium text-clarus-navy cursor-pointer">
            {label}
          </label>
          {description && <p className="text-sm text-slate">{description}</p>}
        </div>
      </div>
    );
  }
);

RadioItem.displayName = 'RadioItem';

/**
 * RadioGroup component for grouped radio button selections.
 *
 * Features:
 * - Horizontal or vertical orientation
 * - Optional descriptions for each option
 * - Error state support
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, label, options, value, onChange, error, orientation = 'vertical', className }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ name, value, onChange }}>
        <div ref={ref} className={className} role="radiogroup" aria-label={label}>
          {label && (
            <p className="mb-2 text-sm font-medium text-clarus-navy">{label}</p>
          )}
          <div
            className={cn(
              orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3'
            )}
          >
            {options.map((option) => (
              <RadioItem
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                disabled={option.disabled}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-error-red" role="alert">
              {error}
            </p>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
