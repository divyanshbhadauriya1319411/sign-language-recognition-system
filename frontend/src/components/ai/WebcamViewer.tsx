'use client';

import React from 'react';
import clsx from 'clsx';
import { Camera, AlertTriangle, Maximize2, Minimize2, FlipHorizontal, RefreshCw } from 'lucide-react';

export type CameraState = 'loading' | 'active' | 'permission-required' | 'unavailable' | 'error';

export interface WebcamViewerProps {
  state: CameraState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMirrored?: boolean;
  onToggleMirror?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onRequestPermission?: () => void;
  /** Slot for rendering glowing skeleton overlays or MediaPipe canvas */
  overlaySlot?: React.ReactNode;
  /** Optional overlay badges or controls */
  controlsSlot?: React.ReactNode;
  className?: string;
}

/**
 * Reusable Webcam Preview Container supporting mirroring, fullscreen toggles, overlays,
 * and semantic fallback states when permissions are pending or unavailable.
 */
export function WebcamViewer({
  state,
  videoRef,
  isMirrored = true,
  onToggleMirror,
  isFullscreen = false,
  onToggleFullscreen,
  onRequestPermission,
  overlaySlot,
  controlsSlot,
  className,
}: WebcamViewerProps) {
  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-xl bg-neutral-900 border border-border shadow-lg transition-all flex flex-col items-center justify-center select-none aspect-video',
        isFullscreen && 'fixed inset-0 z-50 rounded-none aspect-auto h-screen w-screen',
        className
      )}
      role="region"
      aria-label="Webcam Video Stream"
    >
      {/* Active Video Stream & Overlays */}
      {state === 'active' && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={clsx('w-full h-full object-cover transition-transform duration-300', isMirrored && 'scale-x-[-1]')}
          />
          {overlaySlot && <div className="absolute inset-0 pointer-events-none">{overlaySlot}</div>}

          {/* Top/Bottom Controls Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {onToggleMirror && (
              <button
                type="button"
                onClick={onToggleMirror}
                className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-colors focus-ring"
                aria-label={isMirrored ? 'Disable video mirroring' : 'Enable video mirroring'}
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
            )}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-colors focus-ring"
                aria-label={isFullscreen ? 'Exit fullscreen view' : 'Enter fullscreen view'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          {controlsSlot && <div className="absolute bottom-4 left-4 right-4 z-10">{controlsSlot}</div>}
        </>
      )}

      {/* Loading State */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-3 text-text-secondary p-8">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-base" aria-hidden="true" />
          <p className="text-body font-medium">Initializing high-definition video stream...</p>
        </div>
      )}

      {/* Permission Required State */}
      {state === 'permission-required' && (
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md p-8">
          <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center text-primary-base">
            <Camera className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-h5 font-semibold text-white">Camera Access Required</h3>
            <p className="text-small text-neutral-400">
              To recognize Indian Sign Language gestures in real time, SignBridge AI needs permission to access your webcam.
            </p>
          </div>
          {onRequestPermission && (
            <button
              type="button"
              onClick={onRequestPermission}
              className="px-6 py-2.5 min-h-[44px] rounded-md bg-primary-base hover:bg-primary-hover text-white font-medium shadow transition-colors focus-ring"
            >
              Enable Camera
            </button>
          )}
        </div>
      )}

      {/* Unavailable / Error State */}
      {(state === 'unavailable' || state === 'error') && (
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md p-8">
          <div className="w-14 h-14 rounded-full bg-error-soft flex items-center justify-center text-error-base">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-h5 font-semibold text-white">Webcam Unavailable</h3>
            <p className="text-small text-neutral-400">
              No active camera hardware detected or the device is locked by another application. Please verify your USB or system privacy settings.
            </p>
          </div>
          {onRequestPermission && (
            <button
              type="button"
              onClick={onRequestPermission}
              className="px-6 py-2.5 min-h-[44px] rounded-md bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors focus-ring"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}
    </div>
  );
}
