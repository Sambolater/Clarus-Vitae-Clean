import { cn } from '@clarus-vitae/utils';
import { forwardRef, type ReactNode, useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Tooltip component for hover information.
 *
 * Wrap the trigger element as a child.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, position = 'top', delay = 200, children, className }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const positionStyles = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowStyles = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-clarus-navy border-x-transparent border-b-transparent',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-clarus-navy border-x-transparent border-t-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-clarus-navy border-y-transparent border-r-transparent',
      right: 'right-full top-1/2 -translate-y-1/2 border-r-clarus-navy border-y-transparent border-l-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
        {isVisible && (
          <div
            role="tooltip"
            className={cn(
              'absolute z-50 whitespace-nowrap rounded-md bg-clarus-navy px-3 py-1.5 text-sm text-white shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
              positionStyles[position]
            )}
          >
            {content}
            <span
              className={cn(
                'absolute h-0 w-0 border-4',
                arrowStyles[position]
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
