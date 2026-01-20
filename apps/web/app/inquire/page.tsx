import { db } from '@clarus-vitae/database';
import { Container, Heading, Button } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Make an Inquiry | Clarus Vitae',
  description:
    'Submit a private, secure inquiry about wellness properties. Your privacy is our priority.',
};

export const dynamic = 'force-dynamic';

/**
 * Inquiry hub page - shows featured properties to inquire about
 * Users typically come here from a property page with a specific property in mind
 */
export default async function InquirePage() {
  // Get featured properties for general inquiry
  const featuredProperties = await db.property.findMany({
    where: {
      published: true,
      featured: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      tier: true,
      city: true,
      country: true,
      overallScore: true,
    },
    orderBy: { overallScore: 'desc' },
    take: 6,
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

        {/* How to Inquire */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-xl font-medium text-clarus-navy mb-4 text-center">
            How to Make an Inquiry
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <span className="font-medium text-clarus-navy">1</span>
              </div>
              <h3 className="font-medium text-clarus-navy mb-1">Browse Properties</h3>
              <p className="text-sm text-slate">
                Explore our curated collection of wellness destinations
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <span className="font-medium text-clarus-navy">2</span>
              </div>
              <h3 className="font-medium text-clarus-navy mb-1">Submit Inquiry</h3>
              <p className="text-sm text-slate">
                Fill out our secure form with your goals and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-clarus-navy/10 flex items-center justify-center">
                <span className="font-medium text-clarus-navy">3</span>
              </div>
              <h3 className="font-medium text-clarus-navy mb-1">Get Response</h3>
              <p className="text-sm text-slate">
                The property will contact you directly within 2-3 business days
              </p>
            </div>
          </div>
        </div>

        {/* Featured Properties */}
        {featuredProperties.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl font-medium text-clarus-navy mb-6 text-center">
              Featured Properties
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProperties.map((property: typeof featuredProperties[number]) => (
                <Link
                  key={property.id}
                  href={`/inquire/${property.slug}`}
                  className="block p-4 rounded-lg border border-stone hover:border-clarus-navy transition-colors"
                >
                  <h3 className="font-medium text-clarus-navy">{property.name}</h3>
                  <p className="text-sm text-slate mt-1">
                    {property.city}, {property.country}
                  </p>
                  {property.overallScore && (
                    <p className="text-sm text-clarus-gold mt-2">
                      Clarus Index: {property.overallScore}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-slate mb-4">
            Not sure which property is right for you?
          </p>
          <Link href="/properties">
            <Button variant="primary" size="lg">
              Browse All Properties
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
