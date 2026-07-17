'use client';

import React from 'react';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * Chronological Timeline component presenting system events, history entries, or learning milestones.
 */
export function Timeline({ items, className }: TimelineProps) {
  const statusColors = {
    success: 'bg-success-base text-white border-success-base',
    warning: 'bg-warning-base text-white border-warning-base',
    error: 'bg-error-base text-white border-error-base',
    info: 'bg-primary-base text-white border-primary-base',
  };

  return (
    <div className={clsx('relative border-l-2 border-divider ml-4 space-y-8 select-none', className)}>
      {items.map((item) => {
        const color = statusColors[item.status || 'info'];
        return (
          <div key={item.id} className="relative pl-6 text-left">
            {/* Dot Indicator */}
            <span
              className={clsx(
                'absolute -left-[11px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-surface',
                color
              )}
            >
              {item.icon || <Clock className="w-3 h-3" aria-hidden="true" />}
            </span>

            {/* Content Header & Body */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-caption font-mono text-text-secondary">
                <time dateTime={item.timestamp}>{item.timestamp}</time>
              </div>
              <h4 className="text-body font-bold text-text-primary">{item.title}</h4>
              {item.description && <p className="text-small text-text-secondary leading-relaxed">{item.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
