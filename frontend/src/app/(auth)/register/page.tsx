'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { setPreferences } from '@/store/slices/preferencesSlice';
import authService from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { OAuthButton, OAuthProvider } from '@/components/auth/OAuthButton';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    accept_terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms of Service & Privacy Policy' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please verify both fields.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccessEmail, setRegistrationSuccessEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { tokens, user } = await authService.register({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        preferred_language: 'en',
        accept_terms: data.accept_terms,
      });

      dispatch(
        setCredentials({
          user,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        })
      );

      if (user.profile?.accessibility_settings) {
        dispatch(setPreferences(user.profile.accessibility_settings));
      }

      // Display verification step card
      setRegistrationSuccessEmail(data.email);
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      setErrorMsg(
        backendMessage || 'Registration failed. This email address may already be associated with an account.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: OAuthProvider) => {
    setOauthLoading(provider);
    setErrorMsg(null);
    setTimeout(() => {
      setOauthLoading(null);
      setErrorMsg(`Account registration with ${provider.toUpperCase()} requires active enterprise federation keys.`);
    }, 1200);
  };

  return (
    <GuestGuard>
      <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
        {registrationSuccessEmail ? (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Account Created Successfully!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                We have dispatched an activation link to{' '}
                <strong className="text-emerald-400 font-mono">{registrationSuccessEmail}</strong>. Please check your inbox and click the verification link to unlock all pro features.
              </p>
            </div>

            <AlertBanner type="info" title="Verification Notice">
              You are currently logged in with provisional access. Some enterprise features will become available immediately once your email is confirmed.
            </AlertBanner>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/studio" className="w-full sm:w-auto">
                <Button variant="gradient" size="md" icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                  Proceed to AI Studio
                </Button>
              </Link>
              <Link href="/verify-email" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  Enter Verification Code
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1.5 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Join our inclusive community for real-time ISL recognition and translation.
              </p>
            </div>

            {errorMsg && (
              <AlertBanner type="error" title="Registration Error">
                {errorMsg}
              </AlertBanner>
            )}

            {/* OAuth Social Providers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['google', 'github', 'microsoft'] as OAuthProvider[]).map((prov) => (
                <OAuthButton
                  key={prov}
                  provider={prov}
                  onClick={() => handleOAuthRegister(prov)}
                  isLoading={oauthLoading === prov}
                  disabled={isLoading || (oauthLoading !== null && oauthLoading !== prov)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-800/80" />
              <span className="absolute bg-slate-900 px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Dr. Rajesh Kumar / Priya Sharma"
                icon={<UserIcon className="w-4 h-4" />}
                error={errors.full_name?.message}
                disabled={isLoading || oauthLoading !== null}
                {...register('full_name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                disabled={isLoading || oauthLoading !== null}
                {...register('email')}
              />

              {/* Password with Strength Meter & Toggle */}
              <div className="space-y-2">
                <label htmlFor="reg-password" className="block text-sm font-medium text-slate-200">
                  Create Password
                </label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    disabled={isLoading || oauthLoading !== null}
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

              {/* Confirm Password */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-200">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading || oauthLoading !== null}
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

              {/* Live Checklist */}
              {passwordValue.length > 0 && (
                <PasswordRequirements password={passwordValue} className="my-2" />
              )}

              {/* Terms Checkbox */}
              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-2.5">
                  <input
                    id="accept_terms"
                    type="checkbox"
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 mt-0.5 transition-colors cursor-pointer"
                    disabled={isLoading || oauthLoading !== null}
                    {...register('accept_terms')}
                  />
                  <label htmlFor="accept_terms" className="text-xs text-slate-300 leading-normal select-none cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                      Terms of Service
                    </Link>{' '}
                    and confirm that I have read the{' '}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                      Privacy Policy &amp; Zero-Video Guarantee
                    </Link>.
                  </label>
                </div>
                {errors.accept_terms && (
                  <p className="text-xs text-rose-400 pl-6 font-medium" role="alert">
                    {errors.accept_terms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full font-bold mt-4 min-h-[46px]"
                isLoading={isLoading}
                disabled={oauthLoading !== null}
              >
                Create Free Account
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded px-1"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </Card>
    </GuestGuard>
  );
}
