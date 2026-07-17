'use client';

import React from 'react';
import clsx from 'clsx';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Shimmer Skeleton Loader with automatic reduced-motion support.
 */
export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-800 animate-pulse transition-colors select-none pointer-events-none';

  const variantClasses = {
    text: 'h-4 rounded w-3/4 my-1.5',
    rect: 'rounded-md w-full h-24',
    circle: 'rounded-full w-12 h-12 shrink-0',
    card: 'rounded-lg w-full h-48 border border-border/40',
  };

  return (
    <div
      role="status"
      aria-label="Loading content placeholder"
      style={{ width, height }}
      className={clsx(baseClasses, variantClasses[variant], className)}
    />
  );
}
