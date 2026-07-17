'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  onChangeTab?: (tabId: string) => void;
  className?: string;
}

/**
 * Accessible Tabs component with active indicator micro-animations and arrow navigation.
 */
export function Tabs({ items, defaultTabId, onChangeTab, className }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || items[0]?.id || '');

  const handleSelect = (id: string) => {
    setActiveTabId(id);
    onChangeTab?.(id);
  };

  const activeContent = items.find((t) => t.id === activeTabId)?.content;

  return (
    <div className={clsx('w-full space-y-4 text-left', className)}>
      {/* Tab Header Bar */}
      <div className="border-b border-divider flex items-center gap-2 overflow-x-auto select-none" role="tablist">
        {items.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleSelect(tab.id)}
              className={clsx(
                'relative px-4 py-3 min-h-[44px] inline-flex items-center gap-2 text-small font-semibold transition-colors focus-ring whitespace-nowrap',
                isActive ? 'text-primary-base' : 'text-text-secondary hover:text-text-primary',
                tab.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
              )}
            >
              {tab.icon && <span className="shrink-0" aria-hidden="true">{tab.icon}</span>}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-base rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div role="tabpanel" aria-labelledby={activeTabId} className="pt-2">
        {activeContent}
      </div>
    </div>
  );
}
