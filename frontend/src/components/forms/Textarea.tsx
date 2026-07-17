'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  /** Maximum allowed characters */
  maxLength?: number;
  /** Whether character counter should be displayed */
  showCharacterCount?: boolean;
}

/**
 * Accessible Textarea supporting character counting, helper text, and high-contrast focus rings.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, maxLength, showCharacterCount = false, className, id, disabled, readOnly, onChange, value, defaultValue, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `textarea-${Math.random().toString(36).substring(2, 9)}`);
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    const [charCount, setCharCount] = useState<number>(
      typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={generatedId} className="block text-small font-medium text-text-primary select-none">
              {label}
            </label>
          )}
          {showCharacterCount && maxLength && (
            <span className={clsx('text-caption font-mono', charCount > maxLength ? 'text-error-base font-bold' : 'text-text-secondary')}>
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        <div className="relative rounded-md shadow-sm">
          <textarea
            ref={ref}
            id={generatedId}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={clsx(helperText && helperId, error && errorId) || undefined}
            className={clsx(
              'block w-full rounded-md bg-surface border text-text-primary placeholder:text-text-secondary transition-all duration-150 text-body p-3 min-h-[96px] focus-ring',
              error
                ? 'border-error-base text-error-base focus-ring-danger'
                : 'border-border hover:border-neutral-400 dark:hover:border-neutral-500',
              disabled && 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary cursor-not-allowed opacity-75',
              readOnly && 'bg-neutral-50 dark:bg-neutral-900 cursor-default',
              className
            )}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
