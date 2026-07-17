'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTTSSpeed, setVoiceGender } from '@/store/slices/preferencesSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sliders,
  Radio,
  WifiOff,
  Sparkles,
  Headphones,
  Check,
} from 'lucide-react';

export interface TTSPanelProps {
  currentText: string;
  lastAudioBase64?: string;
}

export function TTSPanel({ currentText, lastAudioBase64 }: TTSPanelProps) {
  const dispatch = useAppDispatch();
  const { tts_speed, voice_gender } = useAppSelector((state) => state.preferences);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(100);
  const [selectedVoiceId, setSelectedVoiceId] = useState('aditi-neural');
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const voices = [
    { id: 'aditi-neural', label: 'Aditi (ISL Neural Female)', gender: 'female', lang: 'en-IN' },
    { id: 'ravi-neural', label: 'Ravi (ISL Neural Male)', gender: 'male', lang: 'en-IN' },
    { id: 'ananya-hindi', label: 'Ananya (Standard Hindi Female)', gender: 'female', lang: 'hi-IN' },
    { id: 'kabir-english', label: 'Kabir (Standard English Male)', gender: 'male', lang: 'en-GB' },
  ];

  const handleVoiceChange = (id: string) => {
    setSelectedVoiceId(id);
    const found = voices.find((v) => v.id === id);
    if (found) {
      dispatch(setVoiceGender(found.gender as any));
    }
  };

  const handleSpeedChange = (speed: number) => {
    dispatch(setTTSSpeed(speed));
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Play Audio (either from Base64 or WebSpeech Synthesis fallback)
  const handlePlay = () => {
    if (!currentText && !lastAudioBase64) return;

    // If already paused, resume
    if (isPaused && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop existing
    handleStop();

    if (lastAudioBase64) {
      try {
        const audio = new Audio(`data:audio/mpeg;base64,${lastAudioBase64}`);
        audioRef.current = audio;
        audio.volume = volume / 100;
        audio.playbackRate = tts_speed || 1.0;

        audio.onplay = () => {
          setIsPlaying(true);
          setIsPaused(false);
          startProgressSim();
        };

        audio.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(100);
          stopProgressSim();
        };

        audio.play().catch(() => {
          // Fallback to WebSpeech if data URI fails
          fallbackWebSpeech();
        });
        return;
      } catch (e) {
        fallbackWebSpeech();
      }
    } else {
      fallbackWebSpeech();
    }
  };

  const fallbackWebSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentText || 'No text recognized yet.');
    const foundVoice = voices.find((v) => v.id === selectedVoiceId);
    utterance.lang = foundVoice?.lang || 'en-IN';
    utterance.rate = tts_speed || 1.0;
    utterance.volume = volume / 100;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      startProgressSim();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      stopProgressSim();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      stopProgressSim();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        stopProgressSim();
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    stopProgressSim();
  };

  const startProgressSim = () => {
    stopProgressSim();
    setProgress(5);
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 10;
      });
    }, 300);
  };

  const stopProgressSim = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  return (
    <Card className="p-5 sm:p-6 space-y-5 bg-slate-900/90 border-slate-800 flex flex-col justify-between shadow-xl min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Speech Engine (TTS)</h3>
            <p className="text-[11px] text-slate-400">Neural vocalization with offline fallback</p>
          </div>
        </div>

        <Badge variant="success" size="sm">
          <span className="flex items-center gap-1 font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Neural Engine Ready</span>
          </span>
        </Badge>
      </div>

      {/* Voice Selection & Waveform Display */}
      <div className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Select Vocal Identity & Accent</span>
            <span className="text-[10px] text-indigo-400 font-mono">ISL Optimized</span>
          </label>
          <select
            value={selectedVoiceId}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium transition-colors"
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Waveform Simulator */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{isPlaying ? 'Synthesizing Audio Output...' : isPaused ? 'Audio Paused' : 'Standby Waveform'}</span>
            <span>{isPlaying ? `${Math.round(progress)}%` : isPaused ? 'Paused' : '0:00'}</span>
          </div>

          <div className="flex items-center justify-between gap-1 h-8 px-2">
            {Array.from({ length: 28 }).map((_, idx) => {
              const heightPct = isPlaying
                ? Math.sin((idx + progress / 5) * 0.8) * 45 + 50
                : idx % 3 === 0
                ? 30
                : 15;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isPlaying && (idx / 28) * 100 <= progress
                      ? 'bg-gradient-to-t from-indigo-500 to-emerald-400 scale-y-110 shadow-sm'
                      : 'bg-slate-800'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Speed and Volume Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Speech Speed</span>
              <span className="font-mono text-indigo-400">{tts_speed || 1.0}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={tts_speed || 1.0}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.5x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Fast)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Output Volume</span>
              <span className="font-mono text-indigo-400">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={volume}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setVolume(val);
                if (audioRef.current) audioRef.current.volume = val / 100;
              }}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Mute</span>
              <span>50%</span>
              <span>Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button variant="outline" size="sm" onClick={handlePause} icon={<Pause className="w-4 h-4" />}>
              Pause
            </Button>
          ) : (
            <Button
              variant="gradient"
              size="sm"
              onClick={handlePlay}
              disabled={!currentText && !lastAudioBase64}
              icon={<Play className="w-4 h-4" />}
            >
              Play Speech
            </Button>
          )}

          {(isPlaying || isPaused) && (
            <Button variant="ghost" size="sm" onClick={handleStop} icon={<Square className="w-4 h-4 text-rose-400" />}>
              Stop
            </Button>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-indigo-400" />
          <span>Zero-latency local acoustic buffer</span>
        </div>
      </div>
    </Card>
  );
}
