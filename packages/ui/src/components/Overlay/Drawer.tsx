import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode, useEffect, useCallback } from 'react';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
}

const sizeStyles = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  full: 'max-w-full',
};

/**
 * Drawer component for side panels.
 *
 * Commonly used for:
 * - Mobile navigation
 * - Filters
 * - Detail views
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      position = 'right',
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.body.style.overflow = '';
        };
      }
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-clarus-navy/50 backdrop-blur-sm transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          className={cn(
            'absolute inset-y-0 flex w-full flex-col bg-white shadow-xl transition-transform',
            position === 'left' ? 'left-0' : 'right-0',
            sizeStyles[size],
            isOpen
              ? 'translate-x-0'
              : position === 'left'
              ? '-translate-x-full'
              : 'translate-x-full',
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone px-4 py-4">
            {title && (
              <h2 id="drawer-title" className="font-display text-lg text-clarus-navy">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-slate hover:text-clarus-navy transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-stone p-4">{footer}</div>
          )}
        </div>
      </div>
    );
  }
);

Drawer.displayName = 'Drawer';
