'use client';

import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

/**
 * Accessible linear Progress Bar supporting semantic colors and ARIA progress attributes.
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorClasses = {
    primary: 'bg-primary-base',
    success: 'bg-success-base',
    warning: 'bg-warning-base',
    error: 'bg-error-base',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full space-y-1.5 select-none', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between gap-2 text-small font-medium text-text-primary">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-caption text-text-secondary">{percent}%</span>}
        </div>
      )}
      <div className={clsx('w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden', heights[size])} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={clsx('h-full rounded-full transition-all duration-300', colorClasses[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/**
 * Circular SVG Progress Ring with animated stroke calculation.
 */
export function CircularProgress({
  value,
  size = 64,
  strokeWidth = 6,
  label,
  className,
}: CircularProgressProps) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={clsx('inline-flex flex-col items-center justify-center gap-1 select-none', className)} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary-base transition-all duration-300 stroke-round"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="transparent"
          />
        </svg>
        <span className="absolute text-caption font-mono font-bold text-text-primary">{percent}%</span>
      </div>
      {label && <span className="text-caption font-medium text-text-secondary">{label}</span>}
    </div>
  );
}

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepProgressProps {
  steps: Step[];
  currentStepIndex: number;
  className?: string;
}

/**
 * Multi-Step Progress Tracker indicating sequential workflows.
 */
export function StepProgress({ steps, currentStepIndex, className }: StepProgressProps) {
  return (
    <nav aria-label="Workflow progress" className={clsx('w-full select-none', className)}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.id} className={clsx('flex items-center relative flex-1', index === steps.length - 1 && 'flex-none')}>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span
                  className={clsx(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-small transition-colors border-2 shadow-2xs',
                    isCompleted
                      ? 'bg-success-base border-success-base text-white'
                      : isCurrent
                      ? 'bg-primary-base border-primary-base text-white'
                      : 'bg-surface border-border text-text-secondary'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </span>
                <span className={clsx('text-caption font-medium text-center max-w-[100px]', isCurrent ? 'text-primary-base font-bold' : 'text-text-secondary')}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-2 transition-colors -mt-6',
                    index < currentStepIndex ? 'bg-success-base' : 'bg-divider'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
