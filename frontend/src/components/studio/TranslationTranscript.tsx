'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTTSSpeed, setVoiceGender } from '@/store/slices/preferencesSlice';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Volume2, VolumeX, Copy, Check, Trash2, Share2, Sparkles, ThumbsUp, ThumbsDown, Sliders
} from 'lucide-react';

interface TranslationTranscriptProps {
  lastPrediction: any;
  transcript: string[];
  onClear: () => void;
}

export function TranslationTranscript({ lastPrediction, transcript, onClear }: TranslationTranscriptProps) {
  const dispatch = useAppDispatch();
  const { tts_speed, voice_gender } = useAppSelector((state) => state.preferences);
  const [copied, setCopied] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'liked' | 'disliked'>('idle');

  const fullText = transcript.join(' ');

  const handleCopy = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayLatest = () => {
    if (lastPrediction?.tts_audio_base64) {
      const audio = new Audio(`data:audio/mpeg;base64,${lastPrediction.tts_audio_base64}`);
      audio.play().catch(() => {});
    }
  };

  return (
    <Card className="p-6 space-y-6 border-slate-800 flex flex-col justify-between h-full bg-slate-900/90">
      {/* Header & Status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Live Translation Output</h3>
            <p className="text-xs text-slate-400">Sliding window prediction & synthesized speech</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={lastPrediction?.confirmed ? 'success' : 'purple'} size="sm">
            {lastPrediction?.confirmed ? 'Confirmed Sign' : lastPrediction?.gesture || 'Standby'}
          </Badge>
          <span className="text-xs font-bold text-emerald-400">
            {lastPrediction?.confidence ? `${Math.round(lastPrediction.confidence * 100)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Transcript Log Stream */}
      <div className="flex-grow min-h-[160px] max-h-[260px] overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 font-medium text-slate-100">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2 py-8">
            <p className="text-xs italic">No signs recognized yet.</p>
            <p className="text-[11px] text-slate-600 max-w-xs">
              Position both hands in frame and perform an ISL gesture (e.g. Hello, Thank You, Emergency).
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {transcript.map((word, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-sm animate-fadeIn"
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* TTS & Voice Controls */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold">Voice:</span>
            <select
              value={voice_gender}
              onChange={(e) => dispatch(setVoiceGender(e.target.value as 'female' | 'male'))}
              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
            >
              <option value="female">Female (en-IN-Neerja)</option>
              <option value="male">Male (en-IN-Prabhat)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold">Speed:</span>
            <select
              value={tts_speed}
              onChange={(e) => dispatch(setTTSSpeed(parseFloat(e.target.value)))}
              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
            >
              <option value={0.75}>0.75x (Slow)</option>
              <option value={1.0}>1.0x (Normal)</option>
              <option value={1.25}>1.25x (Fast)</option>
              <option value={1.5}>1.5x (Speed)</option>
            </select>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePlayLatest}
              disabled={!lastPrediction?.tts_audio_base64}
              icon={<Volume2 className="w-4 h-4 text-indigo-400" />}
            >
              Replay Audio
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={transcript.length === 0}>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear} disabled={transcript.length === 0} title="Clear Transcript">
              <Trash2 className="w-4 h-4 text-rose-400" />
            </Button>
          </div>

          {/* Instant Feedback Thumbs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFeedbackState('liked')}
              title="Accurate Sign"
              className={`p-1.5 rounded-lg transition-colors ${
                feedbackState === 'liked' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFeedbackState('disliked')}
              title="Incorrect Sign Report"
              className={`p-1.5 rounded-lg transition-colors ${
                feedbackState === 'disliked' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
