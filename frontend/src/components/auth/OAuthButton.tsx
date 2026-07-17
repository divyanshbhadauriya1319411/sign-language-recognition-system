'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export type OAuthProvider = 'google' | 'github' | 'microsoft';

export interface OAuthButtonProps {
  provider: OAuthProvider;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * OAuthButton (`OAuthButton`)
 * Reusable social authentication action button with distinct branding and 44x44px touch targets.
 */
export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const providerConfig = {
    google: {
      name: 'Google',
      icon: (
        <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16C3.5 19.8 7.4 23 12 23z"
          />
        </svg>
      ),
    },
    github: {
      name: 'GitHub',
      icon: (
        <svg className="w-4 h-4 mr-2.5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    microsoft: {
      name: 'Microsoft',
      icon: (
        <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 21 21">
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
      ),
    },
  }[provider];

  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      className={`w-full font-semibold min-h-[44px] bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200 transition-all focus-ring ${className}`}
    >
      {!isLoading && providerConfig.icon}
      Continue with {providerConfig.name}
    </Button>
  );
};

export default OAuthButton;
