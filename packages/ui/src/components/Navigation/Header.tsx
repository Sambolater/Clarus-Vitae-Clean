'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode, useState } from 'react';

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  logoHref?: string;
  links?: NavLink[];
  cta?: ReactNode;
  showResearchMode?: boolean;
}

/**
 * Header component for main site navigation.
 *
 * Features:
 * - Logo with link
 * - Navigation links
 * - CTA button
 * - Mobile hamburger menu
 * - Research Mode indicator
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logo, logoHref = '/', links = [], cta, showResearchMode, className, ...props }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <header
        ref={ref}
        className={cn('sticky top-0 z-50 bg-white border-b border-stone', className)}
        {...props}
      >
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <a href={logoHref} className="flex items-center">
            {logo || (
              <span className="font-display text-xl text-clarus-navy">Clarus Vitae</span>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  link.isActive
                    ? 'text-clarus-navy'
                    : 'text-slate hover:text-clarus-navy'
                )}
                aria-current={link.isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Research Mode Indicator */}
            {showResearchMode && (
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-verification-green/10 px-3 py-1 text-xs font-medium text-verification-green">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Research Mode
              </div>
            )}

            {/* CTA */}
            {cta && <div className="hidden md:block">{cta}</div>}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-md text-slate hover:text-clarus-navy"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone bg-white">
            <nav className="flex flex-col p-4 gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    link.isActive
                      ? 'bg-stone text-clarus-navy'
                      : 'text-slate hover:bg-stone hover:text-clarus-navy'
                  )}
                  aria-current={link.isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
              {cta && <div className="mt-3 pt-3 border-t border-stone">{cta}</div>}
            </nav>
          </div>
        )}
      </header>
    );
  }
);

Header.displayName = 'Header';
