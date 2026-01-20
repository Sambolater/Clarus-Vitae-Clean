'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Privacy Dashboard Page
 *
 * User-facing privacy dashboard for:
 * - Viewing what data we have
 * - Downloading data (GDPR export)
 * - Deleting all data
 * - Updating consent preferences
 */

interface DataItem {
  category: string;
  description: string;
  count: number;
  action: 'delete' | 'anonymize';
}

export default function PrivacyDashboardPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'dashboard'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<DataItem[] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/privacy/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setStep('verify');
    } catch {
      setError('Unable to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/privacy/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      setUserData(data.items);
      setStep('dashboard');
    } catch {
      setError('Invalid or expired verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data export
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clarus-vitae-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Unable to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data deletion
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, includeBackups: true }),
      });

      if (!response.ok) {
        throw new Error('Deletion failed');
      }

      setDeleteRequested(true);
      setShowDeleteConfirm(false);
    } catch {
      setError('Unable to process deletion request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email entry step
  if (step === 'email') {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-clarus-navy py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
              Privacy Dashboard
            </h1>
            <p className="mt-4 text-lg text-white/80">
              View, export, or delete your data.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-lg border border-stone bg-white p-6 shadow-card">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-clarus-navy/10">
              <svg
                className="h-6 w-6 text-clarus-navy"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-clarus-navy">
              Access Your Data
            </h2>
            <p className="mt-2 text-sm text-slate">
              Enter the email address you've used with Clarus Vitae. We'll send you
              a verification code to access your data.
            </p>

            <form onSubmit={handleEmailSubmit} className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-clarus-navy">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-stone px-4 py-3 text-clarus-navy placeholder:text-slate/50 focus:border-clarus-navy focus:outline-none focus:ring-2 focus:ring-clarus-navy/20"
                placeholder="your@email.com"
              />

              {error && (
                <p className="mt-2 text-sm text-error-red">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="mt-4 w-full rounded-md bg-clarus-navy px-4 py-3 text-sm font-medium text-white hover:bg-clarus-navy/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate">
              No data associated with this email?{' '}
              <Link href="/privacy" className="text-clarus-navy hover:underline">
                Learn about our privacy practices
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Verification step
  if (step === 'verify') {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-clarus-navy py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
              Verify Your Identity
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Enter the code we sent to {email}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-lg border border-stone bg-white p-6 shadow-card">
            <form onSubmit={handleVerifySubmit}>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-clarus-navy"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className="mt-2 block w-full rounded-md border border-stone px-4 py-3 text-center text-2xl font-mono tracking-widest text-clarus-navy placeholder:text-slate/50 focus:border-clarus-navy focus:outline-none focus:ring-2 focus:ring-clarus-navy/20"
                placeholder="000000"
              />

              {error && (
                <p className="mt-2 text-sm text-error-red">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="mt-4 w-full rounded-md bg-clarus-navy px-4 py-3 text-sm font-medium text-white hover:bg-clarus-navy/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify & Access Data'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="mt-4 w-full text-center text-sm text-slate hover:text-clarus-navy"
            >
              Use a different email
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Deletion confirmed view
  if (deleteRequested) {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-clarus-navy py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
              Deletion Requested
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="rounded-lg border border-verification-green/30 bg-verification-green/5 p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verification-green/20">
              <svg
                className="h-8 w-8 text-verification-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-medium text-clarus-navy">
              Deletion Request Received
            </h2>
            <p className="mt-2 text-slate">
              We've received your request to delete all your data. Your data will be
              removed from our active systems within 7 days and from backups within
              30 days.
            </p>
            <p className="mt-4 text-sm text-slate">
              You'll receive a confirmation email when the deletion is complete.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-clarus-navy px-6 py-3 text-sm font-medium text-white hover:bg-clarus-navy/90 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Dashboard view
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-clarus-navy py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            Your Data
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Here's everything we have stored about you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* Data Summary */}
        <section className="rounded-lg border border-stone bg-white p-6">
          <h2 className="text-lg font-medium text-clarus-navy">Data Summary</h2>
          <p className="mt-1 text-sm text-slate">
            Associated with {email}
          </p>

          {userData && userData.length > 0 ? (
            <div className="mt-6 space-y-3">
              {userData.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-stone bg-warm-gray p-4"
                >
                  <div>
                    <p className="font-medium text-clarus-navy">{item.category}</p>
                    <p className="text-sm text-slate">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-clarus-navy">
                      {item.count}
                    </p>
                    <p className="text-xs text-slate">
                      Will be {item.action === 'delete' ? 'deleted' : 'anonymized'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-stone bg-warm-gray p-6 text-center">
              <p className="text-slate">No data found for this email address.</p>
            </div>
          )}
        </section>

        {/* Actions */}
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-medium text-clarus-navy">Actions</h2>

          {/* Export */}
          <div className="rounded-lg border border-stone bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clarus-navy/10">
                <svg
                  className="h-5 w-5 text-clarus-navy"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-clarus-navy">Export Your Data</h3>
                <p className="mt-1 text-sm text-slate">
                  Download all your data in JSON format.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isLoading || !userData || userData.length === 0}
                className="shrink-0 rounded-md border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-clarus-navy/5 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>

          {/* Delete */}
          {showDeleteConfirm ? (
            <div className="rounded-lg border border-error-red/30 bg-error-red/5 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 shrink-0 text-error-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-error-red">
                    Confirm Data Deletion
                  </p>
                  <p className="mt-1 text-sm text-slate">
                    This will permanently delete all your data. This action cannot be
                    undone. Your data will be removed from active systems within 7
                    days and from backups within 30 days.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 rounded-md bg-error-red px-4 py-2 text-sm font-medium text-white hover:bg-error-red/90 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Delete All My Data'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="flex-1 rounded-md border border-stone px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-stone bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-red/10">
                  <svg
                    className="h-5 w-5 text-error-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-clarus-navy">Delete All Data</h3>
                  <p className="mt-1 text-sm text-slate">
                    Permanently remove all your data from our systems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={!userData || userData.length === 0}
                  className="shrink-0 rounded-md border border-error-red/30 px-4 py-2 text-sm font-medium text-error-red hover:bg-error-red/5 disabled:opacity-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </section>

        {error && (
          <p className="mt-4 text-center text-sm text-error-red">{error}</p>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-sm text-slate hover:text-clarus-navy hover:underline"
          >
            Back to Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
