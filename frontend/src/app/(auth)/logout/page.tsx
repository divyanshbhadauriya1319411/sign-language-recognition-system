'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { logout as reduxLogout } from '@/store/slices/authSlice';
import authService from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { LogOut, ShieldAlert, ArrowLeft, CheckCircle2, Laptop } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout(logoutAllDevices);
    } catch {
      // Fallback
    } finally {
      dispatch(reduxLogout());
      setIsLoggingOut(false);
      setIsLoggedOut(true);
    }
  };

  return (
    <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl text-center">
      {isLoggedOut ? (
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Successfully Logged Out
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {logoutAllDevices
                ? 'All cryptographic tokens across your desktop, mobile, and tablet devices have been revoked. You are securely signed out everywhere.'
                : 'Your current browser session has been safely terminated. We hope to see you back in the studio soon!'}
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="gradient" size="lg" className="w-full font-bold min-h-[46px]">
                Sign In Again
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button variant="outline" size="md" className="w-full">
                Return to Public Homepage
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
            <LogOut className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign Out of SignBridge
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Are you sure you want to end your current session? Any unsaved custom gesture configurations will be preserved in your workspace.
            </p>
          </div>

          <AlertBanner type="info" title="Session Security">
            Signing out clears your local access tokens (`AES encrypted`) and revokes active API authorization headers.
          </AlertBanner>

          {/* Log out from all devices switch */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left flex items-start gap-3">
            <input
              id="logout_all"
              type="checkbox"
              checked={logoutAllDevices}
              onChange={(e) => setLogoutAllDevices(e.target.checked)}
              disabled={isLoggingOut}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-950 mt-1 transition-colors cursor-pointer"
            />
            <label htmlFor="logout_all" className="space-y-0.5 cursor-pointer select-none">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign out from all active devices (`Global Revocation`)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Enable this if you used a shared computer or suspect unauthorized account access.
              </p>
            </label>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              type="button"
              variant="danger"
              size="lg"
              onClick={handleConfirmLogout}
              isLoading={isLoggingOut}
              className="w-full font-bold min-h-[46px]"
            >
              Sign Out Now
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.back()}
              disabled={isLoggingOut}
              className="w-full font-semibold"
            >
              Cancel &amp; Return to Studio
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
