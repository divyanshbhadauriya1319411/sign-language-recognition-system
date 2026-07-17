'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastNotification, ToastNotificationProps } from './ToastNotification';

export interface SnackbarProps extends ToastNotificationProps {
  isOpen: boolean;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Bottom-docked Snackbar wrapper around ToastNotification for non-interruptive feedback.
 */
export function Snackbar({ isOpen, actionText, onAction, ...props }: SnackbarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex justify-center">
          <div className="relative w-full">
            <ToastNotification {...props} />
            {actionText && onAction && (
              <div className="absolute right-14 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => {
                    onAction();
                    props.onDismiss();
                  }}
                  className="px-3 py-1.5 min-h-[44px] text-caption font-bold text-primary-base hover:underline focus-ring rounded"
                >
                  {actionText}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
