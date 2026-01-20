import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingLevel;
}

const sizeStyles: Record<HeadingLevel, string> = {
  h1: 'font-display text-display-h1',
  h2: 'font-display text-display-h2',
  h3: 'font-display text-display-h3',
  h4: 'font-body text-xl font-semibold',
  h5: 'font-body text-lg font-semibold',
  h6: 'font-body text-base font-semibold',
};

/**
 * Heading component with semantic HTML and consistent styling
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', size, className, children, ...props }, ref) => {
    const sizeKey = size || Tag;

    return (
      <Tag
        ref={ref}
        className={cn('text-clarus-navy', sizeStyles[sizeKey], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
