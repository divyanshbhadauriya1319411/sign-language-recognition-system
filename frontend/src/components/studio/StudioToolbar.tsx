'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTheme } from '@/store/slices/preferencesSlice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SocketStatus } from '@/hooks/useAISocket';
import {
  Sparkles,
  Sun,
  Moon,
  HelpCircle,
  Settings,
  User,
  Wifi,
  WifiOff,
  Activity,
  Edit2,
  Check,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';

export interface StudioToolbarProps {
  socketStatus: SocketStatus;
  latencyMs: number;
  sessionTitle: string;
  onUpdateSessionTitle: (newTitle: string) => void;
  onOpenHelp: () => void;
  onOpenDiagnostics: () => void;
}

export function StudioToolbar({
  socketStatus,
  latencyMs,
  sessionTitle,
  onUpdateSessionTitle,
  onOpenHelp,
  onOpenDiagnostics,
}: StudioToolbarProps) {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.preferences);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sessionTitle);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateSessionTitle(tempTitle.trim());
    } else {
      setTempTitle(sessionTitle);
    }
    setIsEditingTitle(false);
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const statusMap: Record<SocketStatus, { variant: 'success' | 'warning' | 'danger' | 'purple' | 'info'; text: string }> = {
    connected: { variant: 'success', text: 'WebSocket Connected' },
    connecting: { variant: 'warning', text: 'Connecting...' },
    reconnecting: { variant: 'warning', text: 'Reconnecting...' },
    error: { variant: 'danger', text: 'Connection Disturbed' },
    disconnected: { variant: 'purple', text: 'Stream Paused' },
  };

  const currentBadge = statusMap[socketStatus] || { variant: 'purple', text: 'Offline' };

  return (
    <header className="sticky top-16 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Session Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-extrabold text-white tracking-tight block">SignBridge</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 block -mt-1">
                AI Studio
              </span>
            </div>
          </Link>

          <div className="h-6 w-px bg-slate-800 hidden md:block shrink-0" />

          {/* Session Title Editable */}
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="bg-slate-950 border border-indigo-500 rounded px-2.5 py-1 text-xs sm:text-sm text-white focus:outline-none w-48 sm:w-64"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                  title="Save Title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[280px]">
                  {sessionTitle}
                </span>
                <button
                  onClick={() => {
                    setTempTitle(sessionTitle);
                    setIsEditingTitle(true);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Edit Session Title"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Status + Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-1.5">
            <Badge variant={currentBadge.variant} size="sm">
              <span className="flex items-center gap-1.5 font-semibold">
                {socketStatus === 'connected' ? (
                  <Wifi className="w-3 h-3 animate-pulse text-emerald-400" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>{currentBadge.text}</span>
              </span>
            </Badge>

            {socketStatus === 'connected' && latencyMs > 0 && (
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono font-medium text-slate-300">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span>{latencyMs} ms RTT</span>
              </span>
            )}
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onOpenHelp}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold"
              title="ISL Cheat-Sheet & Help"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="hidden xl:inline">ISL Guide</span>
            </button>

            <button
              onClick={onOpenDiagnostics}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold"
              title="AI System Diagnostics"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">Health</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <Link href="/settings" className="block">
              <button
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                title="Workspace Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/dashboard" className="hidden sm:block">
              <button
                className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 text-xs font-bold transition-colors"
                title="User Profile & Dashboard"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{isAuthenticated ? user?.profile?.full_name || user?.email?.split('@')[0] || 'Member' : 'Guest'}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
