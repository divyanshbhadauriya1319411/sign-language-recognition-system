'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Dropdown Menu component for action menus with danger items and keyboard accessibility.
 */
export function DropdownMenu({ trigger, items, align = 'right', className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className={clsx(
                'absolute z-50 mt-2 min-w-[180px] rounded-lg border border-border bg-surface py-1 shadow-lg',
                align === 'right' ? 'right-0' : 'left-0',
                className
              )}
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'w-full px-3.5 py-2.5 min-h-[44px] flex items-center gap-2.5 text-small font-medium transition-colors text-left focus-ring',
                    item.danger ? 'text-error-base hover:bg-error-soft/20' : 'text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                  )}
                >
                  {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
