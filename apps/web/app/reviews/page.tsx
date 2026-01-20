import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Outcome-focused reviews from verified guests, measuring what actually matters.',
};

export default function ReviewsPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Reviews
      </h1>
      <p className="mt-4 text-slate">
        Review system will be implemented in Task 10.
      </p>
    </main>
  );
}
