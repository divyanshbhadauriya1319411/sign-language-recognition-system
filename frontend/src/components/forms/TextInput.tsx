'use client';

import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

/**
 * Universal Text Input supporting email, password, search, phone, and number types with
 * floating/persistent labels, prefix/suffix icons, accessible ARIA attributes, and 8px radius.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      prefixIcon,
      suffixIcon,
      className,
      id,
      disabled,
      readOnly,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `input-${Math.random().toString(36).substring(2, 9)}`);
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-small font-medium text-text-primary select-none"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {prefixIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-secondary">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={generatedId}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={clsx(helperText && helperId, error && errorId) || undefined}
            className={clsx(
              'block w-full rounded-md bg-surface border text-text-primary placeholder:text-text-secondary transition-all duration-150 sm:text-body py-2.5 min-h-[44px] focus-ring',
              prefixIcon ? 'pl-10' : 'pl-3.5',
              suffixIcon || error || success ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-error-base text-error-base focus-ring-danger'
                : success
                ? 'border-success-base focus:ring-success-base'
                : 'border-border hover:border-neutral-400 dark:hover:border-neutral-500',
              disabled && 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary cursor-not-allowed opacity-75',
              readOnly && 'bg-neutral-50 dark:bg-neutral-900 cursor-default',
              className
            )}
            {...props}
          />
          {(suffixIcon || error || success) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary">
              {error ? (
                <AlertCircle className="w-5 h-5 text-error-base" aria-hidden="true" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5 text-success-base" aria-hidden="true" />
              ) : (
                suffixIcon
              )}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-caption text-error-base font-medium flex items-center gap-1" role="alert">
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

TextInput.displayName = 'TextInput';
