import { cn } from '@clarus-vitae/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-clarus-navy text-white hover:bg-clarus-navy/90 focus-visible:ring-clarus-navy',
  secondary:
    'border border-clarus-navy bg-transparent text-clarus-navy hover:bg-stone focus-visible:ring-clarus-navy',
  tertiary:
    'bg-stone text-clarus-navy hover:bg-stone/80 focus-visible:ring-clarus-navy',
  text: 'bg-transparent text-clarus-navy hover:underline focus-visible:ring-clarus-navy',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-8 text-sm',
  lg: 'h-14 px-10 text-base',
};

/**
 * Button component following Clarus Vitae design system
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
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
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
