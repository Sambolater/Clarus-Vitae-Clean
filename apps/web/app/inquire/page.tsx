import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Make an Inquiry',
  description:
    'Submit a private, secure inquiry about wellness properties. Your privacy is our priority.',
};

export default function InquirePage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Make an Inquiry
      </h1>
      <p className="mt-4 text-slate">
        Inquiry system will be implemented in Task 11.
      </p>
    </main>
  );
}
