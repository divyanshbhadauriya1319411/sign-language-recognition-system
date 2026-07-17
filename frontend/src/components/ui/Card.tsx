'use client';

import React from 'react';
import clsx from 'clsx';
import { AIPredictionCard as AIStudioPredictionCard, AIPredictionCardProps as AIStudioPredictionCardProps } from '../ai/AIPredictionCard';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'standard' | 'interactive';
  glow?: boolean;
  glass?: boolean;
  className?: string;
}

export function Card({ children, variant = 'standard', glow = false, glass = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border transition-all duration-200',
        glass ? 'bg-surface/80 backdrop-blur-md border-border/60' : 'bg-surface border-border shadow-sm',
        glow && 'shadow-[0_0_25px_rgba(79,70,229,0.15)] dark:shadow-[0_0_25px_rgba(99,102,241,0.2)] border-primary-base/30',
        variant === 'interactive' && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus-ring',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type AIPredictionCardProps = AIStudioPredictionCardProps;
export const AIPredictionCard = AIStudioPredictionCard;
