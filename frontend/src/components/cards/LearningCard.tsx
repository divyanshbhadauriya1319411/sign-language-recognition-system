'use client';

import React from 'react';
import clsx from 'clsx';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface LearningCardProps {
  /** Lesson title (e.g., "Daily Vocabulary: Emergency ISL Signs") */
  title: string;
  /** Difficulty level tag */
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Current progress percentage between 0 and 100 */
  progress?: number;
  /** Optional thumbnail image or illustration slot */
  thumbnailSlot?: React.ReactNode;
  /** Callback when user clicks action button */
  onStartLesson?: () => void;
  /** Custom action button label */
  actionLabel?: string;
  className?: string;
}

/**
 * Learning Card presenting educational ISL sign modules, difficulty ratings, progress tracking,
 * and quick interactive entry points.
 */
export function LearningCard({
  title,
  difficulty = 'Beginner',
  progress = 0,
  thumbnailSlot,
  onStartLesson,
  actionLabel = progress > 0 && progress < 100 ? 'Resume Lesson' : progress >= 100 ? 'Completed' : 'Start Lesson',
  className,
}: LearningCardProps) {
  const difficultyColors = {
    Beginner: 'bg-success-soft text-success-base border-success-base/20',
    Intermediate: 'bg-warning-soft text-warning-base border-warning-base/20',
    Advanced: 'bg-accent-soft text-accent-base border-accent-base/20',
  };

  const isCompleted = progress >= 100;

  return (
    <div className={clsx('rounded-lg border border-border bg-surface overflow-hidden shadow-sm flex flex-col justify-between text-left transition-all hover:shadow-md', className)}>
      {/* Thumbnail Slot */}
      <div className="relative w-full h-40 bg-neutral-900 overflow-hidden flex items-center justify-center">
        {thumbnailSlot || (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
            <BookOpen className="w-10 h-10 text-primary-base" />
            <span className="text-caption font-semibold">ISL Interactive Lesson Preview</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={clsx('text-caption font-semibold px-2.5 py-0.5 rounded-pill border', difficultyColors[difficulty])}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-h5 font-bold text-text-primary tracking-tight">{title}</h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-caption font-medium">
            <span className="text-text-secondary">Completion Progress</span>
            <span className="font-mono text-text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-300', isCompleted ? 'bg-success-base' : 'bg-primary-base')}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            fullWidth
            onClick={onStartLesson}
            icon={isCompleted ? <CheckCircle className="w-4 h-4 text-success-base" /> : <Award className="w-4 h-4" />}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
