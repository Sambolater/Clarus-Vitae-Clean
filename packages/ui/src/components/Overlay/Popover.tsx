import { cn } from '@clarus-vitae/utils';
import { forwardRef, type ReactNode, useState, useRef, useEffect } from 'react';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  closeOnClickOutside?: boolean;
  className?: string;
}

/**
 * Popover component for click-triggered info panels.
 *
 * More persistent than tooltips - stays open until clicked away.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      content,
      position = 'bottom',
      align = 'center',
      closeOnClickOutside = true,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!closeOnClickOutside) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, closeOnClickOutside]);

    const getPositionStyles = () => {
      const positions = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
      };

      const alignments = {
        start: position === 'top' || position === 'bottom' ? 'left-0' : 'top-0',
        center:
          position === 'top' || position === 'bottom'
            ? 'left-1/2 -translate-x-1/2'
            : 'top-1/2 -translate-y-1/2',
        end: position === 'top' || position === 'bottom' ? 'right-0' : 'bottom-0',
      };

      return cn(positions[position], alignments[align]);
    };

    return (
      <div ref={popoverRef} className={cn('relative inline-block', className)}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            ref={ref}
            role="dialog"
            className={cn(
              'absolute z-50 min-w-[200px] rounded-lg bg-white p-4 shadow-card-hover border border-stone',
              'animate-in fade-in-0 zoom-in-95',
              getPositionStyles()
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = 'Popover';
