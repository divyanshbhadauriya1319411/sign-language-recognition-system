'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthIllustration } from '@/components/auth/AuthIllustration';
import { Sparkles, Sun, Moon, Globe, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en-ISL');

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // Future integration with next-themes / dark class
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Top Header Controls (Logo, Theme Toggle, Language Selector, Back to Home) */}
      <header className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors focus-ring rounded-lg p-1"
            aria-label="SignBridge AI Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                SignBridge<span className="text-indigo-400">.ai</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider leading-tight">
                Authentication Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Controls: Theme Toggle & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1.5 transition-colors focus-ring min-h-[40px]"
              aria-label="Select interface language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedLang === 'en-ISL' ? 'English (`ISL`)' : 'Hindi (`ISL`)'}</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors focus-ring min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Return to Public Home */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors focus-ring min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </header>

      {/* Tablet Compact Security Banner (`Hidden on Desktop & Mobile below 640px`) */}
      <div className="hidden sm:block lg:hidden bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border-b border-indigo-500/20 py-2.5 px-6 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local WebAssembly &bull; Zero Video Retention &bull; TLS 1.3 Encryption at Rest</span>
        </div>
      </div>

      {/* Split-Screen Main Content Grid (`Desktop 5:7 split, Tablet/Mobile 1 col`) */}
      <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
        {/* Left Illustration Panel (`Desktop 5 cols, hidden on smaller screens`) */}
        <aside className="hidden lg:block lg:col-span-5 h-full relative">
          <AuthIllustration />
        </aside>

        {/* Right Form Panel (`Desktop 7 cols, Tablet/Mobile 12 cols`) */}
        <section className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-y-auto w-full">
          {/* Subtle Right Panel Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

          {/* Main Auth Form Container (`Max width 480px`) */}
          <div className="w-full max-w-md mx-auto relative z-10 py-6">
            {children}
          </div>
        </section>
      </main>

      {/* Minimalistic Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div>
          &copy; {new Date().getFullYear()} SignBridge Technologies Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link href="/accessibility" className="hover:text-slate-300 transition-colors">Accessibility AA</Link>
        </div>
      </footer>
    </div>
  );
}
