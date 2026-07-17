'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Camera,
  CircleDot,
  Keyboard,
  Sparkles,
} from 'lucide-react';

export interface StudioControlsProps {
  isStreaming: boolean;
  isPaused: boolean;
  isRecording: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onTakeSnapshot: () => void;
  onToggleRecord: () => void;
}

export function StudioControls({
  isStreaming,
  isPaused,
  isRecording,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onTakeSnapshot,
  onToggleRecord,
}: StudioControlsProps) {
  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside textarea or input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isStreaming && !isPaused) {
          onStart();
        } else if (isStreaming && !isPaused) {
          onPause();
        } else if (isPaused) {
          onResume();
        }
      } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
        // Prevent accidental browser reload if ctrl+R, but allow key R when simple
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (isStreaming || isPaused) onToggleRecord();
        }
      } else if (e.code === 'KeyC' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onReset();
      } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (isStreaming || isPaused) onTakeSnapshot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStreaming, isPaused, isRecording, onStart, onPause, onResume, onReset, onTakeSnapshot, onToggleRecord]);

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4 transition-all">
      {/* Left: Primary Start/Pause/Stop suite */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {!isStreaming && !isPaused ? (
          <Button
            variant="gradient"
            size="lg"
            onClick={onStart}
            icon={<Play className="w-5 h-5 fill-current" />}
            className="shadow-indigo-500/25 px-6 font-extrabold tracking-wide"
          >
            Start Detection
          </Button>
        ) : isPaused ? (
          <Button
            variant="gradient"
            size="lg"
            onClick={onResume}
            icon={<Play className="w-5 h-5 fill-current" />}
            className="shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-6 font-extrabold tracking-wide"
          >
            Resume Live Stream
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={onPause}
            icon={<Pause className="w-5 h-5 fill-current text-amber-400" />}
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 px-6 font-bold"
          >
            Pause Detection
          </Button>
        )}

        {(isStreaming || isPaused) && (
          <Button
            variant="danger"
            size="md"
            onClick={onStop}
            icon={<Square className="w-4 h-4 fill-current" />}
            className="font-bold"
          >
            Stop Session
          </Button>
        )}

        <div className="h-7 w-px bg-slate-800 hidden sm:block mx-1" />

        {/* Secondary Actions */}
        <Button
          variant="outline"
          size="md"
          onClick={onReset}
          icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
          title="Clear all recognized text and reset buffers (C)"
        >
          Reset Session
        </Button>

        {(isStreaming || isPaused) && (
          <Button
            variant="outline"
            size="md"
            onClick={onTakeSnapshot}
            icon={<Camera className="w-4 h-4 text-indigo-400" />}
            title="Take High-Resolution Snapshot (S)"
          >
            Snapshot
          </Button>
        )}

        {(isStreaming || isPaused) && (
          <button
            onClick={onToggleRecord}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              isRecording
                ? 'bg-rose-600/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/40 animate-pulse'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Record session video and recognized gestures (R)"
          >
            <CircleDot className={`w-4 h-4 ${isRecording ? 'text-rose-500 fill-current animate-ping' : 'text-slate-400'}`} />
            <span>{isRecording ? 'Stop Recording' : 'Record Session'}</span>
          </button>
        )}
      </div>

      {/* Right: Keyboard Shortcuts Guide */}
      <div className="hidden xl:flex items-center gap-3 bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-2 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
          <Keyboard className="w-4 h-4" />
          <span>Hotkeys:</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">Space</kbd>
          <span>Start/Pause</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">R</kbd>
          <span>Record</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">S</kbd>
          <span>Snapshot</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">C</kbd>
          <span>Clear</span>
        </span>
      </div>
    </div>
  );
}
