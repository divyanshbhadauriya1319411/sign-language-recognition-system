'use client';

import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatisticsCardProps {
  /** Prominent KPI value (e.g. "14,820") */
  kpi: string | number;
  /** Description or subtitle */
  description: string;
  /** Trend percentage string */
  trend?: string;
  /** Trend direction */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Icon element slot */
  icon: React.ReactNode;
  /** Comparison period string (e.g. "vs previous 30 days") */
  comparisonPeriod?: string;
  className?: string;
}

/**
 * Statistics Card highlighting core system metrics, KPI counters, and comparative periods.
 */
export function StatisticsCard({
  kpi,
  description,
  trend,
  trendDirection = 'neutral',
  icon,
  comparisonPeriod,
  className,
}: StatisticsCardProps) {
  const trendColors = {
    up: 'text-success-base',
    down: 'text-error-base',
    neutral: 'text-text-secondary',
  };

  const TrendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const IconComponent = TrendIcons[trendDirection];

  return (
    <div className={clsx('rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4 text-left flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-caption font-semibold uppercase tracking-wider text-text-secondary">{description}</span>
          <div className="text-display-l font-mono font-bold text-text-primary tracking-tight leading-none pt-1">{kpi}</div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary-base flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      {(trend || comparisonPeriod) && (
        <div className="pt-3 border-t border-divider/60 flex items-center justify-between gap-2 text-caption">
          {trend && (
            <span className={clsx('font-semibold inline-flex items-center gap-1', trendColors[trendDirection])}>
              <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{trend}</span>
            </span>
          )}
          {comparisonPeriod && <span className="text-text-secondary truncate">{comparisonPeriod}</span>}
        </div>
      )}
    </div>
  );
}
