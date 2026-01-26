'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/treatments', label: 'Treatments' },
  { href: '/articles', label: 'Articles' },
  { href: '/about/methodology', label: 'Methodology' },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-display text-xl text-clarus-navy">Clarus Vitae</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate transition-colors hover:text-clarus-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/inquire"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-md bg-clarus-navy px-6 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-clarus-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
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
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone/50 bg-white">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-base font-medium text-slate transition-colors hover:text-clarus-navy hover:bg-stone/50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-stone/50 mt-2">
              <Link
                href="/inquire"
                className="block w-full text-center py-3 rounded-md bg-clarus-navy text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
