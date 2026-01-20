'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState, useEffect } from 'react';

export interface ConsentOptions {
  essential: boolean;      // Always true, required for site function
  analytics: boolean;      // Self-hosted Plausible only
  functional: boolean;     // Saved comparisons, preferences
}

export interface CookieConsentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  onAcceptPrivate: () => void;
  onCustomize: (options: ConsentOptions) => void;
  onDismiss?: () => void;
  privacyPolicyUrl?: string;
  show?: boolean;
}

/**
 * CookieConsent component - Privacy-first cookie banner
 *
 * Unlike typical cookie banners that push users to "Accept All":
 * - Defaults to Research Mode (no tracking)
 * - Only appears once, briefly
 * - Doesn't block content
 * - Makes privacy the easy choice
 */
export const CookieConsent = forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      onAcceptPrivate,
      onCustomize,
      onDismiss,
      privacyPolicyUrl = '/privacy',
      show = true,
      className,
      ...props
    },
    ref
  ) => {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<ConsentOptions>({
      essential: true,
      analytics: false,
      functional: false,
    });

    if (!show) return null;

    const handleCustomize = () => {
      setShowSettings(true);
    };

    const handleSaveSettings = () => {
      onCustomize(settings);
      setShowSettings(false);
    };

    const handleContinuePrivately = () => {
      onAcceptPrivate();
    };

    // Settings panel
    if (showSettings) {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 border-t border-stone bg-white p-6 shadow-card-hover',
            'md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg md:border',
            className
          )}
          role="dialog"
          aria-label="Privacy settings"
          {...props}
        >
          <div className="mb-4">
            <h3 className="font-display text-lg font-medium text-clarus-navy">
              Privacy Settings
            </h3>
            <p className="mt-1 text-sm text-slate">
              Choose what data you allow us to use.
            </p>
          </div>

          <div className="space-y-4">
            {/* Essential - Always On */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-clarus-navy">Essential</p>
                <p className="text-xs text-slate">
                  Required for the website to function. Cannot be disabled.
                </p>
              </div>
              <div className="flex h-6 w-10 shrink-0 items-center rounded-full bg-clarus-navy cursor-not-allowed">
                <div className="ml-auto mr-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-clarus-navy">Analytics</p>
                <p className="text-xs text-slate">
                  Privacy-respecting analytics (Plausible). No personal data collected.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, analytics: !s.analytics }))}
                className={cn(
                  'flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
                  settings.analytics ? 'bg-clarus-navy' : 'bg-stone'
                )}
                role="switch"
                aria-checked={settings.analytics}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full bg-white transition-transform',
                    settings.analytics ? 'ml-auto mr-1' : 'ml-1'
                  )}
                />
              </button>
            </div>

            {/* Functional */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-clarus-navy">Preferences</p>
                <p className="text-xs text-slate">
                  Saves your preferences like comparisons and viewing history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, functional: !s.functional }))}
                className={cn(
                  'flex h-6 w-10 shrink-0 items-center rounded-full transition-colors',
                  settings.functional ? 'bg-clarus-navy' : 'bg-stone'
                )}
                role="switch"
                aria-checked={settings.functional}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full bg-white transition-transform',
                    settings.functional ? 'ml-auto mr-1' : 'ml-1'
                  )}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="flex-1 rounded-md border border-stone px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="flex-1 rounded-md bg-clarus-navy px-4 py-2 text-sm font-medium text-white hover:bg-clarus-navy/90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      );
    }

    // Main banner
    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 border-t border-stone bg-white p-4 shadow-card-hover',
          'md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg md:border',
          className
        )}
        role="dialog"
        aria-label="Privacy notice"
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verification-green/10">
            <svg
              className="h-5 w-5 text-verification-green"
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
          <div className="flex-1">
            <p className="text-sm text-clarus-navy">
              <span className="font-medium">Your privacy matters.</span> By default, we
              don't track you or use cookies.
            </p>
            <a
              href={privacyPolicyUrl}
              className="mt-1 inline-block text-xs text-slate hover:text-clarus-navy hover:underline"
            >
              Read our privacy policy
            </a>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleContinuePrivately}
            className="flex-1 rounded-md bg-clarus-navy px-4 py-2 text-sm font-medium text-white hover:bg-clarus-navy/90 transition-colors"
          >
            Continue Privately
          </button>
          <button
            type="button"
            onClick={handleCustomize}
            className="rounded-md border border-stone px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone transition-colors"
          >
            Customize
          </button>
        </div>
      </div>
    );
  }
);

CookieConsent.displayName = 'CookieConsent';
