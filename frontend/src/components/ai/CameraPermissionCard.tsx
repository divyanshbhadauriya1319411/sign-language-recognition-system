'use client';

import React from 'react';
import clsx from 'clsx';
import { ShieldCheck, Camera, HelpCircle } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface CameraPermissionCardProps {
  status: 'pending' | 'denied' | 'granted';
  onRetry: () => void;
  onOpenHelp?: () => void;
  className?: string;
}

/**
 * Camera Permission Card explaining privacy guarantees, camera status, and troubleshooting guidance.
 */
export function CameraPermissionCard({
  status,
  onRetry,
  onOpenHelp,
  className,
}: CameraPermissionCardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-surface p-6 space-y-5 shadow-sm max-w-xl mx-auto text-left',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary-base flex items-center justify-center shrink-0">
          <Camera className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-h5 font-semibold text-text-primary">Enable Camera Access</h3>
          <p className="text-small text-text-secondary">
            SignBridge AI uses MediaPipe 3D spatial coordinate tracking directly within your secure browser session. Video streams are never recorded or stored without explicit authorization.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-border space-y-2">
        <div className="flex items-center gap-2 text-small font-semibold text-text-primary">
          <ShieldCheck className="w-4 h-4 text-success-base" aria-hidden="true" />
          <span>Privacy & Accessibility Guarantee</span>
        </div>
        <ul className="text-caption text-text-secondary space-y-1 list-disc list-inside pl-1">
          <li>Local frame debouncing (T=30 temporal sequence window)</li>
          <li>100% WCAG 2.2 AA compliant high-contrast overlays</li>
          <li>Instant disconnection upon closing or locking the tab</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 text-small text-text-secondary hover:text-primary-base transition-colors min-h-[44px] px-2 rounded focus-ring"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Troubleshooting Guide</span>
          </button>
        )}
        <Button variant="primary" onClick={onRetry}>
          {status === 'denied' ? 'Request Permission Again' : 'Grant Camera Access'}
        </Button>
      </div>
    </div>
  );
}
