import { cn } from '@clarus-vitae/utils';
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text' | 'premium' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-clarus-navy text-white hover:bg-clarus-navy/90 focus-visible:ring-clarus-navy',
  secondary:
    'border border-clarus-navy bg-transparent text-clarus-navy hover:bg-stone focus-visible:ring-clarus-navy',
  tertiary:
    'bg-stone text-clarus-navy hover:bg-stone/80 focus-visible:ring-clarus-navy',
  text: 'bg-transparent text-clarus-navy hover:underline focus-visible:ring-clarus-navy',
  premium:
    'bg-clarus-gold text-clarus-navy hover:bg-clarus-gold/90 focus-visible:ring-clarus-gold',
  danger:
    'bg-error-red text-white hover:bg-error-red/90 focus-visible:ring-error-red',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-12 px-8 text-sm gap-2',
  lg: 'h-14 px-10 text-base gap-2.5',
};

/**
 * Button component following Clarus Vitae design system.
 *
 * Variants:
 * - `primary` - Main CTAs with navy background
 * - `secondary` - Outlined alternative actions
 * - `tertiary` - Low-emphasis actions with subtle background
 * - `text` - Inline links with minimal styling
 * - `premium` - Special CTAs with gold accent for high-value actions
 * - `danger` - Destructive actions
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading ? (
          <span className="shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
