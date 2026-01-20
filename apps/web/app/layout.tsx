import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';

import { ComparisonBarWrapper } from '@/components/ComparisonBarWrapper';
import { WebVitals } from '@/components/WebVitals';

/**
 * Font Configuration
 *
 * Self-hosted via next/font for privacy (no external requests to Google).
 * Uses Inter for body/UI and Cormorant Garamond for headings.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Preload critical font weights
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  preload: true,
});

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
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-clarus-white pb-20 font-body text-clarus-navy antialiased lg:pb-0">
        {children}
        <ComparisonBarWrapper />
        <WebVitals />
      </body>
    </html>
  );
}
