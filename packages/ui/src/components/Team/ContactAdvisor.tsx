'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState } from 'react';

import type { TeamMemberSummary } from '@clarus-vitae/types';

export interface ContactAdvisorProps extends HTMLAttributes<HTMLDivElement> {
  member?: TeamMemberSummary;
  context?: string;
  propertyName?: string;
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  variant?: 'sidebar' | 'modal' | 'inline';
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  teamMemberId?: string;
  context?: string;
}

/**
 * ContactAdvisor component for requesting consultation with team members.
 *
 * Features:
 * - Optional specific team member selection
 * - Context-aware messaging
 * - Form validation
 * - Multiple variants (sidebar, modal, inline)
 */
export const ContactAdvisor = forwardRef<HTMLDivElement, ContactAdvisorProps>(
  (
    {
      member,
      context,
      propertyName,
      onSubmit,
      variant = 'sidebar',
      className,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState<ContactFormData>({
      name: '',
      email: '',
      message: '',
      teamMemberId: member?.id,
      context,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setIsSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (isSubmitted) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg bg-verification-green/10 p-6 text-center',
            className
          )}
          {...props}
        >
          <svg
            className="mx-auto h-12 w-12 text-verification-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 font-semibold text-clarus-navy">Request Sent</h3>
          <p className="mt-2 text-sm text-slate">
            {member
              ? `${member.name.split(' ')[0]} will be in touch within 24-48 hours.`
              : 'An advisor will be in touch within 24-48 hours.'}
          </p>
        </div>
      );
    }

    const isInline = variant === 'inline';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          isInline ? 'bg-transparent' : 'bg-stone/50 p-6',
          className
        )}
        {...props}
      >
        {member ? (
          <div className={cn('flex items-center gap-3', !isInline && 'mb-4')}>
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clarus-navy text-lg font-medium text-clarus-gold">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-clarus-navy">{member.name}</p>
              <p className="text-sm text-slate">{member.title}</p>
            </div>
          </div>
        ) : (
          !isInline && (
            <>
              <h3 className="font-semibold text-clarus-navy">
                Speak with an Advisor
              </h3>
              <p className="mt-1 text-sm text-slate">
                Our team can help you find the right wellness destination.
              </p>
            </>
          )
        )}

        {!isInline && (
          <p className="mt-4 text-sm text-slate">
            {member
              ? `Have questions${context ? ` about ${context}` : ''}? ${member.name.split(' ')[0]} can help.`
              : propertyName
                ? `Questions about ${propertyName}? Our advisors can help.`
                : 'Our team can provide personalized guidance.'}
          </p>
        )}

        <form onSubmit={handleSubmit} className={cn(!isInline && 'mt-4', 'space-y-4')}>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-clarus-navy">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-clarus-navy focus:outline-none focus:ring-1 focus:ring-clarus-navy"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-clarus-navy">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-clarus-navy focus:outline-none focus:ring-1 focus:ring-clarus-navy"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-clarus-navy">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone px-3 py-2 text-sm focus:border-clarus-navy focus:outline-none focus:ring-1 focus:ring-clarus-navy"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-clarus-navy px-4 py-2.5 font-medium text-white transition-colors hover:bg-clarus-navy/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Request Consultation'}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate">
          No obligation. Free initial consultation.
        </p>
      </div>
    );
  }
);

ContactAdvisor.displayName = 'ContactAdvisor';
