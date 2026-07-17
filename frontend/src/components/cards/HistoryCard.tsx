'use client';

import React from 'react';
import clsx from 'clsx';
import { Clock, Volume2, Copy, Trash2, Check } from 'lucide-react';
import { ConfidenceScoreIndicator } from '../ai/ConfidenceScoreIndicator';

export interface HistoryCardProps {
  /** Unique ID or reference string for the translation session */
  sessionId?: string;
  /** Recognized natural language translation text */
  translation: string;
  /** Formatted timestamp or duration string */
  timestamp: string;
  /** AI confidence score (0.0 to 1.0) */
  confidence: number;
  /** Optional callback to delete history item */
  onDelete?: () => void;
  /** Optional callback to play synthesized speech */
  onPlaySpeech?: () => void;
  /** Optional callback when user copies text */
  onCopy?: () => void;
  className?: string;
}

/**
 * History Card representing historical sign translation sessions with confidence indicators,
 * session references, and quick utility actions (speech synthesis, copy, delete).
 */
export function HistoryCard({
  sessionId,
  translation,
  timestamp,
  confidence,
  onDelete,
  onPlaySpeech,
  onCopy,
  className,
}: HistoryCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'rounded-lg border border-border bg-surface p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow text-left',
        className
      )}
    >
      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-3 border-b border-divider/60 pb-3 text-caption text-text-secondary">
        <div className="flex items-center gap-2">
          {sessionId && (
            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-text-primary">
              ID: {sessionId}
            </span>
          )}
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={timestamp}>{timestamp}</time>
          </span>
        </div>
        <ConfidenceScoreIndicator confidence={confidence} size="sm" showLabel={false} />
      </div>

      {/* Main Translation Content */}
      <div className="space-y-1">
        <p className="text-body font-medium text-text-primary leading-relaxed line-clamp-3">{translation}</p>
      </div>

      {/* Actions Footer */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-divider/40">
        <div className="flex items-center gap-1">
          {onPlaySpeech && (
            <button
              type="button"
              onClick={onPlaySpeech}
              className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-primary-base hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
              aria-label="Synthesize and play speech audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-primary-base hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
            aria-label={copied ? 'Copied' : 'Copy translation to clipboard'}
          >
            {copied ? <Check className="w-4 h-4 text-success-base" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-error-base hover:bg-error-soft/30 transition-colors focus-ring"
            aria-label="Delete history entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
