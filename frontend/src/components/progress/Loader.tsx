'use client';

import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

/**
 * Non-blocking theme-aware Spinner with screen-reader accessibility announcements.
 */
export function Spinner({ size = 'md', className, label = 'Loading...' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div role="status" className="inline-flex items-center justify-center">
      <Loader2 className={clsx('animate-spin text-primary-base', sizes[size], className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export interface LoaderProps extends SpinnerProps {
  description?: string;
}

/**
 * Centered Loader box combining a spinner and optional descriptive label.
 */
export function Loader({ description, ...props }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center select-none">
      <Spinner {...props} />
      {description && <p className="text-small font-medium text-text-secondary">{description}</p>}
    </div>
  );
}
