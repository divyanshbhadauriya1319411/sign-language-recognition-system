'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * Reusable Button component featuring Framer Motion micro-animations, 44x44px minimum touch target,
 * semantic color mapping, gradient and outline variants, and high-contrast accessible focus ring.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary-base hover:bg-primary-hover active:bg-primary-pressed text-white shadow-sm',
      secondary: 'bg-secondary-base hover:bg-secondary-hover text-white shadow-sm',
      outline: 'border-2 border-border hover:border-primary-base text-text-primary hover:text-primary-base bg-transparent',
      ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-primary hover:text-primary-base',
      danger: 'bg-error-base hover:bg-error-hover text-white shadow-sm focus-ring-danger',
      icon: 'min-w-[44px] min-h-[44px] p-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-primary hover:text-primary-base rounded-md',
      gradient: 'bg-gradient-to-r from-primary-base to-accent-base hover:from-primary-hover hover:to-accent-hover text-white shadow-md hover:shadow-lg',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-small px-3.5 py-2 gap-1.5 min-h-[44px]',
      md: 'text-body px-4 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-body-lg px-6 py-3.5 gap-2.5 min-h-[48px]',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        className={clsx(
          baseStyles,
          variants[variant],
          variant !== 'icon' && sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-current shrink-0" aria-hidden="true" />
            {children && <span className="truncate">{children}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>}
            {children && <span className="truncate">{children}</span>}
            {icon && iconPosition === 'right' && <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
