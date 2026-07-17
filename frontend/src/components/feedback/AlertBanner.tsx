'use client';

import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  actionSlot?: React.ReactNode;
  className?: string;
}

/**
 * Page or section-level Alert Banner providing high-visibility contextual feedback with optional dismissal.
 */
export function AlertBanner({
  type = 'info',
  title,
  children,
  onDismiss,
  actionSlot,
  className,
}: AlertBannerProps) {
  const config = {
    success: { icon: CheckCircle2, bg: 'bg-success-soft/30 border-success-base/40 text-success-base' },
    warning: { icon: AlertTriangle, bg: 'bg-warning-soft/30 border-warning-base/40 text-warning-base' },
    error: { icon: XCircle, bg: 'bg-error-soft/30 border-error-base/40 text-error-base' },
    info: { icon: Info, bg: 'bg-primary-soft/30 border-primary-base/40 text-primary-base' },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div
      role="alert"
      className={clsx(
        'w-full rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left select-none',
        current.bg,
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1 min-w-0">
          {title && <h4 className="text-small font-bold text-text-primary">{title}</h4>}
          <div className="text-small text-text-primary leading-relaxed">{children}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {actionSlot}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary transition-colors focus-ring"
            aria-label="Dismiss alert banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
