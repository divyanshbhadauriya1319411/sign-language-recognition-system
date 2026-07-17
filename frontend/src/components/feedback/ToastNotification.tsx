'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastNotificationProps {
  id?: string;
  type?: ToastType;
  title: string;
  description?: string;
  onDismiss: () => void;
  /** Auto-dismiss duration in milliseconds (default 5000ms) */
  autoDismissMs?: number;
}

/**
 * Dismissible Toast Notification featuring semantic iconography, Framer Motion entrance/exit,
 * high-contrast focus rings, and configurable auto-dismiss timers.
 */
export function ToastNotification({
  type = 'info',
  title,
  description,
  onDismiss,
  autoDismissMs = 5000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  const config = {
    success: { icon: CheckCircle2, border: 'border-success-base bg-surface text-text-primary', iconColor: 'text-success-base' },
    warning: { icon: AlertTriangle, border: 'border-warning-base bg-surface text-text-primary', iconColor: 'text-warning-base' },
    error: { icon: XCircle, border: 'border-error-base bg-surface text-text-primary', iconColor: 'text-error-base' },
    info: { icon: Info, border: 'border-primary-base bg-surface text-text-primary', iconColor: 'text-primary-base' },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      role="alert"
      className={clsx(
        'w-full max-w-sm rounded-lg border-l-4 p-4 shadow-xl flex items-start justify-between gap-3 select-none',
        current.border
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', current.iconColor)} aria-hidden="true" />
        <div className="space-y-1 min-w-0">
          <h4 className="text-small font-bold text-text-primary truncate">{title}</h4>
          {description && <p className="text-caption text-text-secondary leading-relaxed">{description}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
