'use client';

import React from 'react';
import clsx from 'clsx';
import { CheckCircle2, Loader2, Radio, AlertTriangle, WifiOff, Sparkles } from 'lucide-react';

export type RealTimeStatus = 'ready' | 'initializing' | 'detecting' | 'processing' | 'connected' | 'disconnected' | 'error';

export interface RealTimeStatusIndicatorProps {
  status: RealTimeStatus;
  /** Optional custom text override */
  customText?: string;
  className?: string;
}

/**
 * Real-Time Status Indicator communicating system states using both iconography and descriptive text
 * to guarantee WCAG compliance without relying on color alone.
 */
export function RealTimeStatusIndicator({ status, customText, className }: RealTimeStatusIndicatorProps) {
  const config: Record<RealTimeStatus, { label: string; icon: React.ReactNode; color: string }> = {
    ready: {
      label: 'System Ready',
      icon: <CheckCircle2 className="w-4 h-4 text-success-base" />,
      color: 'bg-success-soft text-success-base border-success-base/30',
    },
    initializing: {
      label: 'Initializing AI Engine...',
      icon: <Loader2 className="w-4 h-4 text-accent-base animate-spin" />,
      color: 'bg-accent-soft text-accent-base border-accent-base/30',
    },
    detecting: {
      label: 'Detecting Sign Gestures...',
      icon: <Radio className="w-4 h-4 text-primary-base animate-pulse" />,
      color: 'bg-primary-soft text-primary-base border-primary-base/30',
    },
    processing: {
      label: 'Processing Temporal Sequence...',
      icon: <Sparkles className="w-4 h-4 text-accent-base animate-spin" />,
      color: 'bg-accent-soft text-accent-base border-accent-base/30',
    },
    connected: {
      label: 'Stream Connected',
      icon: <CheckCircle2 className="w-4 h-4 text-success-base" />,
      color: 'bg-success-soft text-success-base border-success-base/30',
    },
    disconnected: {
      label: 'Stream Disconnected',
      icon: <WifiOff className="w-4 h-4 text-warning-base" />,
      color: 'bg-warning-soft text-warning-base border-warning-base/30',
    },
    error: {
      label: 'Inference Stream Error',
      icon: <AlertTriangle className="w-4 h-4 text-error-base" />,
      color: 'bg-error-soft text-error-base border-error-base/30',
    },
  };

  const current = config[status] || config.ready;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border text-small font-semibold select-none shadow-2xs',
        current.color,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="shrink-0" aria-hidden="true">{current.icon}</span>
      <span>{customText || current.label}</span>
    </div>
  );
}
