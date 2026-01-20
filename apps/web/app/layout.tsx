import type { Metadata } from 'next';
import '@/styles/globals.css';

import { ComparisonBarWrapper } from '@/components/ComparisonBarWrapper';

/**
 * Font Configuration
 *
 * In production, this uses Google Fonts (Inter and Cormorant Garamond).
 * For local development without network access, system fonts are used as fallback.
 *
 * To enable Google Fonts, uncomment the following and update the html className:
 *
 * import { Inter, Cormorant_Garamond } from 'next/font/google';
 *
 * const inter = Inter({
 *   subsets: ['latin'],
 *   display: 'swap',
 *   variable: '--font-inter',
 * });
 *
 * const cormorant = Cormorant_Garamond({
 *   subsets: ['latin'],
 *   display: 'swap',
 *   weight: ['400', '500', '600', '700'],
 *   variable: '--font-cormorant',
 * });
 *
 * Then use: className={`${inter.variable} ${cormorant.variable}`}
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-clarus-white pb-20 font-body text-clarus-navy antialiased lg:pb-0">
        {children}
        <ComparisonBarWrapper />
      </body>
    </html>
  );
}
