'use client';

import React from 'react';
import clsx from 'clsx';
import { Mail, Shield, UserCheck, Edit3 } from 'lucide-react';

export interface UserProfileCardProps {
  /** User display name */
  name: string;
  /** Role string (e.g. "Admin", "Deaf/Hard-of-Hearing Member", "Interpreter") */
  role: string;
  /** Email address */
  email?: string;
  /** Avatar image URL or fallback initials slot */
  avatarSlot?: React.ReactNode;
  /** Online / verification status */
  status?: 'online' | 'offline' | 'busy';
  /** Callback to edit profile */
  onEditProfile?: () => void;
  className?: string;
}

/**
 * User Profile Card displaying avatar slots, status rings, contact metadata, and quick action triggers.
 */
export function UserProfileCard({
  name,
  role,
  email,
  avatarSlot,
  status = 'online',
  onEditProfile,
  className,
}: UserProfileCardProps) {
  const statusColors = {
    online: 'bg-success-base',
    offline: 'bg-neutral-400',
    busy: 'bg-error-base',
  };

  return (
    <div className={clsx('rounded-lg border border-border bg-surface p-6 shadow-sm space-y-5 text-left', className)}>
      <div className="flex items-center gap-4">
        {/* Avatar Slot with status ring */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary-soft text-primary-base font-bold text-h4 flex items-center justify-center overflow-hidden border-2 border-border">
            {avatarSlot || name.slice(0, 2).toUpperCase()}
          </div>
          <span
            className={clsx('absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface', statusColors[status])}
            title={`Status: ${status}`}
          />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-h5 font-bold text-text-primary truncate">{name}</h3>
          <div className="flex items-center gap-1.5 text-caption font-semibold text-primary-base">
            <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{role}</span>
          </div>
        </div>
      </div>

      {email && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-border text-small text-text-secondary truncate">
          <Mail className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
          <span className="truncate">{email}</span>
        </div>
      )}

      {onEditProfile && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onEditProfile}
            className="w-full py-2.5 px-4 min-h-[44px] rounded-md border border-border bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-small font-medium text-text-primary inline-flex items-center justify-center gap-2 transition-colors focus-ring"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile Preferences</span>
          </button>
        </div>
      )}
    </div>
  );
}
