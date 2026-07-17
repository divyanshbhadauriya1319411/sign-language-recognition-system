'use client';

import React from 'react';
import clsx from 'clsx';

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, helperText, className, id, disabled, checked, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `radio-${Math.random().toString(36).substring(2, 9)}`);

    return (
      <div className="relative flex items-start gap-3 text-left">
        <div className="flex h-6 items-center">
          <input
            ref={ref}
            id={generatedId}
            type="radio"
            disabled={disabled}
            checked={checked}
            className={clsx(
              'peer h-5 w-5 appearance-none rounded-full border border-border bg-surface transition-colors checked:border-[6px] checked:border-primary-base focus-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
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

RadioButton.displayName = 'RadioButton';
