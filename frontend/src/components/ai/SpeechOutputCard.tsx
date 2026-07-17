'use client';

import React from 'react';
import clsx from 'clsx';
import { Volume2, VolumeX, Settings, FastForward } from 'lucide-react';
import { SelectOption } from '../forms/SelectDropdown';

export interface SpeechOutputCardProps {
  /** Current synthesized translation text */
  text: string;
  /** Whether TTS synthesis is available */
  isSpeechAvailable?: boolean;
  /** Whether speech is currently playing */
  isPlaying?: boolean;
  /** Callback to trigger/stop playback */
  onTogglePlay?: () => void;
  /** Available voice options */
  voiceOptions?: SelectOption[];
  /** Selected voice ID */
  selectedVoice?: string;
  /** Callback when voice is changed */
  onChangeVoice?: (voice: string) => void;
  /** Speed multiplier (e.g. 1.0, 1.25, 1.5) */
  speed?: number;
  /** Callback when speed changes */
  onChangeSpeed?: (speed: number) => void;
  className?: string;
}

/**
 * Speech Output Card managing synthesized speech playback, voice selection placeholders,
 * and speed adjustments.
 */
export function SpeechOutputCard({
  text,
  isSpeechAvailable = true,
  isPlaying = false,
  onTogglePlay,
  voiceOptions = [
    { value: 'en-IN-NeerjaNeural', label: 'Neerja (Female, Hindi-English)' },
    { value: 'en-IN-PrabhatNeural', label: 'Prabhat (Male, Hindi-English)' },
  ],
  selectedVoice = 'en-IN-NeerjaNeural',
  onChangeVoice,
  speed = 1.0,
  onChangeSpeed,
  className,
}: SpeechOutputCardProps) {
  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className={clsx('rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-divider pb-3">
        <h4 className="text-small font-semibold text-text-primary flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary-base" aria-hidden="true" />
          <span>Speech Synthesis Output</span>
        </h4>
        <span className={clsx('text-caption font-medium px-2 py-0.5 rounded-pill', isSpeechAvailable ? 'bg-success-soft text-success-base' : 'bg-neutral-200 dark:bg-neutral-800 text-text-secondary')}>
          {isSpeechAvailable ? 'TTS Ready' : 'TTS Offline'}
        </span>
      </div>

      {/* Output Text Area */}
      <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-border min-h-[80px] flex items-center">
        <p className="text-body font-medium text-text-primary italic">
          {text || 'Synthesized speech output will appear dynamically as gestures are recognized...'}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          {/* Voice selector */}
          {onChangeVoice && (
            <select
              value={selectedVoice}
              onChange={(e) => onChangeVoice(e.target.value)}
              disabled={!isSpeechAvailable}
              aria-label="Select speech voice"
              className="px-3 py-2 min-h-[44px] rounded-md border border-border bg-surface text-small text-text-primary focus-ring transition-colors"
            >
              {voiceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Speed switcher */}
          {onChangeSpeed && (
            <div className="flex items-center border border-border rounded-md overflow-hidden bg-surface">
              {speeds.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeSpeed(s)}
                  disabled={!isSpeechAvailable}
                  className={clsx(
                    'px-2.5 py-2 min-h-[44px] text-caption font-mono font-semibold transition-colors focus-ring',
                    speed === s ? 'bg-primary-base text-white' : 'text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Play/Stop Button */}
        {onTogglePlay && (
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!isSpeechAvailable || !text}
            aria-label={isPlaying ? 'Stop speech synthesis' : 'Play speech synthesis'}
            className="px-5 py-2 min-h-[44px] rounded-md bg-primary-base hover:bg-primary-hover disabled:opacity-40 text-white font-medium inline-flex items-center gap-2 shadow-sm transition-colors focus-ring"
          >
            {isPlaying ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            <span>{isPlaying ? 'Stop Speech' : 'Play Speech'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
