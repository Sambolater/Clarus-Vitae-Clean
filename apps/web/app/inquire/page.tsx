import { db } from '@clarus-vitae/database';
import { Container, Heading } from '@clarus-vitae/ui';
import type { Metadata } from 'next';

import { GeneralInquiryForm } from './_components/GeneralInquiryForm';

export const metadata: Metadata = {
  title: 'Make an Inquiry | Clarus Vitae',
  description:
    'Submit a private, secure inquiry about wellness properties. Your privacy is our priority.',
};

export const dynamic = 'force-dynamic';

/**
 * Inquiry hub page - general inquiry form with property selection
 */
export default async function InquirePage() {
  // Get all published properties for the dropdown
  const allProperties = await db.property.findMany({
    where: { published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="py-12">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Heading as="h1">Make an Inquiry</Heading>
          <p className="mt-4 text-lg text-slate">
            Connect with the world&apos;s finest wellness destinations. Your inquiry
            is encrypted and only shared with your chosen property.
          </p>
        </div>

        {/* Privacy Assurance */}
        <div className="max-w-2xl mx-auto mb-12 p-6 rounded-lg border border-verification-green/20 bg-verification-green/5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-verification-green/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-verification-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-clarus-navy">Your Privacy Protected</h2>
              <ul className="mt-2 space-y-1 text-sm text-clarus-navy/80">
                <li>All inquiry data is encrypted before storage</li>
                <li>Information shared only with your chosen property</li>
                <li>Never sold to third parties or data brokers</li>
                <li>Enhanced privacy options available for sensitive inquiries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <GeneralInquiryForm properties={allProperties} className="mb-12" />
      </Container>
    </main>
  );
}
