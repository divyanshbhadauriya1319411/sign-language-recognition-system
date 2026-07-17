'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface PasswordRequirementsProps {
  password?: string;
  className?: string;
}

/**
 * PasswordRequirements (`PasswordRequirements`)
 * Interactive checklist displaying real-time checkmarks as the user types their password.
 */
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password = '',
  className = '',
}) => {
  const requirements = useMemo(() => {
    return [
      {
        id: 'length',
        label: 'At least 8 characters long',
        met: password.length >= 8,
      },
      {
        id: 'uppercase',
        label: 'Contains at least one uppercase letter (A-Z)',
        met: /[A-Z]/.test(password),
      },
      {
        id: 'lowercase',
        label: 'Contains at least one lowercase letter (a-z)',
        met: /[a-z]/.test(password),
      },
      {
        id: 'number',
        label: 'Contains at least one number (0-9)',
        met: /\d/.test(password),
      },
      {
        id: 'symbol',
        label: 'Contains at least one symbol (!, @, #, $, etc.)',
        met: /[!@#$%^&*(),.?":{}|<>\-_+/~`]/.test(password),
      },
    ];
  }, [password]);

  return (
    <div className={`p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 ${className}`}>
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
        Password Policy Requirements
      </div>
      <ul className="space-y-1.5">
        {requirements.map((req) => (
          <li
            key={req.id}
            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
              req.met ? 'text-emerald-400 font-medium' : 'text-slate-400'
            }`}
          >
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
