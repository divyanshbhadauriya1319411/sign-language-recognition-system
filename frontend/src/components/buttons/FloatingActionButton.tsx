'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface FloatingActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Required accessible label */
  'aria-label': string;
  /** Icon to render inside FAB */
  icon: React.ReactNode;
  /** Optional label text for extended FAB */
  label?: string;
  /** Position on screen */
  placement?: 'bottom-right' | 'bottom-left';
  /** Optional notification count badge */
  badgeCount?: number;
}

/**
 * Floating Action Button (FAB) component with configurable placement, optional text label,
 * notification badge, and subtle Framer Motion entrance animation.
 */
export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      icon,
      label,
      placement = 'bottom-right',
      badgeCount,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const placementClasses = {
      'bottom-right': 'fixed bottom-6 right-6 z-40',
      'bottom-left': 'fixed bottom-6 left-6 z-40',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          placementClasses[placement],
          'min-w-[56px] min-h-[56px] px-4 rounded-pill bg-primary-base hover:bg-primary-hover text-white shadow-xl flex items-center justify-center gap-2.5 focus-ring transition-colors disabled:opacity-50 select-none',
          label ? 'px-6' : 'p-4',
          className
        )}
        {...props}
      >
        <span className="shrink-0" aria-hidden="true">{icon}</span>
        {label && <span className="font-semibold text-body pr-1">{label}</span>}

        {/* Badge counter */}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-error-base text-white text-caption font-bold rounded-pill flex items-center justify-center border-2 border-surface shadow">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </motion.button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
