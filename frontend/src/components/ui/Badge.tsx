'use client';

import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'primary', size = 'sm', className, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    primary: 'bg-primary-soft text-primary-base border border-primary-base/20 font-medium',
    secondary: 'bg-secondary-soft text-secondary-base border border-secondary-base/20 font-medium',
    accent: 'bg-accent-soft text-accent-base border border-accent-base/20 font-medium',
    purple: 'bg-accent-soft text-accent-base border border-accent-base/20 font-medium',
    success: 'bg-success-soft text-success-base border border-success-base/20 font-medium',
    warning: 'bg-warning-soft text-warning-base border border-warning-base/20 font-medium',
    error: 'bg-error-soft text-error-base border border-error-base/20 font-medium',
    danger: 'bg-error-soft text-error-base border border-error-base/20 font-medium',
    info: 'bg-info-soft text-info-base border border-info-base/20 font-medium',
    neutral: 'bg-neutral-200 dark:bg-neutral-800 text-text-secondary border border-border font-medium',
  };

  const sizes = {
    sm: 'text-caption px-2.5 py-0.5 rounded-pill',
    md: 'text-small px-3 py-1 rounded-pill',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1.5 select-none', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
