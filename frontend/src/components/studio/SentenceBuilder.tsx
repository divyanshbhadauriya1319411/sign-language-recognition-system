'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Volume2,
  Edit3,
  Lock,
  Unlock,
  Sparkles,
  Plus,
} from 'lucide-react';

export interface SentenceBuilderProps {
  words: string[];
  onWordsChange: (newWords: string[]) => void;
  onClear: () => void;
  onSpeakText?: (textToSpeak: string) => void;
  onSaveConversation?: (fullText: string) => void;
}

export function SentenceBuilder({
  words,
  onWordsChange,
  onClear,
  onSpeakText,
  onSaveConversation,
}: SentenceBuilderProps) {
  const [isManualEditMode, setIsManualEditMode] = useState(false);
  const [editText, setEditText] = useState(words.join(' '));
  const [history, setHistory] = useState<string[][]>([words]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const prevWordsRef = useRef<string[]>(words);

  // Sync state when external words arrive (only when not in manual edit mode)
  useEffect(() => {
    if (isManualEditMode) return;

    // Check if words actually changed
    const currentJoined = words.join(' ');
    const prevJoined = prevWordsRef.current.join(' ');
    if (currentJoined !== prevJoined) {
      setEditText(currentJoined);
      prevWordsRef.current = words;

      // Push to undo history stack
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, words];
      });
      setHistoryIndex((prev) => prev + 1);
    }
  }, [words, isManualEditMode, historyIndex]);

  // Handle Manual Text Input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditText(value);
    const splitWords = value.trim().split(/\s+/).filter(Boolean);
    onWordsChange(splitWords);
  };

  // Undo / Redo actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const targetWords = history[nextIdx];
      setHistoryIndex(nextIdx);
      setEditText(targetWords.join(' '));
      onWordsChange(targetWords);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const targetWords = history[nextIdx];
      setHistoryIndex(nextIdx);
      setEditText(targetWords.join(' '));
      onWordsChange(targetWords);
    }
  };

  // Copy text to clipboard
  const handleCopy = () => {
    const textToCopy = isManualEditMode ? editText : words.join(' ');
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save Conversation
  const handleSave = () => {
    const textToSave = isManualEditMode ? editText : words.join(' ');
    if (!textToSave) return;

    if (onSaveConversation) {
      onSaveConversation(textToSave);
    } else {
      // Fallback: download as text file
      const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ISL-Conversation-${new Date().toISOString().slice(0, 10)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Speak Current Text
  const handleSpeak = () => {
    const textToSpeak = isManualEditMode ? editText : words.join(' ');
    if (!textToSpeak) return;
    if (onSpeakText) {
      onSpeakText(textToSpeak);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quick punctuation addition
  const addPunctuation = (punct: string) => {
    const current = isManualEditMode ? editText : words.join(' ');
    const updated = `${current.trim()}${punct} `;
    setEditText(updated);
    onWordsChange(updated.trim().split(/\s+/).filter(Boolean));
  };

  const currentText = isManualEditMode ? editText : words.join(' ');
  const charCount = currentText.length;
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

  return (
    <Card className="p-5 sm:p-6 space-y-5 bg-slate-900/90 border-slate-800 flex flex-col justify-between shadow-xl min-h-[420px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <FileText className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Smart Sentence Builder</h3>
            <p className="text-[11px] text-slate-400">Streams recognized words into structured speech</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isManualEditMode ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => {
              if (!isManualEditMode) {
                setEditText(words.join(' '));
              }
              setIsManualEditMode(!isManualEditMode);
            }}
            icon={isManualEditMode ? <Lock className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
          >
            {isManualEditMode ? 'Manual Mode (Auto-Insert Paused)' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Main Textarea / Display Area */}
      <div className="relative flex-1 flex flex-col space-y-3">
        <div className="relative flex-1">
          <textarea
            value={isManualEditMode ? editText : words.join(' ')}
            onChange={handleTextChange}
            readOnly={!isManualEditMode}
            placeholder={
              isManualEditMode
                ? 'Type or edit recognized sign language text manually here...'
                : 'Waiting for AI recognition stream... As you sign, gestures will automatically assemble into natural sentences right here.'
            }
            className={`w-full h-full min-h-[160px] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed font-medium transition-all focus:outline-none resize-none ${
              isManualEditMode
                ? 'bg-slate-950 border-2 border-indigo-500 text-white shadow-inner'
                : 'bg-slate-950/70 border border-slate-800 text-slate-200 cursor-default'
            }`}
          />

          {isManualEditMode && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="sm">
                <span>Auto-Insert Paused</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Punctuation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-slate-400 font-semibold px-1">Quick Punctuation:</span>
            {['.', ',', '?', '!', ' - ', '"'].map((p, i) => (
              <button
                key={i}
                onClick={() => addPunctuation(p)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold transition-colors border border-slate-700/60"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 px-1">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left Undo/Redo & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditText('');
              setHistory([[]]);
              setHistoryIndex(0);
              onClear();
            }}
            icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            className="text-slate-400 hover:text-rose-400"
          >
            Clear
          </Button>
        </div>

        {/* Right Speak, Copy, Save */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            icon={saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          >
            {saved ? 'Saved!' : 'Save'}
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleSpeak}
            disabled={!currentText.trim()}
            icon={<Volume2 className="w-4 h-4" />}
          >
            Speak Aloud
          </Button>
        </div>
      </div>
    </Card>
  );
}
