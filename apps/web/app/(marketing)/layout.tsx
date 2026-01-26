import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Site Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-display text-xl text-clarus-navy">Clarus Vitae</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-sm font-medium text-slate transition-colors hover:text-clarus-navy"
            >
              Properties
            </Link>
            <Link
              href="/treatments"
              className="text-sm font-medium text-slate transition-colors hover:text-clarus-navy"
            >
              Treatments
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-slate transition-colors hover:text-clarus-navy"
            >
              Articles
            </Link>
            <Link
              href="/about/methodology"
              className="text-sm font-medium text-slate transition-colors hover:text-clarus-navy"
            >
              Methodology
            </Link>
          </nav>

          {/* CTA */}
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
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {children}
      {/* Footer will be added in UI component library task */}
    </>
  );
}
