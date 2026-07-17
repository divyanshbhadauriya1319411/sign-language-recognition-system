'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Required accessible label for screen readers */
  'aria-label': string;
  /** Icon element to render inside button */
  icon: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  /** Size modifier */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Dedicated Icon Button guaranteeing 44x44px touch targets and enforcing screen-reader labels.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 'aria-label': ariaLabel, icon, variant = 'ghost', size = 'md', isLoading = false, className, disabled, type = 'button', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-base hover:bg-primary-hover text-white shadow-sm',
      secondary: 'bg-secondary-base hover:bg-secondary-hover text-white shadow-sm',
      ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-primary hover:text-primary-base',
      outline: 'border border-border hover:border-primary-base bg-transparent text-text-primary hover:text-primary-base',
      danger: 'bg-error-base hover:bg-error-hover text-white shadow-sm focus-ring-danger',
    };

    const sizes = {
      sm: 'min-w-[44px] min-h-[44px] p-2.5 rounded-md',
      md: 'min-w-[44px] min-h-[44px] p-3 rounded-md',
      lg: 'min-w-[52px] min-h-[52px] p-3.5 rounded-lg',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        whileTap={disabled || isLoading ? undefined : { scale: 0.95 }}
        className={clsx(
          'inline-flex items-center justify-center transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none shrink-0',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-current" aria-hidden="true" /> : <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
