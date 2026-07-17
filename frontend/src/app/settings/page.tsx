'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import { setTheme, toggleHighContrast, setTTSSpeed, setVoiceGender } from '@/store/slices/preferencesSlice';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Settings as SettingsIcon, Eye, Sun, Moon, Volume2, Save, CheckCircle2, Shield, User as UserIcon
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { theme, high_contrast, tts_speed, voice_gender } = useAppSelector((state) => state.preferences);

  const [fullName, setFullName] = useState('');
  const [preferredLang, setPreferredLang] = useState('en');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.profile?.full_name || '');
      setPreferredLang(user.profile?.preferred_language || 'en');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      await api.put('/users/me/profile', {
        full_name: fullName,
        preferred_language: preferredLang,
        accessibility_settings: {
          high_contrast,
          theme,
          tts_speed,
          voice_gender,
          reduced_motion: false,
        },
        privacy_settings: {
          save_history: true,
          share_analytics: true,
        },
      });

      const meRes = await api.get('/users/me');
      dispatch(setUser(meRes.data));
      setUpdateMsg('Settings and WCAG AA accessibility profile updated successfully.');
      setTimeout(() => setUpdateMsg(null), 4000);
    } catch (err) {
      setUpdateMsg('Could not save settings. Please verify your authentication.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Settings & WCAG AA Profile</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure universal access options, high-contrast themes, speech synthesis voice, and personal details.
          </p>
        </div>
      </div>

      {updateMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{updateMsg}</span>
        </div>
      )}

      <Card className="p-8 border-slate-800">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">User Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<UserIcon className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Default Language</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English (India - Default)</option>
                  <option value="hi">Hindi (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">WCAG 2.2 AA Accessibility & Visuals</h3>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" /> High Contrast Mode
                </h4>
                <p className="text-xs text-slate-400">Enforces sharp yellow/black contrast boundaries and distinct focus indicators.</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(toggleHighContrast())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  high_contrast ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {high_contrast ? 'Active' : 'Standard'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  Color Theme
                </h4>
                <p className="text-xs text-slate-400">Toggle between dark night appearance and bright daytime appearance.</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                {theme.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400">Speech Synthesis (TTS) Preferences</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Default Voice Gender</label>
                <select
                  value={voice_gender}
                  onChange={(e) => dispatch(setVoiceGender(e.target.value as any))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="female">Female (Natural En-IN)</option>
                  <option value="male">Male (Natural En-IN)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Default Speaking Rate</label>
                <select
                  value={tts_speed}
                  onChange={(e) => dispatch(setTTSSpeed(parseFloat(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0.75}>0.75x (Slow & Distinct)</option>
                  <option value={1.0}>1.0x (Standard Speaking Rate)</option>
                  <option value={1.25}>1.25x (Accelerated)</option>
                  <option value={1.5}>1.5x (Fast Communication)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="gradient" size="md" isLoading={isUpdating} icon={<Save className="w-4 h-4" />}>
              Save All Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
