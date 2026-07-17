'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export type StrengthLevel = 'Weak' | 'Fair' | 'Good' | 'Strong';

const COMMON_WEAK_PASSWORDS = [
  'password',
  'password123',
  '12345678',
  'qwerty123',
  'signbridge',
  'signbridge123',
  'admin123',
  'welcome123',
];

/**
 * PasswordStrengthMeter (`PasswordStrengthMeter`)
 * Visual 4-bar strength indicator evaluating password robustness against WCAG & NIST guidelines.
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  className = '',
}) => {
  const { score, label, color, feedback } = useMemo(() => {
    if (!password) {
      return { score: 0, label: 'Weak' as StrengthLevel, color: 'bg-slate-800', feedback: 'Enter a password' };
    }

    const lowerPassword = password.toLowerCase();
    if (COMMON_WEAK_PASSWORDS.some((weak) => lowerPassword.includes(weak))) {
      return {
        score: 1,
        label: 'Weak' as StrengthLevel,
        color: 'bg-rose-500',
        feedback: 'Avoid common dictionary words or predictable sequences',
      };
    }

    let points = 0;
    if (password.length >= 8) points += 1;
    if (password.length >= 12) points += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points += 1;
    if (/\d/.test(password)) points += 1;
    if (/[!@#$%^&*(),.?":{}|<>\-_+/~`]/.test(password)) points += 1;

    if (points <= 1) {
      return { score: 1, label: 'Weak' as StrengthLevel, color: 'bg-rose-500', feedback: 'Too short or predictable' };
    } else if (points === 2 || points === 3) {
      return { score: 2, label: 'Fair' as StrengthLevel, color: 'bg-amber-500', feedback: 'Add symbols or numbers for stronger protection' };
    } else if (points === 4) {
      return { score: 3, label: 'Good' as StrengthLevel, color: 'bg-blue-500', feedback: 'Almost there! Add more length or special characters' };
    } else {
      return { score: 4, label: 'Strong' as StrengthLevel, color: 'bg-emerald-500', feedback: 'Excellent high-entropy password' };
    }
  }, [password]);

  const textColor = {
    Weak: 'text-rose-400',
    Fair: 'text-amber-400',
    Good: 'text-blue-400',
    Strong: 'text-emerald-400',
  }[label];

  return (
    <div className={`space-y-2 ${className}`} role="status" aria-live="polite">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-400">Security Strength:</span>
        <span className={`${textColor} font-bold tracking-wide`}>{password ? label : '—'}</span>
      </div>

      {/* 4 Segmented Strength Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((barIndex) => {
          const isActive = password.length > 0 && barIndex <= score;
          return (
            <div key={barIndex} className="h-full rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isActive ? '100%' : '0%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`h-full ${isActive ? color : 'bg-transparent'}`}
              />
            </div>
          );
        })}
      </div>

      {password && (
        <p className="text-[11px] text-slate-400 leading-tight">
          {feedback}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
