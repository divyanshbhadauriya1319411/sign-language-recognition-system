'use client';

import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, Camera, WifiOff, Server, ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface ErrorPresentationProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  errorCode?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

/**
 * Universal Error Presentation component supporting error codes, retry actions, and high-visibility alerts.
 */
export function ErrorPresentation({
  icon,
  title,
  description,
  errorCode,
  onRetry,
  retryText = 'Retry Connection',
  className,
}: ErrorPresentationProps) {
  return (
    <div
      className={clsx(
        'w-full max-w-xl mx-auto rounded-xl border border-error-base/40 bg-error-soft/10 p-8 flex flex-col items-center justify-center text-center gap-4 select-none shadow-sm',
        className
      )}
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-error-soft flex items-center justify-center text-error-base">
        {icon || <AlertTriangle className="w-8 h-8" aria-hidden="true" />}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-h5 font-bold text-text-primary">{title}</h3>
          {errorCode && (
            <span className="font-mono text-caption px-2 py-0.5 rounded bg-error-soft text-error-base font-bold">
              {errorCode}
            </span>
          )}
        </div>
        <p className="text-small text-text-secondary leading-relaxed max-w-md">{description}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button variant="danger" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured Error Presentation presets for AI inference pipelines and hardware issues.
 */
export function CameraErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPresentation
      icon={<Camera className="w-8 h-8" />}
      title="Camera Connection Failed"
      description="We could not access your webcam. Check hardware permissions, verify the device is plugged in, and ensure no other application is using the video stream."
      errorCode="ERR_CAM_01"
      onRetry={onRetry}
      retryText="Restart Video Stream"
    />
  );
}

export function AIModelErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPresentation
      icon={<Server className="w-8 h-8" />}
      title="AI Engine Inference Timeout"
      description="The spatial gesture recognition pipeline encountered an unexpected drop in frame sequence continuity. Please restart the tracking session."
      errorCode="ERR_MODEL_04"
      onRetry={onRetry}
      retryText="Reload AI Engine"
    />
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPresentation
      icon={<WifiOff className="w-8 h-8" />}
      title="Network Disconnected"
      description="Real-time translation sync requires an active internet connection. Check your network connection and retry."
      errorCode="ERR_NET_503"
      onRetry={onRetry}
      retryText="Check Connection"
    />
  );
}

export function PermissionDeniedState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPresentation
      icon={<ShieldAlert className="w-8 h-8" />}
      title="Access Authorization Denied"
      description="Your current user profile does not have permission to access enterprise diagnostic tools or raw landmark coordinate exports."
      errorCode="ERR_AUTH_403"
      onRetry={onRetry}
      retryText="Request Elevation"
    />
  );
}
