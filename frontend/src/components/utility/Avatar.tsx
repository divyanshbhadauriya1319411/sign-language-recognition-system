'use client';

import React from 'react';
import clsx from 'clsx';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

/**
 * Avatar component displaying user profile pictures, fallback initials, or default icons
 * with optional online/offline status badges.
 */
export function Avatar({ src, alt, name, size = 'md', status, className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-caption font-bold',
    md: 'w-10 h-10 text-small font-bold',
    lg: 'w-14 h-14 text-body-lg font-bold',
    xl: 'w-20 h-20 text-h4 font-bold',
  };

  const statusColors = {
    online: 'bg-success-base',
    offline: 'bg-neutral-400',
    busy: 'bg-error-base',
    away: 'bg-warning-base',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

  return (
    <div className={clsx('relative inline-flex shrink-0 select-none', className)}>
      <div
        className={clsx(
          'rounded-full bg-primary-soft text-primary-base flex items-center justify-center overflow-hidden border border-border shadow-2xs',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-current" aria-hidden="true" />
        )}
      </div>

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-surface',
            statusColors[status],
            statusSizes[size]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
