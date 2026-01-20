import { db } from '@clarus-vitae/database';
import { Container, Heading, Breadcrumbs } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { InquireClient } from './_components/InquireClient';

export const dynamic = 'force-dynamic';

interface InquirePropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InquirePropertyPageProps): Promise<Metadata> {
  const { slug } = await params;

  const property = await db.property.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!property) {
    return {
      title: 'Property Not Found | Clarus Vitae',
    };
  }

  return {
    title: `Inquire About ${property.name} | Clarus Vitae`,
    description: `Submit a private, secure inquiry about ${property.name}. Your privacy is protected.`,
  };
}

export default async function InquirePropertyPage({
  params,
}: InquirePropertyPageProps) {
  const { slug } = await params;

  const property = await db.property.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      tier: true,
      city: true,
      country: true,
      overallScore: true,
      programs: {
        where: { published: true },
        select: {
          id: true,
          name: true,
          durationDays: true,
          price: true,
        },
        orderBy: { price: 'asc' },
      },
      images: {
        where: { isFeatured: true },
        select: { url: true, alt: true },
        take: 1,
      },
    },
  });

  if (!property) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: property.name, href: `/properties/${property.slug}` },
    { label: 'Inquire', href: `/inquire/${property.slug}` },
  ];

  return (
    <main className="py-8">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading as="h1" className="mb-2">
              Inquire About {property.name}
            </Heading>
            <p className="text-slate">
              {property.city}, {property.country}
              {property.overallScore && (
                <span className="ml-2 text-clarus-gold">
                  Clarus Index: {property.overallScore}
                </span>
              )}
            </p>
          </div>

          {/* Client-side form component */}
          <InquireClient
            property={{
              id: property.id,
              name: property.name,
              slug: property.slug,
            }}
            programs={property.programs.map((p: { id: string; name: string }) => ({
              id: p.id,
              name: p.name,
            }))}
            featuredImage={property.images[0] || null}
          />
        </div>
      </Container>
    </main>
  );
}
