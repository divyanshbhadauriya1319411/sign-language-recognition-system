'use client';

import React from 'react';
import clsx from 'clsx';
import { Sparkles, Clock, Volume2, VolumeX, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ConfidenceScoreIndicator } from './ConfidenceScoreIndicator';

export type AIPredictionStatus = 'success' | 'warning' | 'error' | 'idle';

export interface AIPredictionCardProps {
  /** Recognized gesture name */
  prediction: string;
  /** Natural language translation string */
  translationText: string;
  /** Confidence score between 0.0 and 1.0 */
  confidence: number;
  /** ISO timestamp string or formatted time */
  timestamp: string;
  /** Prediction status state */
  status?: AIPredictionStatus;
  /** Optional callback to trigger synthesized speech playback */
  onPlaySpeech?: () => void;
  /** Whether TTS audio is currently speaking */
  isSpeaking?: boolean;
  className?: string;
}

/**
 * AI Prediction Card presenting gesture predictions, JetBrains Mono confidence diagnostics,
 * timestamps, natural language translations, and accessible speech synthesis triggers.
 */
export function AIPredictionCard({
  prediction,
  translationText,
  confidence,
  timestamp,
  status = 'idle',
  onPlaySpeech,
  isSpeaking = false,
  className,
}: AIPredictionCardProps) {
  const statusConfig = {
    success: { label: 'Confirmed Sign', icon: CheckCircle2, border: 'border-success-base/40 bg-success-soft/15' },
    warning: { label: 'Low Confidence', icon: AlertTriangle, border: 'border-warning-base/40 bg-warning-soft/15' },
    error: { label: 'Detection Error', icon: XCircle, border: 'border-error-base/40 bg-error-soft/15' },
    idle: { label: 'Tracking Stream...', icon: Sparkles, border: 'border-border bg-surface' },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-6 space-y-4 shadow-md transition-all duration-200',
        currentStatus.border,
        className
      )}
    >
      {/* Header: Status Indicator & Timestamp */}
      <div className="flex items-center justify-between gap-2 border-b border-divider pb-3">
        <div className="flex items-center gap-2 text-small font-semibold text-text-primary">
          <StatusIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{currentStatus.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-caption text-text-secondary font-mono">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <time dateTime={timestamp}>{timestamp}</time>
        </div>
      </div>

      {/* Main Prediction & Confidence */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="text-caption font-medium uppercase tracking-wider text-text-secondary">Recognized Gesture</span>
          <h3 className="text-h3 font-bold text-text-primary tracking-tight mt-0.5">{prediction || '—'}</h3>
        </div>
        <div className="text-right">
          <span className="text-caption font-medium uppercase tracking-wider text-text-secondary">Confidence</span>
          <div className="mt-1">
            <ConfidenceScoreIndicator confidence={confidence} size="md" />
          </div>
        </div>
      </div>

      {/* Natural Language Translation & Speech Trigger */}
      <div className="pt-2 flex items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-800/60 p-3.5 rounded-md border border-border">
        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-caption font-medium text-text-secondary">Natural Language Translation</span>
          <p className="text-body font-medium text-text-primary truncate">{translationText || 'Waiting for gesture input...'}</p>
        </div>
        {onPlaySpeech && (
          <button
            type="button"
            onClick={onPlaySpeech}
            disabled={!prediction || status === 'idle'}
            aria-label={isSpeaking ? 'Stop speech synthesis' : 'Play synthesized speech'}
            className="shrink-0 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md bg-primary-base hover:bg-primary-hover disabled:opacity-40 disabled:pointer-events-none text-white transition-colors focus-ring"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
