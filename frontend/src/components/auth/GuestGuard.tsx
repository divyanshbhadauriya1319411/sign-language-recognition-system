'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import authService from '@/services/authService';
import { Spinner } from '@/components/progress/Loader';

export interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard (`GuestGuard`)
 * Client-side route guard ensuring only unauthenticated guests can access auth pages (`/login`, `/register`).
 * If an already authenticated user visits an auth page, they are automatically redirected to their intended destination (`?redirect=...` or `/dashboard`).
 */
const GuestGuardContent: React.FC<GuestGuardProps> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: reduxLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (reduxLoading) return;

    const tokenExists = authService.hasLocalToken();

    if (isAuthenticated || tokenExists) {
      // User is already signed in -> check if there's a redirect target, otherwise dashboard
      const target = searchParams.get('redirect') || '/dashboard';
      router.replace(target);
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, reduxLoading, router, searchParams]);

  if (reduxLoading || isChecking) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-400">
          Checking active authentication status...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-slate-400">
            Checking active authentication status...
          </p>
        </div>
      }
    >
      <GuestGuardContent>{children}</GuestGuardContent>
    </React.Suspense>
  );
};

export default GuestGuard;
