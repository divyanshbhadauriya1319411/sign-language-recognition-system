'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import authService from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { Spinner } from '@/components/progress/Loader';
import { CheckCircle2, AlertTriangle, Mail, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'verified' | 'expired' | 'manual'>('manual');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (token) {
      setStatus('verifying');
      authService
        .verifyEmail(token)
        .then(() => {
          setStatus('verified');
        })
        .catch((err: any) => {
          const detail = err.response?.data?.detail;
          setErrorMsg(detail || 'The verification link has expired or is invalid.');
          setStatus('expired');
        });
    }
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || resendTimer > 0) return;

    setIsResending(true);
    setErrorMsg(null);
    setResendSuccess(false);
    try {
      await authService.resendVerification(resendEmail);
      setResendSuccess(true);
      setResendTimer(60);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail === 'Rate limit exceeded') {
        setErrorMsg('Please wait 15 minutes before requesting another verification email.');
      } else {
        setErrorMsg(detail || 'Failed to resend verification email. Please verify the address.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
      {status === 'verifying' ? (
        <div className="space-y-6 text-center py-8 animate-fade-in">
          <Spinner size="lg" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verifying Email Address...
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Please wait while our security service validates your activation token.
            </p>
          </div>
        </div>
      ) : status === 'verified' ? (
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Email Verified Successfully!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your account is now fully active. You have full access to real-time MediaPipe webcam translation, custom gesture recording, and enterprise export options.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Account Level: Full Access Authorized</span>
          </div>

          <div className="pt-2">
            <Link href="/studio" className="block w-full">
              <Button variant="gradient" size="lg" icon={<ArrowRight className="w-4 h-4" />} className="w-full font-bold min-h-[46px]">
                Launch AI Sign Studio
              </Button>
            </Link>
          </div>
        </div>
      ) : status === 'expired' ? (
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verification Link Expired
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {errorMsg || 'For security purposes, verification links expire after 24 hours. Please enter your email address to receive a fresh activation link.'}
            </p>
          </div>

          {resendSuccess && (
            <AlertBanner type="success" title="Activation Link Dispatched">
              A new verification email has been sent. Please check your inbox and spam folders.
            </AlertBanner>
          )}

          <form onSubmit={handleResend} className="space-y-4 text-left pt-2">
            <Input
              label="Account Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              disabled={isResending || resendTimer > 0}
            />

            <Button
              type="submit"
              variant="gradient"
              size="md"
              disabled={isResending || resendTimer > 0 || !resendEmail}
              className="w-full font-bold min-h-[44px]"
            >
              {resendTimer > 0 ? (
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 animate-spin" />
                  Resend available in {resendTimer}s
                </span>
              ) : (
                'Send New Verification Link'
              )}
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        /* Manual state when no token query parameter exists */
        <div className="space-y-6 text-center py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verify Your Email Address
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              We require email confirmation before granting access to enterprise gesture datasets. If you did not receive our email upon signup, request a fresh link below.
            </p>
          </div>

          {errorMsg && (
            <AlertBanner type="error" title="Resend Failed">
              {errorMsg}
            </AlertBanner>
          )}

          {resendSuccess && (
            <AlertBanner type="success" title="Activation Link Dispatched">
              A verification email has been dispatched. Please check your inbox and click the secure link.
            </AlertBanner>
          )}

          <form onSubmit={handleResend} className="space-y-4 text-left pt-2">
            <Input
              label="Account Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              disabled={isResending || resendTimer > 0}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isResending || resendTimer > 0 || !resendEmail}
              className="w-full font-bold min-h-[46px]"
            >
              {resendTimer > 0 ? (
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 animate-spin" />
                  Resend available in {resendTimer}s
                </span>
              ) : (
                'Send Verification Link'
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-between">
            <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Return to Sign In
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Need Help?
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading email verification...</div>}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
