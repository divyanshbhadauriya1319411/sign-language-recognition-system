'use client';

import React from 'react';
import clsx from 'clsx';
import { Copy, Trash2, Sparkles, Check } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface SentenceBuilderPanelProps {
  /** Array of recognized sign words accumulated over time */
  words: string[];
  /** Callback when word list changes (editable or cleared) */
  onChangeWords?: (words: string[]) => void;
  /** Callback to clear the sentence */
  onClear?: () => void;
  /** Callback when user copies text */
  onCopy?: (fullSentence: string) => void;
  /** Future grammar suggestions placeholder list */
  grammarSuggestions?: string[];
  /** Callback when user applies a grammar suggestion */
  onApplySuggestion?: (suggestedSentence: string) => void;
  className?: string;
}

/**
 * Sentence Builder Panel enabling streaming recognized words, editable sentence assembly,
 * copy actions, clear operations, and future AI grammar enhancements.
 */
export function SentenceBuilderPanel({
  words = [],
  onChangeWords,
  onClear,
  onCopy,
  grammarSuggestions = [],
  onApplySuggestion,
  className,
}: SentenceBuilderPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const fullSentence = words.join(' ');

  const handleCopy = () => {
    if (!fullSentence) return;
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    onCopy?.(fullSentence);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeWord = (index: number) => {
    if (!onChangeWords) return;
    const updated = words.filter((_, i) => i !== index);
    onChangeWords(updated);
  };

  return (
    <div className={clsx('rounded-xl border border-border bg-surface p-5 space-y-4 shadow-sm', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-divider pb-3">
        <h4 className="text-small font-semibold text-text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-base" aria-hidden="true" />
          <span>Real-Time Sentence Assembly</span>
        </h4>
        <span className="text-caption text-text-secondary font-mono">{words.length} Words Captured</span>
      </div>

      {/* Accumulated Word Chips / Sentence Display */}
      <div className="min-h-[100px] p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-border flex flex-wrap gap-2 items-center">
        {words.length === 0 ? (
          <span className="text-body text-text-secondary italic">
            Recognized sign language tokens will stream here automatically...
          </span>
        ) : (
          words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-body font-medium text-text-primary shadow-2xs group"
            >
              <span>{word}</span>
              {onChangeWords && (
                <button
                  type="button"
                  onClick={() => removeWord(index)}
                  className="text-text-secondary hover:text-error-base transition-colors p-0.5 rounded focus-ring"
                  aria-label={`Remove word ${word}`}
                >
                  &times;
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Future Grammar Suggestions Placeholder */}
      {grammarSuggestions.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-caption font-semibold text-accent-base uppercase tracking-wider">AI Grammar Suggestions</span>
          <div className="flex flex-wrap gap-2">
            {grammarSuggestions.map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onApplySuggestion?.(suggestion)}
                className="px-3 py-1.5 min-h-[44px] rounded-md bg-accent-soft/40 hover:bg-accent-soft text-accent-base border border-accent-base/20 text-small font-medium transition-colors focus-ring"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-divider/60">
        <Button
          variant="ghost"
          icon={<Trash2 className="w-4 h-4 text-error-base" />}
          onClick={onClear}
          disabled={words.length === 0}
          className="text-error-base hover:text-error-hover"
        >
          Clear Transcript
        </Button>

        <Button
          variant="primary"
          icon={copied ? <Check className="w-4 h-4 text-success-base" /> : <Copy className="w-4 h-4" />}
          onClick={handleCopy}
          disabled={words.length === 0}
        >
          {copied ? 'Copied to Clipboard' : 'Copy Sentence'}
        </Button>
      </div>
    </div>
  );
}
