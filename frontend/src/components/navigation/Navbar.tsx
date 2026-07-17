'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}

export interface NavbarProps {
  /** Brand name or logo slot */
  brand?: React.ReactNode;
  /** Navigation links */
  items?: NavItem[];
  /** Slot for right-side profile, notifications, or theme toggle */
  actionsSlot?: React.ReactNode;
  /** Callback when navigation link is clicked */
  onNavigate?: (item: NavItem) => void;
  /** Whether header is sticky to top of viewport */
  sticky?: boolean;
  /** Callback to toggle mobile drawer */
  onToggleMobileMenu?: () => void;
  /** Mobile menu state */
  isMobileMenuOpen?: boolean;
  className?: string;
}

/**
 * Top Navbar component supporting responsive navigation switching, sticky header behavior,
 * keyboard accessibility, and slots for branding and user actions.
 */
export function Navbar({
  brand = <span className="text-h6 font-bold text-primary-base tracking-tight">SignBridge AI</span>,
  items = [],
  actionsSlot,
  onNavigate,
  sticky = true,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  className,
}: NavbarProps) {
  return (
    <header
      className={clsx(
        'w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors z-40',
        sticky && 'sticky top-0',
        className
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Slot */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
          <div className="select-none">{brand}</div>
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => onNavigate?.(item)}
              aria-current={item.isActive ? 'page' : undefined}
              className={clsx(
                'relative px-3.5 py-2 rounded-md text-small font-medium transition-colors min-h-[44px] inline-flex items-center gap-2 focus-ring select-none',
                item.isActive
                  ? 'text-primary-base font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800/60',
                item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
            >
              {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
              {item.isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-base rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Actions / Profile / Theme Slot */}
        <div className="flex items-center gap-2 shrink-0">
          {actionsSlot}
        </div>
      </div>
    </header>
  );
}
