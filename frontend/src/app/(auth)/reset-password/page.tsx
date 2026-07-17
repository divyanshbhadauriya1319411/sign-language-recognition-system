'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import authService from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please verify both fields.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(!token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setIsTokenExpired(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      if (
        backendMessage?.toLowerCase().includes('expired') ||
        backendMessage?.toLowerCase().includes('invalid')
      ) {
        setIsTokenExpired(true);
      } else {
        setErrorMsg(backendMessage || 'Failed to update password. Please try again or request a new recovery link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
        {isTokenExpired ? (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Recovery Link Expired
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                For your security, password reset links expire after 30 minutes and can only be used once. This link is no longer valid.
              </p>
            </div>

            <AlertBanner type="warning" title="Token Verification Failed">
              If you did not request this reset or require access to your studio, please request a fresh security token below.
            </AlertBanner>

            <div className="pt-2 space-y-3">
              <Link href="/forgot-password" className="block w-full">
                <Button variant="gradient" size="lg" className="w-full font-bold min-h-[46px]">
                  Request New Recovery Link
                </Button>
              </Link>
              <Link href="/login" className="block w-full">
                <Button variant="outline" size="md" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Password Successfully Updated
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your new security credentials have been stored with AES-256 PBKDF2 hashing. All previous sessions across active browsers have been invalidated.
              </p>
            </div>

            <AlertBanner type="success" title="Security Confirmation">
              You may now sign in using your updated password to resume real-time sign language recognition.
            </AlertBanner>

            <div className="pt-2">
              <Link href="/login" className="block w-full">
                <Button variant="gradient" size="lg" icon={<ArrowRight className="w-4 h-4" />} className="w-full font-bold min-h-[46px]">
                  Sign In with New Password
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Set New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose a strong, unique password to secure your Indian Sign Language studio profile.
              </p>
            </div>

            {errorMsg && (
              <AlertBanner type="error" title="Update Unsuccessful">
                {errorMsg}
              </AlertBanner>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="reset-password" className="block text-sm font-medium text-slate-200">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-1 rounded focus-ring"
                    aria-label={showPassword ? 'Hide password characters' : 'Show password characters'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <PasswordStrengthMeter password={passwordValue} className="pt-1" />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="reset-confirm" className="block text-sm font-medium text-slate-200">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="reset-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors p-1 rounded focus-ring"
                    aria-label={showConfirmPassword ? 'Hide password characters' : 'Show password characters'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checklist */}
              {passwordValue.length > 0 && (
                <PasswordRequirements password={passwordValue} className="my-2" />
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full font-bold mt-4 min-h-[46px]"
                isLoading={isLoading}
              >
                Reset Password &amp; Secure Account
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              Remembered your existing password?{' '}
              <Link
                href="/login"
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded px-1"
              >
                Cancel &amp; Sign In
              </Link>
            </div>
          </>
        )}
      </Card>
    </GuestGuard>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading reset password...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
