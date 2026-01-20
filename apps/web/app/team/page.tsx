import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Advisory Team',
  description:
    'Meet the experts behind every Clarus Vitae assessment. Real credentials, real expertise, real accountability.',
};

export default function TeamPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Our Advisory Team
      </h1>
      <p className="mt-4 text-slate">
        Advisory team profiles will be implemented in Task 12.
      </p>
    </main>
  );
}
