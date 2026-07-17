'use client';

import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavItem } from './Navbar';

export interface SidebarProps {
  /** Navigation groups or flat list of items */
  items: NavItem[];
  /** Whether sidebar is collapsed to icon-only view */
  isCollapsed?: boolean;
  /** Callback to toggle collapse state */
  onToggleCollapse?: () => void;
  /** Callback when item is clicked */
  onNavigate?: (item: NavItem) => void;
  /** Optional bottom footer slot inside sidebar (e.g. system status or user card) */
  footerSlot?: React.ReactNode;
  className?: string;
}

/**
 * Collapsible Sidebar component with smooth width transitions, active route indication,
 * and high-contrast keyboard navigation.
 */
export function Sidebar({
  items,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
  footerSlot,
  className,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={clsx(
        'relative flex flex-col border-r border-border bg-surface h-[calc(100vh-4rem)] shrink-0 select-none overflow-hidden',
        className
      )}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <div className="p-3 flex justify-end border-b border-divider/60">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onNavigate?.(item)}
            aria-current={item.isActive ? 'page' : undefined}
            title={isCollapsed ? item.label : undefined}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-small font-medium transition-all min-h-[44px] focus-ring',
              item.isActive
                ? 'bg-primary-soft/80 text-primary-base font-semibold border border-primary-base/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60',
              item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
              isCollapsed && 'justify-center px-0'
            )}
          >
            {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="truncate text-left flex-1"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Optional Footer Slot */}
      {footerSlot && (
        <div className={clsx('p-3 border-t border-divider/60', isCollapsed && 'flex justify-center')}>
          {footerSlot}
        </div>
      )}
    </motion.aside>
  );
}
