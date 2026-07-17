'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  gestureLabel?: string;
}

export function FeedbackModal({ isOpen, onClose, entryId, gestureLabel }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [issueType, setIssueType] = useState<'INCORRECT_SIGN' | 'LOW_CONFIDENCE' | 'UI_BUG' | 'OTHER'>('INCORRECT_SIGN');
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await api.post('/feedback/', {
        translation_id: entryId || undefined,
        rating,
        issue_type: issueType,
        actual_gesture: gestureLabel || undefined,
        comments: comments || `Reported on gesture: ${gestureLabel || 'General'}`,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg('Failed to submit feedback. Please make sure you are logged in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Translation Feedback" maxWidth="md">
      {submitted ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-white">Thank You for Your Feedback!</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your report helps our AI research team recalibrate our Indian Sign Language neural weights.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Gesture:</span>
            <span className="font-bold text-indigo-400">{gestureLabel || 'General System Accuracy'}</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Accuracy Rating (1 - 5 Stars)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                    rating >= star
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Issue Classification</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INCORRECT_SIGN">Incorrect Sign Recognized</option>
              <option value="LOW_CONFIDENCE">Low Confidence Score / Lag</option>
              <option value="UI_BUG">User Interface / Studio Bug</option>
              <option value="OTHER">Other Improvement Suggestion</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Detailed Comments & Context</label>
            <textarea
              rows={3}
              placeholder="Describe what the gesture should have been or any issues experienced during real-time tracking..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm" isLoading={isLoading} icon={<MessageSquare className="w-4 h-4" />}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
