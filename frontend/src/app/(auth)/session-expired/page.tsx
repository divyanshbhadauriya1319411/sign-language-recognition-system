'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { Clock, Lock, ArrowRight, ShieldAlert, Home } from 'lucide-react';

function SessionExpiredContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/studio';
  const reason = searchParams.get('reason') || 'inactivity';

  const loginUrl = `/login?redirect=${encodeURIComponent(redirectTarget)}`;

  return (
    <Card variant="standard" className="p-6 sm:p-8 md:p-10 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
        <Clock className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Session Timeout
        </h1>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {reason === 'inactivity'
            ? 'For your protection and to prevent unauthorized access to webcam streams, your security session has expired due to 30 minutes of inactivity.'
            : 'Your cryptographic access token has expired. Please sign in again to re-authenticate with the server.'}
        </p>
      </div>

      <AlertBanner type="warning" title="Zero Data Loss Guarantee">
        Any unsaved sign translations or custom studio preferences are safely buffered in your local browser storage (`IndexedDB`) and will be immediately restored upon re-authentication.
      </AlertBanner>

      <div className="pt-2 space-y-3">
        <Link href={loginUrl} className="block w-full">
          <Button
            variant="gradient"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full font-bold min-h-[46px]"
          >
            Sign In &amp; Resume Studio
          </Button>
        </Link>

        <Link href="/" className="block w-full">
          <Button variant="outline" size="md" icon={<Home className="w-4 h-4" />} className="w-full">
            Return to Public Home
          </Button>
        </Link>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs font-mono text-slate-500">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span>Protected by SignBridge SOC 2 Session Governor</span>
      </div>
    </Card>
  );
}

export default function SessionExpiredPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading session details...</div>}>
      <SessionExpiredContent />
    </React.Suspense>
  );
}
