import React from 'react';
import clsx from 'clsx';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, success, icon, className, id, disabled, readOnly, type = 'text', ...props }, ref) => {
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
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-secondary">
              {icon}
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
              icon ? 'pl-10 pr-3.5' : 'px-3.5',
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
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-error-base">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
          {!error && success && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-success-base">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
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

Input.displayName = 'Input';
