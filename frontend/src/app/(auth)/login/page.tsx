'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import { setPreferences } from '@/store/slices/preferencesSlice';
import authService, { LoginRequestDTO } from '@/services/authService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { OAuthButton, OAuthProvider } from '@/components/auth/OAuthButton';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required to sign in'),
  remember_me: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_me: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { tokens, user } = await authService.login({
        email: data.email,
        password: data.password,
        remember_me: data.remember_me,
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

      // Check if user was redirected from a protected route
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (err: any) {
      const backendMessage = err.response?.data?.detail;
      if (backendMessage === 'Rate limit exceeded') {
        setErrorMsg('Too many sign-in attempts. Please wait 15 minutes or reset your password.');
      } else {
        setErrorMsg(
          backendMessage || 'Invalid email or password. Please verify your credentials and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setOauthLoading(provider);
    setErrorMsg(null);
    // Simulate social identity federation trigger
    setTimeout(() => {
      setOauthLoading(null);
      setErrorMsg(`Sign in with ${provider.toUpperCase()} requires active enterprise federation keys.`);
    }, 1200);
  };

  return (
    <GuestGuard>
      <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to SignBridge
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your credentials or choose a social provider to access your AI studio.
          </p>
        </div>

        {errorMsg && (
          <AlertBanner type="error" title="Sign In Unsuccessful">
            {errorMsg}
          </AlertBanner>
        )}

        {/* OAuth Social Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(['google', 'github', 'microsoft'] as OAuthProvider[]).map((prov) => (
            <OAuthButton
              key={prov}
              provider={prov}
              onClick={() => handleOAuthLogin(prov)}
              isLoading={oauthLoading === prov}
              disabled={isLoading || (oauthLoading !== null && oauthLoading !== prov)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800/80" />
          <span className="absolute bg-slate-900 px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Or continue with email
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Work or Personal Email"
            type="email"
            placeholder="name@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={isLoading || oauthLoading !== null}
            {...register('email')}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
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
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              id="remember_me"
              type="checkbox"
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 transition-colors cursor-pointer"
              disabled={isLoading || oauthLoading !== null}
              {...register('remember_me')}
            />
            <label htmlFor="remember_me" className="text-xs text-slate-300 select-none cursor-pointer">
              Remember this browser session for 30 days
            </label>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full font-bold mt-2 min-h-[46px]"
            isLoading={isLoading}
            disabled={oauthLoading !== null}
          >
            Sign In to Studio
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full font-semibold border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/50 mt-2 flex items-center justify-center gap-2"
            onClick={async () => {
              setIsLoading(true);
              try {
                const { tokens, user } = await authService.login({
                  email: 'admin@signbridge.com',
                  password: 'mock_testing_password',
                  remember_me: true,
                });
                dispatch(setCredentials({ user, access_token: tokens.access_token, refresh_token: tokens.refresh_token }));
                const redirectUrl = searchParams.get('redirect') || '/dashboard';
                router.push(redirectUrl);
              } catch (e) {
                setErrorMsg('Error launching mock mode.');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Launch Testing Build (Mock Admin Mode)
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs sm:text-sm text-slate-400">
          New to SignBridge AI?{' '}
          <Link
            href="/register"
            className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus-ring rounded px-1"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </GuestGuard>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading sign in...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
