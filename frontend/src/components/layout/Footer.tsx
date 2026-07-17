'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Accessibility,
  Github,
  Twitter,
  Linkedin,
  Send,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

/**
 * Upgraded Global Footer featuring categorized links, newsletter subscription with state feedback,
 * language selector, accessibility assurance badge, and social handles.
 */
export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid work or personal email address.');
      return;
    }

    setStatus('loading');
    // Simulate newsletter API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 select-none" role="contentinfo">
      {/* Top Newsletter & Assurance Banner */}
      <div className="border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple">Stay Informed</Badge>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Monthly AI Dispatch</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Get research updates & new ISL gesture releases
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Join 15,000+ accessibility leaders, AI researchers, and educators receiving our monthly breakdown of MediaPipe landmark advancements and SignBridge features.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="flex-grow relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== 'idle') setStatus('idle');
                      }}
                      disabled={status === 'loading' || status === 'success'}
                      aria-label="Email address for newsletter subscription"
                      className="bg-slate-950 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500 h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    isLoading={status === 'loading'}
                    disabled={status === 'success'}
                    icon={<Send className="w-4 h-4" />}
                    className="h-12 px-6 shrink-0"
                  >
                    {status === 'success' ? 'Subscribed!' : 'Subscribe'}
                  </Button>
                </div>

                {/* State feedback */}
                {status === 'success' && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Thank you for subscribing! Check your inbox to confirm your subscription.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-xs font-medium text-rose-400 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <p className="text-caption text-slate-500">
                  By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-slate-300">Privacy Policy</Link>. No spam, unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Link Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        {/* Brand Summary Column (Spans 2 columns on lg) */}
        <div className="space-y-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-lg w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">SignBridge AI</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 pr-4">
            Bridging communication gaps for deaf and hard-of-hearing communities through real-time Indian Sign Language (ISL) recognition, 3D landmark tracking, and natural speech synthesis.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-indigo-400">
              <Accessibility className="w-3.5 h-3.5 text-indigo-400" />
              <span>WCAG 2.2 AA Compatible</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOC2 & ISO 27001 Ready</span>
            </div>
          </div>
        </div>

        {/* Column 1: Product */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/features" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Features Overview</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Pricing & Tiers</Link></li>
            <li><Link href="/studio" className="hover:text-emerald-400 text-emerald-500 font-medium transition-colors block min-h-[32px] flex items-center">Live Studio Demo</Link></li>
            <li><Link href="/features#dictionary" className="hover:text-white transition-colors block min-h-[32px] flex items-center">ISL Sign Dictionary</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors block min-h-[32px] flex items-center">User Dashboard</Link></li>
          </ul>
        </div>

        {/* Column 2: Resources */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/blog" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Research Blog</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Frequently Asked Questions</Link></li>
            <li><Link href="/accessibility" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Accessibility Statement</Link></li>
            <li><Link href="/features#learning" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Interactive Learning Center</Link></li>
            <li><a href="https://mediapipe.dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block min-h-[32px] flex items-center">MediaPipe Docs</a></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors block min-h-[32px] flex items-center">About Our Mission</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Contact & Support</Link></li>
            <li><Link href="/about#timeline" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Product Roadmap</Link></li>
            <li><Link href="/about#impact" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Community Impact</Link></li>
          </ul>
        </div>

        {/* Column 4: Legal & Security */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Governance</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Terms & Conditions</Link></li>
            <li><Link href="/accessibility" className="hover:text-white transition-colors block min-h-[32px] flex items-center">WCAG Compliance</Link></li>
            <li><Link href="/privacy#camera" className="hover:text-white transition-colors block min-h-[32px] flex items-center">Camera Data Security</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Social Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span>&copy; {new Date().getFullYear()} SignBridge AI Enterprise Platform. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US) &mdash; Indian Sign Language (ISL)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus-ring" aria-label="GitHub Repository">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus-ring" aria-label="Twitter / X handle">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus-ring" aria-label="LinkedIn Page">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
