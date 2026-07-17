'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NavItem } from './Navbar';

export interface MobileDrawerProps {
  /** Whether drawer is currently open */
  isOpen: boolean;
  /** Callback to close drawer */
  onClose: () => void;
  /** Navigation items */
  items: NavItem[];
  /** Callback when navigation link is clicked */
  onNavigate?: (item: NavItem) => void;
  /** Brand slot */
  brand?: React.ReactNode;
  /** Optional bottom action or user slot */
  footerSlot?: React.ReactNode;
}

/**
 * Mobile navigation drawer with backdrop overlay, ESC key closing, and focus management.
 */
export function MobileDrawer({
  isOpen,
  onClose,
  items,
  onNavigate,
  brand,
  footerSlot,
}: MobileDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-80 max-w-[85vw] bg-surface border-r border-border h-full flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-divider flex items-center justify-between">
              <div>{brand || <span className="font-bold text-primary-base">SignBridge AI</span>}</div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    onNavigate?.(item);
                    onClose();
                  }}
                  aria-current={item.isActive ? 'page' : undefined}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-body font-medium transition-colors min-h-[44px] focus-ring',
                    item.isActive
                      ? 'bg-primary-soft text-primary-base font-semibold border border-primary-base/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                  )}
                >
                  {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer Slot */}
            {footerSlot && <div className="p-4 border-t border-divider bg-neutral-50 dark:bg-neutral-800/40">{footerSlot}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
