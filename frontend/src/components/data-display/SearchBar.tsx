'use client';

import React from 'react';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Universal SearchBar component with prefix magnifying icon, clear action button,
 * and accessible ARIA attributes.
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, onClear, placeholder = 'Search records, gestures, or sessions...', className, ...props }, ref) => {
    return (
      <div className={clsx('relative w-full max-w-md', className)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-secondary">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="block w-full rounded-md bg-surface border border-border pl-10 pr-10 py-2.5 text-body text-text-primary placeholder:text-text-secondary transition-all min-h-[44px] focus-ring hover:border-neutral-400 dark:hover:border-neutral-500"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary min-h-[44px] min-w-[44px] justify-center transition-colors focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
