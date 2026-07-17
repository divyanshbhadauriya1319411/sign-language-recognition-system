import React from 'react';
import clsx from 'clsx';

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; id: string }[];
}

export interface FooterProps {
  /** Brand section content */
  brandSlot?: React.ReactNode;
  /** Navigation link columns */
  columns?: FooterColumn[];
  /** Copyright text or legal notice */
  copyright?: string;
  /** Optional bottom right slot (e.g., status pill or language selector) */
  bottomRightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Responsive Footer with configurable branding area, link columns, and accessibility support.
 */
export function Footer({
  brandSlot = (
    <div className="space-y-2">
      <span className="text-h6 font-bold text-primary-base">SignBridge AI</span>
      <p className="text-small text-text-secondary max-w-sm">
        Enterprise real-time Indian Sign Language (ISL) recognition, translation, and communication platform.
      </p>
    </div>
  ),
  columns = [],
  copyright = `© ${new Date().getFullYear()} SignBridge AI Enterprise Platform. All rights reserved.`,
  bottomRightSlot,
  className,
}: FooterProps) {
  return (
    <footer className={clsx('border-t border-border bg-surface text-text-primary transition-colors', className)} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-divider/60">
          {/* Brand Slot (Spans 2 columns on larger screens) */}
          <div className="md:col-span-2">{brandSlot}</div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-small font-semibold tracking-wider uppercase text-text-primary select-none">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-small text-text-secondary hover:text-primary-base transition-colors min-h-[32px] inline-flex items-center rounded focus-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-text-secondary">
          <div>{copyright}</div>
          {bottomRightSlot && <div>{bottomRightSlot}</div>}
        </div>
      </div>
    </footer>
  );
}
