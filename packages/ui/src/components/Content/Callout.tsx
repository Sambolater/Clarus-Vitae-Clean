'use client';

import React from 'react';

export type CalloutType = 'info' | 'warning' | 'tip' | 'expert';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutStyles: Record<
  CalloutType,
  { bg: string; border: string; icon: string; iconBg: string }
> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: '💡',
    iconBg: 'bg-blue-100',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '⚠️',
    iconBg: 'bg-amber-100',
  },
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '✨',
    iconBg: 'bg-green-100',
  },
  expert: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    icon: '👤',
    iconBg: 'bg-slate-100',
  },
};

const typeLabels: Record<CalloutType, string> = {
  info: 'Information',
  warning: 'Important',
  tip: 'Tip',
  expert: 'Expert Insight',
};

/**
 * Callout component for highlighting important information in content
 *
 * @example
 * <Callout type="expert" title="Dr. Smith's Take">
 *   This treatment shows promising results in clinical trials.
 * </Callout>
 */
export function Callout({ type, title, children }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <aside
      className={`my-6 rounded-lg border ${styles.border} ${styles.bg} p-4`}
      role="note"
      aria-label={typeLabels[type]}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.iconBg} text-lg`}
          aria-hidden="true"
        >
          {styles.icon}
        </span>
        <div className="flex-1">
          {title && (
            <p className="mb-1 font-semibold text-clarus-navy">{title}</p>
          )}
          <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </aside>
  );
}
