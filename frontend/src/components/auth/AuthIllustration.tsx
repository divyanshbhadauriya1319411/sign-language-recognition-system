'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Sparkles, Heart, CheckCircle2, Cpu, Lock } from 'lucide-react';

/**
 * AuthIllustration (`AuthIllustration`)
 * Split-screen visual panel displaying MediaPipe 3D accessibility graphics, trust compliance badges,
 * and social proof testimonials for desktop/tablet authentication layouts.
 */
export const AuthIllustration: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border-r border-slate-800/80 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Label */}
      <div className="relative z-10 flex items-center justify-between">
        <Badge variant="purple" size="sm" className="shadow-lg">
          <Sparkles className="w-3 h-3 mr-1" />
          Neural 3D Spatial Recognition
        </Badge>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          TLS 1.3 / AES-256
        </span>
      </div>

      {/* Center Accessibility Illustration Graphic */}
      <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
        {/* Mock 3D MediaPipe Skeleton Preview Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Edge WebRTC &bull; T=30 Sliding Buffer
              </span>
            </div>
            <Badge variant="success" size="sm">98.4% Confidence</Badge>
          </div>

          <div className="h-44 rounded-xl bg-slate-950 border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
            {/* Animated Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            
            <div className="text-center space-y-2 relative z-10 p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                Normalized Landmark Extraction
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                21 hand joints &times; 3D spatial axes processed strictly in your local browser sandbox.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Video Retention</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WCAG 2.2 AA Verified</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Bridging Communication Across India &amp; Beyond
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our cloud-native platform converts real-time Indian Sign Language (`ISL`) into accurate natural language text and speech, empowering deaf and hard-of-hearing educators, students, and professionals.
          </p>
        </div>
      </div>

      {/* Bottom Compliance & Testimonial Footer */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            HIPAA &amp; FERPA BAA Ready
          </span>
          <span>&bull;</span>
          <span>India DPDP Act 2023 Compliant</span>
          <span>&bull;</span>
          <span>SOC 2 Type II Audited</span>
        </div>
      </div>
    </div>
  );
};

export default AuthIllustration;
