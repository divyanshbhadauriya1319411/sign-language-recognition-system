'use client';

import React from 'react';
import clsx from 'clsx';

export interface ConfidenceScoreIndicatorProps {
  /** Confidence score between 0.0 and 1.0 */
  confidence: number;
  /** Size modifier */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show descriptive label (High/Medium/Low) */
  showLabel?: boolean;
  className?: string;
}

/**
 * Confidence Score Indicator visualizing AI certainty via progress bars, JetBrains Mono percentages,
 * and semantic color states (`high >= 0.75`, `medium >= 0.50`, `low < 0.50`).
 */
export function ConfidenceScoreIndicator({
  confidence,
  size = 'md',
  showLabel = true,
  className,
}: ConfidenceScoreIndicatorProps) {
  const percent = Math.min(100, Math.max(0, Math.round(confidence * 100)));

  let colorClass = 'bg-error-base text-error-base';
  let labelText = 'Low Confidence';

  if (confidence >= 0.75) {
    colorClass = 'bg-success-base text-success-base';
    labelText = 'High Confidence';
  } else if (confidence >= 0.5) {
    colorClass = 'bg-warning-base text-warning-base';
    labelText = 'Medium Confidence';
  }

  const barHeights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizes = {
    sm: 'text-caption font-mono',
    md: 'text-small font-mono font-bold',
    lg: 'text-body font-mono font-bold',
  };

  return (
    <div className={clsx('space-y-1 w-full max-w-[180px] select-none', className)}>
      <div className="flex items-center justify-between gap-2">
        {showLabel && <span className="text-caption text-text-secondary font-medium">{labelText}</span>}
        <span className={clsx(textSizes[size], colorClass.split(' ')[1])}>{percent}%</span>
      </div>
      <div className={clsx('w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden', barHeights[size])} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={clsx('h-full rounded-full transition-all duration-300', colorClass.split(' ')[0])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
