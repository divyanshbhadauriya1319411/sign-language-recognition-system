'use client';

import React from 'react';
import clsx from 'clsx';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

/**
 * Standard accessible Select Dropdown with 44x44px min touch target and custom chevron icon.
 */
export const SelectDropdown = React.forwardRef<HTMLSelectElement, SelectDropdownProps>(
  ({ label, helperText, error, options, className, id, disabled, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `select-${Math.random().toString(36).substring(2, 9)}`);
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={generatedId} className="block text-small font-medium text-text-primary select-none">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <select
            ref={ref}
            id={generatedId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={clsx(helperText && helperId, error && errorId) || undefined}
            className={clsx(
              'block w-full appearance-none rounded-md bg-surface border text-text-primary transition-all duration-150 sm:text-body py-2.5 pl-3.5 pr-10 min-h-[44px] focus-ring',
              error
                ? 'border-error-base text-error-base focus-ring-danger'
                : 'border-border hover:border-neutral-400 dark:hover:border-neutral-500',
              disabled && 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary cursor-not-allowed opacity-75',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-surface text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
        {error ? (
          <p id={errorId} className="text-caption text-error-base font-medium flex items-center gap-1" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-caption text-text-secondary">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

SelectDropdown.displayName = 'SelectDropdown';
