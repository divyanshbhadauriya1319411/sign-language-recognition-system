'use client';

import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface AnalyticsCardProps {
  /** Metric value displayed prominently (e.g. "98.4%") */
  metric: string | number;
  /** Descriptive label (e.g. "Avg. Recognition Accuracy") */
  label: string;
  /** Trend percentage or difference string (e.g. "+3.2% vs last week") */
  trend?: string;
  /** Trend direction indicator */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Optional sparkline or chart placeholder slot */
  sparklineSlot?: React.ReactNode;
  /** Secondary comparison value string */
  comparisonValue?: string;
  className?: string;
}

/**
 * Reusable Analytics Card presenting core KPIs, trend indicators, comparison metrics,
 * and optional sparkline/graphical slots.
 */
export function AnalyticsCard({
  metric,
  label,
  trend,
  trendDirection = 'neutral',
  sparklineSlot,
  comparisonValue,
  className,
}: AnalyticsCardProps) {
  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-success-base bg-success-soft/40' },
    down: { icon: TrendingDown, color: 'text-error-base bg-error-soft/40' },
    neutral: { icon: Minus, color: 'text-text-secondary bg-neutral-100 dark:bg-neutral-800' },
  };

  const currentTrend = trendConfig[trendDirection];
  const TrendIcon = currentTrend.icon;

  return (
    <div className={clsx('rounded-lg border border-border bg-surface p-5 space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-caption font-medium uppercase tracking-wider text-text-secondary">{label}</span>
          <div className="text-h2 font-mono font-bold text-text-primary tracking-tight">{metric}</div>
        </div>
        {trend && (
          <div className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-caption font-semibold shrink-0', currentTrend.color)}>
            <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Sparkline / Chart Slot */}
      {sparklineSlot && <div className="w-full h-16 rounded overflow-hidden pt-1">{sparklineSlot}</div>}

      {/* Comparison Bottom Bar */}
      {comparisonValue && (
        <div className="pt-2 border-t border-divider/50 text-caption text-text-secondary flex items-center justify-between">
          <span>Comparison Target:</span>
          <strong className="font-mono text-text-primary">{comparisonValue}</strong>
        </div>
      )}
    </div>
  );
}
