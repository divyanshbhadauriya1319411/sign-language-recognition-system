'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import authService from '@/services/authService';
import { Spinner } from '@/components/progress/Loader';
import { ShieldAlert } from 'lucide-react';
import { UserRole } from '@/types';

export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * AuthGuard (`AuthGuard`)
 * Client-side route protection guard verifying authentication state, token existence, and RBAC roles.
 * Automatically preserves the intended destination URL via query parameter (`?redirect=...`).
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading: reduxLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // If Redux is still loading initial session state, wait
    if (reduxLoading) return;

    const tokenExists = authService.hasLocalToken();

    if (!isAuthenticated && !tokenExists) {
      // Redirect unauthenticated user to login while preserving target route
      const redirectUrl = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${redirectUrl}`);
      setIsChecking(false);
      return;
    }

    // Check Role-Based Access Control if required
    if (requiredRole && user) {
      const userRole = user.role || 'USER';
      if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
        // Unauthorized role -> redirect to dashboard
        router.replace('/dashboard');
        setIsChecking(false);
        return;
      }
    }

    setHasAccess(true);
    setIsChecking(false);
  }, [isAuthenticated, user, reduxLoading, pathname, router, requiredRole]);

  if (reduxLoading || isChecking) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <Spinner size="lg" />
        <p className="text-sm font-semibold text-slate-300 animate-pulse">
          Verifying security session &amp; authorization credentials...
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Verification Needed</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Redirecting you to our secure authentication portal...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
