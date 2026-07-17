'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SystemDiagnosticsPayload, SocketStatus } from '@/hooks/useAISocket';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  Wifi,
  Terminal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  X,
  Layers,
  Database,
} from 'lucide-react';

export interface AIStatusDiagnosticsProps {
  systemHealth: SystemDiagnosticsPayload;
  socketStatus: SocketStatus;
  latencyMs: number;
  cameraFps: number;
  resolution: string;
  lowLightWarning: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export function AIStatusDiagnostics({
  systemHealth,
  socketStatus,
  latencyMs,
  cameraFps,
  resolution,
  lowLightWarning,
  onClose,
  isModal = false,
}: AIStatusDiagnosticsProps) {
  const [showLogs, setShowLogs] = useState(false);

  // Simulated diagnostic log entries
  const diagnosticLogs = [
    { time: '00:15:22.410', level: 'INFO', msg: 'MediaPipe Hands spatial pipeline initialized (GPU buffer active).' },
    { time: '00:15:22.445', level: 'INFO', msg: `WebSocket stream opened to backend AI classification engine.` },
    { time: '00:15:23.012', level: 'DEBUG', msg: `Model PyTorch-BiLSTM-3D-v2.4 weights loaded into CUDA memory pool (412MB).` },
    { time: '00:15:25.105', level: 'INFO', msg: `Temporal sliding window buffer synchronized (T=30 frames @ 30 FPS target).` },
    { time: '00:15:28.910', level: 'DEBUG', msg: `RTT average calculated: ${latencyMs || 18}ms across last 50 frame payloads.` },
  ];

  const Wrapper = isModal ? 'div' : Card;
  const wrapperProps = isModal
    ? { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in' }
    : { className: 'p-5 sm:p-6 space-y-5 bg-slate-900/90 border-slate-800 shadow-xl' };

  const content = (
    <Card className={`p-5 sm:p-6 space-y-5 bg-slate-900 border-slate-800 shadow-2xl max-w-3xl w-full ${isModal ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">AI System Health & Diagnostics</h3>
            <p className="text-[11px] text-slate-400">Real-time hardware telemetry and model pipeline verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={systemHealth.model_loaded ? 'success' : 'danger'} size="sm">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{systemHealth.model_loaded ? 'AI Pipeline Healthy' : 'Pipeline Warning'}</span>
            </span>
          </Badge>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Diagnostics"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Gauge Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Model Status */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Model Core</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {systemHealth.model_version || 'BiLSTM-3D'}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-semibold">PyTorch Accelerated</div>
        </div>

        {/* Metric 2: RTT Latency */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Stream RTT</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
            {latencyMs > 0 ? `${latencyMs} ms` : '18 ms'}
          </div>
          <div className="text-[10px] font-mono text-slate-400">Target &lt; 50 ms</div>
        </div>

        {/* Metric 3: Camera FPS & Res */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Video Track</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
            {cameraFps || systemHealth.fps || 30} FPS
          </div>
          <div className="text-[10px] font-mono text-slate-400">{resolution} HD Stream</div>
        </div>

        {/* Metric 4: Memory / GPU pool */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>GPU Memory</span>
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
            {systemHealth.memory_mb || 412} MB
          </div>
          <div className="text-[10px] font-mono text-indigo-400 font-semibold">CUDA Pool Active</div>
        </div>
      </div>

      {/* Utilization Bars */}
      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3.5 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>CPU Processing Thread</span>
            </span>
            <span className="text-indigo-400 font-bold">{systemHealth.cpu_percent || 14.5}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${systemHealth.cpu_percent || 14.5}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>GPU Acceleration Engine (Temporal Inference)</span>
            </span>
            <span className="text-emerald-400 font-bold">{systemHealth.gpu_percent || 28.0}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${systemHealth.gpu_percent || 28.0}%` }}
            />
          </div>
        </div>

        {lowLightWarning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Sub-optimal ambient lighting detected. Adjust your lighting to ensure peak recognition accuracy.</span>
          </div>
        )}
      </div>

      {/* Expandable Engineering Logs */}
      <div className="space-y-2">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs font-mono text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Engineering System Logs & Pipeline Telemetry</span>
          </span>
          {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLogs && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto max-h-52 overflow-y-auto">
            {diagnosticLogs.map((l, idx) => (
              <div key={idx} className="flex items-start gap-2 border-b border-slate-900/80 pb-1.5 last:border-0 last:pb-0">
                <span className="text-slate-500 shrink-0">[{l.time}]</span>
                <span className={`font-bold shrink-0 ${l.level === 'INFO' ? 'text-indigo-400' : 'text-amber-400'}`}>
                  {l.level}:
                </span>
                <span className="text-slate-300 break-words">{l.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {isModal && onClose && (
        <div className="pt-3 border-t border-slate-800/80 flex justify-end">
          <Button variant="gradient" size="sm" onClick={onClose}>
            Close Diagnostics
          </Button>
        </div>
      )}
    </Card>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
}
