'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Whether multiple items can be open simultaneously */
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Accessible Accordion supporting single/multiple expansions and smooth height animations.
 */
export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds(allowMultiple ? [...openIds, id] : [id]);
    }
  };

  return (
    <div className={clsx('divide-y divide-divider/60 border border-border rounded-lg overflow-hidden bg-surface shadow-xs text-left', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="select-none">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 p-4 text-left text-body font-semibold text-text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors min-h-[48px] focus-ring"
            >
              <span>{item.title}</span>
              <ChevronDown className={clsx('w-5 h-5 text-text-secondary transition-transform duration-200 shrink-0', isOpen && 'rotate-180')} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-small text-text-secondary leading-relaxed border-t border-divider/40">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
