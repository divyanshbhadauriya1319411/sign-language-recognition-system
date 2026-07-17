'use client';

import React from 'react';
import clsx from 'clsx';
import { FolderOpen, History, BarChart3, BookOpen, Search, Plus } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Universal Empty State component with customizable iconography and action triggers.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'w-full rounded-xl border border-dashed border-border bg-surface/50 p-12 flex flex-col items-center justify-center text-center gap-4 select-none',
        className
      )}
      role="region"
      aria-label={title}
    >
      <div className="w-16 h-16 rounded-full bg-primary-soft text-primary-base flex items-center justify-center">
        {icon || <FolderOpen className="w-8 h-8" aria-hidden="true" />}
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-h5 font-bold text-text-primary">{title}</h3>
        <p className="text-small text-text-secondary leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="primary" onClick={onAction} icon={<Plus className="w-4 h-4" />}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty state presets for common AI platform domains.
 */
export function EmptyHistoryState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<History className="w-8 h-8" />}
      title="No Translation Sessions Recorded"
      description="You haven't performed any sign recognition sessions yet. Open the AI Studio and turn on your camera to begin translating ISL in real time."
      actionText={onAction ? 'Launch AI Studio' : undefined}
      onAction={onAction}
    />
  );
}

export function EmptyAnalyticsState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<BarChart3 className="w-8 h-8" />}
      title="Insufficient Telemetry Data"
      description="Analytics graphs and confidence distributions require at least one completed session. Complete a gesture tracking workflow to generate metrics."
      actionText={onAction ? 'Start New Session' : undefined}
      onAction={onAction}
    />
  );
}

export function EmptyLearningState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="w-8 h-8" />}
      title="No Interactive Lessons Started"
      description="Explore our curated ISL dictionary and start daily interactive practice lessons with instant AI feedback."
      actionText={onAction ? 'Browse ISL Curriculum' : undefined}
      onAction={onAction}
    />
  );
}

export function EmptySearchState({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8" />}
      title="No Matching Records Found"
      description={query ? `We couldn't find any gestures or session logs matching "${query}". Try broadening your search or resetting filters.` : 'No search results match your criteria.'}
      actionText={onClear ? 'Clear Search Filters' : undefined}
      onAction={onClear}
    />
  );
}
