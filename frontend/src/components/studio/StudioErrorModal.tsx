'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  AlertTriangle,
  VideoOff,
  ShieldAlert,
  WifiOff,
  Cpu,
  Sun,
  Hand,
  Users,
  Globe,
  RefreshCw,
  X,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export type StudioErrorType =
  | 'camera_unavailable'
  | 'camera_disconnected'
  | 'permission_denied'
  | 'ai_model_not_loaded'
  | 'ai_init_failure'
  | 'poor_lighting'
  | 'no_hand_detected'
  | 'multiple_conflicting_hands'
  | 'websocket_disconnected'
  | 'network_interruption'
  | 'unsupported_browser'
  | 'processing_error';

export interface StudioErrorModalProps {
  errorType: StudioErrorType | null;
  errorMessage?: string | null;
  onRetry: () => void;
  onDismiss: () => void;
}

export function StudioErrorModal({
  errorType,
  errorMessage,
  onRetry,
  onDismiss,
}: StudioErrorModalProps) {
  if (!errorType) return null;

  const errorConfigs: Record<
    StudioErrorType,
    {
      title: string;
      description: string;
      steps: string[];
      icon: React.ReactNode;
      severity: 'danger' | 'warning';
      ctaText: string;
    }
  > = {
    camera_unavailable: {
      title: 'Camera Device Not Detected',
      description: errorMessage || 'We could not detect an active webcam hardware device attached to your system.',
      steps: [
        'Ensure your external webcam USB connection is plugged firmly into the port.',
        'If using a laptop built-in webcam, verify physical privacy shutters or physical toggle keys (Fn + F10) are open.',
        'Close any other applications (Zoom, Microsoft Teams, Discord) that might be locking the video track.',
      ],
      icon: <VideoOff className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Scan & Retry Camera',
    },
    camera_disconnected: {
      title: 'Camera Stream Disconnected',
      description: 'The live webcam video stream was abruptly terminated or the hardware was unplugged.',
      steps: [
        'Re-plug your USB webcam or check device manager settings.',
        'Verify power and cable integrity.',
        'Click the retry button below to re-initialize the MediaPipe video feed.',
      ],
      icon: <VideoOff className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Reconnect Video Stream',
    },
    permission_denied: {
      title: 'Webcam Access Permission Denied',
      description: 'Your browser has blocked SignBridge AI from accessing your camera. Real-time sign recognition requires video input.',
      steps: [
        'Look at the top-left of your browser URL address bar and click the padlock or camera icon.',
        'Locate the "Camera" setting and change it from "Block" to "Allow".',
        'Reload the workspace or click "Retry Permission" below to authorize access.',
      ],
      icon: <ShieldAlert className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Retry Permission',
    },
    ai_model_not_loaded: {
      title: 'AI Neural Model Not Loaded',
      description: 'The PyTorch Bi-LSTM 3D neural network weights have not finished loading into memory.',
      steps: [
        'Check if your system has sufficient free RAM (> 500MB recommended).',
        'Wait 10-15 seconds for the temporal weights to decompress from the cloud cache.',
        'Retry initializing the classification pipeline below.',
      ],
      icon: <Cpu className="w-8 h-8 text-amber-400" />,
      severity: 'warning',
      ctaText: 'Reload Neural Pipeline',
    },
    ai_init_failure: {
      title: 'AI Pipeline Initialization Failure',
      description: errorMessage || 'An unexpected computational error occurred while initializing MediaPipe spatial trackers.',
      steps: [
        'Ensure hardware acceleration (WebGL / GPU) is enabled in your browser settings.',
        'Clear browser cache if spatial weights got corrupted.',
        'Click below to restart the AI engine worker.',
      ],
      icon: <Cpu className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Restart AI Engine',
    },
    poor_lighting: {
      title: 'Sub-Optimal Ambient Lighting',
      description: 'Our luminance sensors detected very low light levels (< 45 lux). Hand joints may blur or drop tracking frames.',
      steps: [
        'Turn on a front-facing desk lamp or overhead room lighting.',
        'Avoid strong backlight (like sitting directly in front of a bright window).',
        'Ensure your hands contrast well with your background.',
      ],
      icon: <Sun className="w-8 h-8 text-amber-400" />,
      severity: 'warning',
      ctaText: 'Continue Anyway',
    },
    no_hand_detected: {
      title: 'No Sign Hands Detected',
      description: 'The MediaPipe tracker cannot locate your palms or fingers within the video frame boundary.',
      steps: [
        'Position yourself approximately 1.5 to 3 feet away from your webcam.',
        'Ensure both hands are raised above your waist and clearly visible in the camera preview window.',
        'Remove gloves or loose items that might obscure finger joints.',
      ],
      icon: <Hand className="w-8 h-8 text-amber-400" />,
      severity: 'warning',
      ctaText: 'Resume Tracking',
    },
    multiple_conflicting_hands: {
      title: 'Multiple Conflicting Hands Detected',
      description: 'We detected more than two hands or background motion interfering with primary sign tracking.',
      steps: [
        'Ensure only one signer is positioned directly inside the camera field of view.',
        'Ask bystanders to step outside the camera frame.',
        'Adjust camera zoom or angle to isolate the primary signer.',
      ],
      icon: <Users className="w-8 h-8 text-amber-400" />,
      severity: 'warning',
      ctaText: 'Re-calibrate Tracking',
    },
    websocket_disconnected: {
      title: 'AI Stream Socket Disconnected',
      description: 'The high-speed WebSocket connection to the backend recognition cluster has disconnected.',
      steps: [
        'Our system is automatically attempting exponential backoff reconnection.',
        'Check your Wi-Fi or Ethernet internet connection stability.',
        'Click below to force an immediate stream reconnect.',
      ],
      icon: <WifiOff className="w-8 h-8 text-amber-400" />,
      severity: 'warning',
      ctaText: 'Force Stream Reconnect',
    },
    network_interruption: {
      title: 'Network Disturbance Detected',
      description: errorMessage || 'Packet loss or high round-trip latency (> 300ms) is degrading real-time prediction accuracy.',
      steps: [
        'Switch to a stable 5GHz Wi-Fi or wired Ethernet connection if possible.',
        'Close background downloads or bandwidth-heavy streaming tabs.',
        'Try lowering video resolution to 720p in the camera settings bar.',
      ],
      icon: <WifiOff className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Retry Stream',
    },
    unsupported_browser: {
      title: 'Browser Not Supported',
      description: 'Your current browser lacks WebGL 2.0 or modern MediaStream API capabilities required for AI sign recognition.',
      steps: [
        'Please upgrade or switch to Google Chrome, Microsoft Edge, or Mozilla Firefox.',
        'Ensure your browser version is updated to the latest 2026 stable build.',
      ],
      icon: <Globe className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Check Browser Compatibility',
    },
    processing_error: {
      title: 'Backend Processing Disturbance',
      description: errorMessage || 'The AI classification worker encountered a temporal buffer anomaly or overflow.',
      steps: [
        'Our error handler has reset the T=30 sliding classification window.',
        'Resume signing normally; your conversation history remains intact.',
        'If the issue persists, click below to re-initialize the session.',
      ],
      icon: <AlertTriangle className="w-8 h-8 text-rose-400" />,
      severity: 'danger',
      ctaText: 'Reset Classification Buffer',
    },
  };

  const current = errorConfigs[errorType] || {
    title: 'System Notification',
    description: errorMessage || 'An unexpected state occurred.',
    steps: ['Please retry your action or refresh the workspace.'],
    icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
    severity: 'warning' as const,
    ctaText: 'Retry Action',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <Card className="max-w-lg w-full bg-slate-900 border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Top Header & Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                current.severity === 'danger'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              {current.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{current.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Diagnostic Code: {errorType.toUpperCase()}</p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          {current.description}
        </p>

        {/* Recovery Instructions Checklist */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recommended Recovery Steps</span>
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            {current.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                <span className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800/80">
          <Button variant="ghost" size="md" onClick={onDismiss} className="text-slate-400 hover:text-white text-xs">
            Dismiss & Continue
          </Button>

          <Button
            variant={current.severity === 'danger' ? 'danger' : 'gradient'}
            size="md"
            onClick={onRetry}
            icon={<RefreshCw className="w-4 h-4" />}
            className="font-bold tracking-wide"
          >
            {current.ctaText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
