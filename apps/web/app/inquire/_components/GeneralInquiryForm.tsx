'use client';

import { cn } from '@clarus-vitae/utils';
import { useState, type FormEvent } from 'react';

interface GeneralInquiryFormProps {
  properties: Array<{
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
  }>;
  className?: string;
}

export function GeneralInquiryForm({ properties, className }: GeneralInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    message: '',
    goals: '',
    budget: '',
    timeline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId: formData.propertyId || properties[0]?.id,
          primaryGoals: formData.goals ? [formData.goals] : [],
          preferredTimeline: formData.timeline || undefined,
          budgetRange: formData.budget || undefined,
          consentContactProperty: true,
          privacyPolicyAccepted: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={cn('max-w-xl mx-auto text-center py-12', className)}>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-medium text-clarus-navy mb-4">
          Inquiry Submitted
        </h2>
        <p className="text-slate mb-6">
          Thank you for your interest. The property will contact you within 2-3 business days.
        </p>
        <a
          href="/properties"
          className="inline-flex h-10 items-center justify-center rounded-md bg-clarus-navy px-6 text-sm font-medium text-white hover:bg-clarus-navy/90"
        >
          Browse More Properties
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('max-w-xl mx-auto', className)}>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Property Selection */}
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium text-clarus-navy mb-2">
            Which property interests you? *
          </label>
          <select
            id="propertyId"
            value={formData.propertyId}
            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
            required
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          >
            <option value="">Select a property...</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name} — {property.city}, {property.country}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-clarus-navy mb-2">
            Your Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Full name"
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-clarus-navy mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="your@email.com"
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          />
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-clarus-navy mb-2">
            Phone Number <span className="text-slate/60">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          />
        </div>

        {/* Goals */}
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-clarus-navy mb-2">
            Primary Wellness Goals
          </label>
          <select
            id="goals"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          >
            <option value="">Select your focus...</option>
            <option value="LONGEVITY">Longevity & Anti-aging</option>
            <option value="STRESS_BURNOUT">Stress & Burnout Recovery</option>
            <option value="WEIGHT_METABOLIC">Weight & Metabolic Health</option>
            <option value="DETOX">Detox & Reset</option>
            <option value="FITNESS">Fitness & Performance</option>
            <option value="COGNITIVE">Cognitive & Brain Health</option>
            <option value="BEAUTY">Beauty & Aesthetic</option>
            <option value="HOLISTIC">Holistic & Spiritual</option>
            <option value="GENERAL">General Rejuvenation</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-clarus-navy mb-2">
            Budget Range
          </label>
          <select
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          >
            <option value="">Prefer not to say</option>
            <option value="UNDER_5K">Under $5,000</option>
            <option value="FIVE_TO_10K">$5,000 - $10,000</option>
            <option value="TEN_TO_25K">$10,000 - $25,000</option>
            <option value="TWENTYFIVE_TO_50K">$25,000 - $50,000</option>
            <option value="FIFTY_TO_100K">$50,000 - $100,000</option>
            <option value="OVER_100K">$100,000+</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-clarus-navy mb-2">
            When are you looking to visit?
          </label>
          <select
            id="timeline"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full h-12 px-4 rounded-lg border border-stone bg-white text-clarus-navy focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none"
          >
            <option value="">Flexible / Not sure</option>
            <option value="WITHIN_MONTH">Within the next month</option>
            <option value="ONE_THREE_MONTHS">1-3 months</option>
            <option value="THREE_SIX_MONTHS">3-6 months</option>
            <option value="SIX_PLUS_MONTHS">6+ months</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-clarus-navy mb-2">
            Additional Details <span className="text-slate/60">(optional)</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your specific needs, health goals, or any questions..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-stone bg-white text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:ring-2 focus:ring-clarus-navy/20 outline-none resize-none"
          />
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-slate">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-clarus-navy underline">Privacy Policy</a> and consent 
          to having your inquiry shared with the selected property. Your data is encrypted and never 
          sold to third parties.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-lg bg-clarus-navy text-white font-medium transition-colors hover:bg-clarus-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </div>
    </form>
  );
}
