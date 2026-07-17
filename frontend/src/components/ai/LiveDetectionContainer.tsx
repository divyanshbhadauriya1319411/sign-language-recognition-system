'use client';

import React from 'react';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { RealTimeStatusIndicator, RealTimeStatus } from './RealTimeStatusIndicator';
import { ConfidenceScoreIndicator } from './ConfidenceScoreIndicator';

export interface LiveDetectionContainerProps {
  /** Main video/overlay content slot */
  children: React.ReactNode;
  /** Current connection & processing status */
  status: RealTimeStatus;
  /** Recognized gesture or prediction text */
  currentPrediction?: string;
  /** Confidence score between 0.0 and 1.0 */
  confidence?: number;
  /** Whether real-time detection is paused */
  isPaused?: boolean;
  /** Callback when user clicks pause or resume */
  onTogglePause?: () => void;
  className?: string;
}

/**
 * Cohesive Live Detection Container wrapping live video with AI status indicators,
 * activity feedback, confidence display, and accessible pause/resume controls.
 */
export function LiveDetectionContainer({
  children,
  status,
  currentPrediction,
  confidence = 0,
  isPaused = false,
  onTogglePause,
  className,
}: LiveDetectionContainerProps) {
  return (
    <div className={clsx('flex flex-col gap-4 w-full', className)}>
      {/* Top Status & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <RealTimeStatusIndicator status={isPaused ? 'ready' : status} />

        <div className="flex items-center gap-3">
          {confidence > 0 && <ConfidenceScoreIndicator confidence={confidence} size="sm" />}
          {onTogglePause && (
            <button
              type="button"
              onClick={onTogglePause}
              className="px-3.5 py-2 min-h-[44px] rounded-md border border-border bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-small font-medium text-text-primary inline-flex items-center gap-2 transition-colors focus-ring"
              aria-label={isPaused ? 'Resume real-time gesture recognition' : 'Pause real-time gesture recognition'}
            >
              {isPaused ? <Play className="w-4 h-4 text-success-base fill-current" /> : <Pause className="w-4 h-4 text-warning-base" />}
              <span>{isPaused ? 'Resume Tracking' : 'Pause Tracking'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video/Canvas Area */}
      <div className="relative w-full rounded-xl overflow-hidden border border-border bg-neutral-950 shadow-md aspect-video">
        {children}

        {/* Floating Prediction Overlay Pill when active */}
        {currentPrediction && !isPaused && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 rounded-pill bg-slate-950/85 border border-primary-base/40 backdrop-blur-md shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-success-base animate-pulse" />
            <span className="text-body font-bold text-white tracking-wide">{currentPrediction}</span>
          </div>
        )}
      </div>
    </div>
  );
}
