'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import authService from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Clock } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      setResendTimer(60);
    } catch (err: any) {
      // For security, even if backend returns 404/not found, we present a uniform success state
      // unless it's a rate limit error
      const backendMessage = err.response?.data?.detail;
      if (backendMessage === 'Rate limit exceeded') {
        setErrorMsg('You have requested too many recovery emails. Please wait 15 minutes before trying again.');
      } else {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        setResendTimer(60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !submittedEmail) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword(submittedEmail);
      setResendTimer(60);
    } catch {
      // Silent catch or timer reset
      setResendTimer(60);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
        {isSubmitted ? (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Check Your Inbox
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                If an account exists for <strong className="text-indigo-400 font-mono">{submittedEmail}</strong>, we have sent password reset instructions with a secure recovery link.
              </p>
            </div>

            <AlertBanner type="info" title="Security & Privacy Policy">
              To prevent unauthorized account enumeration, we display this confirmation regardless of whether the email address is currently registered in our database.
            </AlertBanner>

            <div className="pt-2 space-y-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleResend}
                disabled={resendTimer > 0 || isLoading}
                className="w-full font-semibold min-h-[44px]"
              >
                {resendTimer > 0 ? (
                  <span className="inline-flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4 animate-spin" />
                    Resend available in {resendTimer}s
                  </span>
                ) : (
                  'Resend Recovery Email'
                )}
              </Button>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enter the email address associated with your account and we will send you a secure, time-sensitive link to reset your password.
              </p>
            </div>

            {errorMsg && (
              <AlertBanner type="error" title="Request Failed">
                {errorMsg}
              </AlertBanner>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                disabled={isLoading}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full font-bold mt-2 min-h-[46px]"
                isLoading={isLoading}
              >
                Send Recovery Instructions
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded px-1 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </Card>
    </GuestGuard>
  );
}
