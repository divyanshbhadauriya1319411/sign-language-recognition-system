'use client';

import React from 'react';
import clsx from 'clsx';
import { Timeline, TimelineProps } from './Timeline';

/**
 * ActivityFeed component providing a dense, real-time scrollable view over Timeline items.
 */
export function ActivityFeed(props: TimelineProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-small font-semibold tracking-wider uppercase text-text-secondary select-none">Live System Activity Feed</h4>
      <div className={clsx('max-h-96 overflow-y-auto p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-border', props.className)}>
        <Timeline {...props} />
      </div>
    </div>
  );
}
