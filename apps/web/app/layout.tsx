import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

import { ComparisonBarWrapper } from '@/components/ComparisonBarWrapper';
import { WebVitals } from '@/components/WebVitals';

/**
 * Font Configuration
 *
 * Using system font stacks for reliability and privacy.
 * CSS custom properties are defined in globals.css.
 * This ensures builds succeed without network access.
 */

export const metadata: Metadata = {
  title: {
    default: "Clarus Vitae | Clarity for Life's Most Important Decisions",
    template: '%s | Clarus Vitae',
  },
  description:
    'Outcomes intelligence for high-stakes wellness decisions. Verified, independent analysis for premium wellness investments.',
  keywords: [
    'wellness',
    'longevity',
    'luxury spa',
    'medical wellness',
    'health optimization',
    'wellness retreat',
    'clarus index',
  ],
  authors: [{ name: 'Clarus Vitae' }],
  creator: 'Clarus Vitae',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://clarusvitae.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clarusvitae.com',
    siteName: 'Clarus Vitae',
    title: "Clarus Vitae | Clarity for Life's Most Important Decisions",
    description:
      'Outcomes intelligence for high-stakes wellness decisions. Verified, independent analysis for premium wellness investments.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Clarus Vitae | Clarity for Life's Most Important Decisions",
    description:
      'Outcomes intelligence for high-stakes wellness decisions. Verified, independent analysis for premium wellness investments.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A2B4A', // Clarus Navy
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-clarus-white pb-20 font-body text-clarus-navy antialiased lg:pb-0">
        {children}
        <ComparisonBarWrapper />
        <WebVitals />
      </body>
    </html>
  );
}
