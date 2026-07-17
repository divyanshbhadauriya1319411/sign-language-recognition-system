'use client';

import React from 'react';
import clsx from 'clsx';
import { Eye, EyeOff, Activity } from 'lucide-react';

export interface HandLandmarkPreviewProps {
  /** Optional canvas element or overlay slot showing 42 3D landmarks */
  canvasSlot?: React.ReactNode;
  /** Whether landmarks are currently visible */
  isVisible?: boolean;
  /** Callback to toggle skeleton visibility */
  onToggleVisibility?: () => void;
  /** Whether diagnostic mode with 3D coordinate table is enabled */
  isDiagnosticMode?: boolean;
  /** Number of active hands tracked (0, 1, or 2) */
  handsCount?: number;
  /** Average FPS of tracking */
  fps?: number;
  className?: string;
}

/**
 * Hand Landmark Preview container providing skeletal overlay placeholders, diagnostic coordinate slots,
 * and quick visibility controls.
 */
export function HandLandmarkPreview({
  canvasSlot,
  isVisible = true,
  onToggleVisibility,
  isDiagnosticMode = false,
  handsCount = 0,
  fps = 30,
  className,
}: HandLandmarkPreviewProps) {
  return (
    <div className={clsx('rounded-xl border border-border bg-surface p-4 space-y-3 shadow-sm', className)}>
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-2 border-b border-divider pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-base" aria-hidden="true" />
          <h4 className="text-small font-semibold text-text-primary">MediaPipe 3D Landmark Tracking</h4>
        </div>
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="p-1.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
            aria-label={isVisible ? 'Hide skeletal overlay' : 'Show skeletal overlay'}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main Preview / Diagnostic Slot */}
      <div className="relative w-full rounded-lg bg-neutral-900 border border-neutral-800 min-h-[160px] flex items-center justify-center overflow-hidden">
        {isVisible && canvasSlot ? (
          canvasSlot
        ) : (
          <div className="text-caption text-neutral-400 font-mono text-center p-4">
            {isVisible ? 'Awaiting MediaPipe 3D coordinate stream...' : 'Skeletal overlay disabled.'}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between text-caption font-mono text-text-secondary pt-1">
        <span>Hands Tracked: <strong className="text-text-primary">{handsCount} / 2</strong></span>
        <span>Tracking Rate: <strong className="text-accent-base">{fps} FPS</strong></span>
        {isDiagnosticMode && <span className="text-primary-base font-bold">DIAGNOSTIC MODE</span>}
      </div>
    </div>
  );
}
