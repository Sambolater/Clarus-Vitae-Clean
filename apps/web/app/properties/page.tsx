import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties',
  description:
    'Explore the world\'s finest wellness destinations, evaluated with our proprietary Clarus Index methodology.',
};

export default function PropertiesPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Wellness Properties
      </h1>
      <p className="mt-4 text-slate">
        Property listings will be implemented in Task 04.
      </p>
    </main>
  );
}
