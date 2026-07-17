'use client';

import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, className, id, disabled, checked, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `chk-${Math.random().toString(36).substring(2, 9)}`);

    return (
      <div className="relative flex items-start gap-3 text-left">
        <div className="flex h-6 items-center">
          <input
            ref={ref}
            id={generatedId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className={clsx(
              'peer h-5 w-5 appearance-none rounded border border-border bg-surface transition-colors checked:bg-primary-base checked:border-primary-base focus-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" aria-hidden="true" />
        </div>
        {(label || helperText) && (
          <div className="text-small select-none">
            {label && (
              <label htmlFor={generatedId} className={clsx('font-medium text-text-primary cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
                {label}
              </label>
            )}
            {helperText && <p className="text-caption text-text-secondary mt-0.5">{helperText}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
