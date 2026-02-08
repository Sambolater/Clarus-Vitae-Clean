import { Container } from '@clarus-vitae/ui';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-stone bg-white py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy" className="text-slate hover:text-clarus-navy transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate hover:text-clarus-navy transition-colors">
              Terms
            </Link>
            <Link href="/disclaimer" className="text-slate hover:text-clarus-navy transition-colors">
              Disclaimer
            </Link>
            <Link href="/inquire" className="text-slate hover:text-clarus-navy transition-colors">
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate">
            &copy; {new Date().getFullYear()} Clarus Vitae. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
