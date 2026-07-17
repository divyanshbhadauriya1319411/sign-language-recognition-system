'use client';

import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  /** Icon element representing the feature */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Descriptive summary */
  description: string;
  /** Optional action text (e.g. "Explore Studio") */
  actionText?: string;
  /** Callback when clicked */
  onClick?: () => void;
  /** Optional badge text */
  badgeText?: string;
  className?: string;
}

/**
 * Reusable Feature Card designed to highlight platform capabilities with subtle hover elevation,
 * semantic icon slots, and optional call-to-action triggers.
 */
export function FeatureCard({
  icon,
  title,
  description,
  actionText,
  onClick,
  badgeText,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      className={clsx(
        'rounded-lg border border-border bg-surface p-6 space-y-4 shadow-sm transition-all relative flex flex-col justify-between group',
        onClick && 'cursor-pointer hover:shadow-md hover:border-primary-base/40 focus-ring',
        className
      )}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="space-y-4">
        {/* Header: Icon & Optional Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary-base flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {badgeText && (
            <span className="text-caption font-semibold px-2.5 py-0.5 rounded-pill bg-accent-soft text-accent-base border border-accent-base/20 select-none">
              {badgeText}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 text-left">
          <h3 className="text-h4 font-bold text-text-primary tracking-tight">{title}</h3>
          <p className="text-small text-text-secondary line-clamp-3 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Optional Action Footer */}
      {actionText && (
        <div className="pt-3 flex items-center gap-1.5 text-small font-semibold text-primary-base group-hover:translate-x-1 transition-transform">
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  );
}
