'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, helperText, className, id, disabled, checked = false, onChange, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `toggle-${Math.random().toString(36).substring(2, 9)}`);

    return (
      <div className="relative flex items-center justify-between gap-4 text-left">
        {(label || helperText) && (
          <div className="text-small select-none flex-1">
            {label && (
              <label htmlFor={generatedId} className={clsx('font-medium text-text-primary cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
                {label}
              </label>
            )}
            {helperText && <p className="text-caption text-text-secondary mt-0.5">{helperText}</p>}
          </div>
        )}
        <label htmlFor={generatedId} className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            ref={ref}
            id={generatedId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            role="switch"
            aria-checked={checked}
            {...props}
          />
          <div
            className={clsx(
              'w-11 h-6 rounded-pill transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-base peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              checked ? 'bg-primary-base' : 'bg-neutral-300 dark:bg-neutral-700',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <motion.div
              animate={{ x: checked ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="top-1 left-0 w-4 h-4 bg-white rounded-full shadow absolute"
            />
          </div>
        </label>
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';
