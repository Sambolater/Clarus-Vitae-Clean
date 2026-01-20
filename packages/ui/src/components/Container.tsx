import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
}

const sizeStyles = {
  default: 'max-w-content',
  narrow: 'max-w-3xl',
  wide: 'max-w-7xl',
};

/**
 * Container component for consistent page width and padding
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full px-6 md:px-8', sizeStyles[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
