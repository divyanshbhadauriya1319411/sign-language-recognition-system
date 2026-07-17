'use client';

import React from 'react';
import clsx from 'clsx';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroupProps {
  options: FilterOption[];
  activeFilterId: string;
  onChange: (id: string) => void;
  label?: string;
  className?: string;
}

/**
 * Filter Group pill bar allowing quick categorical switching with active state indicators.
 */
export function FilterGroup({
  options,
  activeFilterId,
  onChange,
  label,
  className,
}: FilterGroupProps) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-2 select-none', className)} role="group" aria-label={label || 'Filter options'}>
      {label && <span className="text-caption font-semibold text-text-secondary mr-1">{label}:</span>}
      {options.map((opt) => {
        const isActive = activeFilterId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={isActive}
            className={clsx(
              'px-3.5 py-1.5 min-h-[36px] rounded-pill text-small font-medium transition-colors inline-flex items-center gap-1.5 focus-ring',
              isActive
                ? 'bg-primary-base text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary hover:text-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-700'
            )}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={clsx('text-caption font-mono px-1.5 py-0.2 rounded-full', isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-text-secondary')}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
