'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/utility/Accordion';
import { ConfidenceScoreIndicator } from '@/components/ai/ConfidenceScoreIndicator';
import { RealTimeStatusIndicator } from '@/components/ai/RealTimeStatusIndicator';
import { SpeechOutputCard } from '@/components/ai/SpeechOutputCard';
import { FeatureCard } from '@/components/cards/FeatureCard';
import {
  Sparkles,
  Camera,
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Heart,
  BookOpen,
  Activity,
  Layers,
  LogOut,
  LayoutDashboard,
  Shield,
  History as HistoryIcon,
  Cpu,
  Database,
  Globe,
  Lock,
  Volume2,
  RefreshCw,
  Terminal,
  Server,
  Award,
  HelpCircle,
  Building2,
  GraduationCap,
  Stethoscope,
  Smile,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

/**
 * Public Marketing Landing Page (`/`)
 * Consists of 14 high-conversion, accessible, and responsive sections
 * built with our design system, Framer Motion transitions, and interactive AI demos.
 */
export default function LandingPage() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeTabWorkflow, setActiveTabWorkflow] = useState(0);

  // FAQ Preview items
  const faqPreviewItems = [
    {
      id: 'faq-1',
      title: 'What is SignBridge AI and how does it recognize Indian Sign Language?',
      content: (
        <p className="text-slate-300 leading-relaxed">
          SignBridge AI is an enterprise-grade accessibility platform that uses a webcam to capture 3D hand and facial spatial coordinates via MediaPipe (`x, y, z, visibility`). Our temporal PyTorch Bi-LSTM / TCN neural network evaluates sliding windows (`T=30` frames) to accurately classify Indian Sign Language (ISL) gestures in real-time (under 45ms latency) and converts them to text and natural speech.
        </p>
      ),
    },
    {
      id: 'faq-2',
      title: 'Do I need special gloves, depth cameras, or high-end GPU hardware?',
      content: (
        <p className="text-slate-300 leading-relaxed">
          No special hardware required! SignBridge AI works directly in standard web browsers using any built-in laptop or USB webcam (`720p` or `1080p`). All spatial normalization and feature extraction (`126-dimensional invariance vector`) happens locally or via our low-latency cloud engine.
        </p>
      ),
    },
    {
      id: 'faq-3',
      title: 'Is my raw video stream recorded, stored, or shared with third parties?',
      content: (
        <p className="text-slate-300 leading-relaxed">
          <strong>Privacy first:</strong> We never record, store, or transmit raw video frames. Only anonymized numerical 3D landmark coordinates (`126 float values per frame`) are processed in memory to compute predictions. Once the translation is produced, the coordinates are immediately discarded from memory in accordance with SOC2 and GDPR guidelines.
        </p>
      ),
    },
    {
      id: 'faq-4',
      title: 'Can SignBridge AI be integrated into hospital or university communication systems?',
      content: (
        <p className="text-slate-300 leading-relaxed">
          Yes! Our Enterprise tier provides secure REST APIs (`/api/v1`) and low-latency WebSocket endpoints (`/ai/v1/stream`) with custom vocabulary tuning, on-premise Kubernetes container deployment (`k8s`), and HIPAA/FERPA compliance assistance for hospitals, schools, and customer service centers.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden border-b border-slate-800/80">
        {/* Background Gradients & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase select-none">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Next-Gen Indian Sign Language (ISL) Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Breaking Silence. <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Building Bridges with AI.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Experience real-time Indian Sign Language recognition, 3D hand tracking, and instant speech synthesis inside your browser. Designed for deaf and hard-of-hearing individuals, universities, healthcare centers, and modern workplaces.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                <Link href="/studio">
                  <Button variant="gradient" size="lg" icon={<Camera className="w-5 h-5" />} className="w-full sm:w-auto shadow-indigo-500/25">
                    Launch Live Studio
                  </Button>
                </Link>
                <a href="#demo">
                  <Button variant="outline" size="lg" icon={<Play className="w-4 h-4 fill-current" />} className="w-full sm:w-auto">
                    Watch Interactive Demo
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg">
                <div className="space-y-0.5">
                  <div className="text-h4 font-bold text-white font-mono">99.4%</div>
                  <div className="text-caption text-slate-400">Target Accuracy</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-h4 font-bold text-emerald-400 font-mono">&lt;45ms</div>
                  <div className="text-caption text-slate-400">Stream Latency</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-h4 font-bold text-purple-400 font-mono">WCAG AA</div>
                  <div className="text-caption text-slate-400">Accessible UI</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual / Live Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              {/* Floating Glassmorphic Container */}
              <div className="relative rounded-2xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-2xl p-5 shadow-2xl space-y-4">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                      LIVE MEDIA STREAM #ISL-309
                    </span>
                  </div>
                  <Badge variant="success" size="sm">Active 60 FPS</Badge>
                </div>

                {/* Camera Viewport Simulation */}
                <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
                  {/* Simulated video frame background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950" />

                  {/* Simulated 3D Hand Landmarks */}
                  <svg className="w-48 h-48 sm:w-60 sm:h-60 relative z-10" viewBox="0 0 200 200">
                    {/* Palm connections */}
                    <line x1="100" y1="150" x2="70" y2="110" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
                    <line x1="100" y1="150" x2="130" y2="110" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
                    <line x1="70" y1="110" x2="130" y2="110" stroke="#10b981" strokeWidth="2.5" />
                    {/* Fingers */}
                    <line x1="70" y1="110" x2="55" y2="60" stroke="#6366f1" strokeWidth="3" />
                    <line x1="85" y1="110" x2="85" y2="45" stroke="#6366f1" strokeWidth="3" />
                    <line x1="100" y1="110" x2="105" y2="40" stroke="#6366f1" strokeWidth="3" />
                    <line x1="115" y1="110" x2="125" y2="50" stroke="#6366f1" strokeWidth="3" />
                    <line x1="130" y1="110" x2="150" y2="75" stroke="#6366f1" strokeWidth="3" />
                    {/* Landmark Nodes */}
                    <circle cx="100" cy="150" r="5" fill="#10b981" />
                    <circle cx="70" cy="110" r="4" fill="#10b981" />
                    <circle cx="130" cy="110" r="4" fill="#10b981" />
                    <circle cx="55" cy="60" r="4.5" fill="#f43f5e" />
                    <circle cx="85" cy="45" r="4.5" fill="#f43f5e" />
                    <circle cx="105" cy="40" r="4.5" fill="#f43f5e" />
                    <circle cx="125" cy="50" r="4.5" fill="#f43f5e" />
                    <circle cx="150" cy="75" r="4.5" fill="#f43f5e" />
                  </svg>

                  {/* Floating Prediction Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-indigo-500/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-mono font-bold text-white truncate">Recognized: "NAMASTE"</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">99.8%</span>
                  </div>
                </div>

                {/* Floating Translation Card */}
                <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Synthesized Audio Output</span>
                    <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-white italic">
                    "Namaste! Welcome to SignBridge AI accessibility platform."
                  </p>
                </div>
              </div>

              {/* Floating badge outside card */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">
                  Bi-LSTM
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Temporal T=30 Sequence</div>
                  <div className="text-[11px] text-slate-400">Zero-flicker debounced output</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT DEMO SECTION */}
      <section id="demo" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <Badge variant="info" size="md">Interactive Video Demo</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              See SignBridge AI in Action
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              Watch how our spatial 3D MediaPipe pipeline converts fluent Indian Sign Language gestures into crystal-clear synthesized voice inside 45 milliseconds.
            </p>
          </div>

          {/* Video Placeholder Container */}
          <div className="relative aspect-video rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl group flex flex-col justify-between p-6 sm:p-10 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Top Bar of demo */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  signbridge-isl-studio-v2.0.mp4
                </span>
              </div>
              <Badge variant="accent">HD 60FPS Stream</Badge>
            </div>

            {/* Center Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
              {!isPlayingDemo ? (
                <button
                  type="button"
                  onClick={() => setIsPlayingDemo(true)}
                  aria-label="Play product demonstration video"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 focus-ring"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                </button>
              ) : (
                <div className="space-y-4 text-center max-w-md animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs">
                    <Activity className="w-4 h-4 animate-spin" /> Playing Interactive Demonstration...
                  </div>
                  <p className="text-sm text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                    [00:02] &bull; User presents ISL gesture "WHERE HOSPITAL?" <br />
                    [00:03] &bull; 3D landmarks extracted across T=30 frames <br />
                    [00:04] &bull; Bi-LSTM emits confidence 99.4% &mdash; Audio generated!
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setIsPlayingDemo(false)}>
                    Reset Demo Simulation
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Transcript Bar */}
            <div className="relative z-10 border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 truncate">
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Active Transcript: "We are committed to building accessible technology for India."</span>
              </div>
              <Link href="/studio">
                <span className="text-indigo-400 hover:underline font-bold inline-flex items-center gap-1 shrink-0">
                  Try it yourself <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/studio">
              <Button variant="gradient" size="lg" icon={<Camera className="w-5 h-5" />}>
                Launch Live Translation Studio Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. LIVE WEBCAM PREVIEW MOCKUP SECTION */}
      <section id="mockup" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="purple" size="md">User Experience</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calm, Distraction-Free AI Interface
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Designed with high-contrast typography, customizable speech output, and real-time visual feedback so every user can communicate with total confidence.
            </p>
          </div>

          {/* Interactive Mockup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Camera viewport & prediction output */}
            <div className="lg:col-span-8 space-y-6">
              <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Live ISL Recognition Studio</h3>
                  </div>
                  <RealTimeStatusIndicator status="connected" customText="Active 60 FPS" />
                </div>

                {/* Simulated Main Frame */}
                <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MediaPipe Hands: 2 Tracked
                  </div>

                  <svg className="w-40 h-40 opacity-70 my-auto" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                    <circle cx="50" cy="50" r="28" fill="#4f46e5" fillOpacity="0.15" />
                    <polygon points="50,25 70,65 30,65" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
                  </svg>

                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">Recognized Sentence</div>
                      <div className="text-lg font-bold text-white font-mono">"PLEASE CALL MEDICAL EMERGENCY"</div>
                    </div>
                    <div className="shrink-0 w-full sm:w-44">
                      <ConfidenceScoreIndicator confidence={0.992} showLabel />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Speech Controls & Diagnostics panel */}
            <div className="lg:col-span-4 space-y-6">
              <SpeechOutputCard
                text="Please call medical emergency immediately."
                isPlaying={false}
                selectedVoice="neural-en-in"
                speed={1.0}
                onTogglePlay={() => {}}
              />

              <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" /> Pipeline Diagnostics
                </h4>
                <div className="space-y-3 text-xs font-mono text-slate-400 divide-y divide-slate-800/80">
                  <div className="flex justify-between pt-2">
                    <span>Spatial Feature Vector:</span>
                    <span className="text-white font-bold">126 dimensions</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Sliding Window Size:</span>
                    <span className="text-white font-bold">T=30 frames</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Consecutive Debounce:</span>
                    <span className="text-emerald-400 font-bold">Passed (3/3)</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Backend Storage Driver:</span>
                    <span className="text-purple-400 font-bold">MongoDB 7.0 Motor</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI DETECTION FLOW ANIMATION SECTION */}
      <section id="workflow" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="primary" size="md">Architecture & Flow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Our AI Pipeline Processes Gestures
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              A 6-stage end-to-end spatial and temporal execution flow built for enterprise reliability and ultra-low latency.
            </p>
          </div>

          {/* 6-Stage Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Camera Frame Capture',
                desc: 'Captures raw webcam feed at 60 FPS directly inside the browser using standard WebRTC APIs.',
                icon: Camera,
                color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
              },
              {
                step: '02',
                title: 'MediaPipe 3D Tracking',
                desc: 'Extracts 21 3D landmarks per hand plus facial and pose anchors with visibility confidence scores.',
                icon: Layers,
                color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
              },
              {
                step: '03',
                title: 'Spatial Normalization',
                desc: 'Translates wrist coordinates to origin (0,0,0) and scales distances relative to palm size for scale invariance.',
                icon: RefreshCw,
                color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
              },
              {
                step: '04',
                title: 'Temporal Circular Buffer',
                desc: 'Maintains a sliding window of T=30 consecutive frames in memory to capture dynamic movement over time.',
                icon: Cpu,
                color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
              },
              {
                step: '05',
                title: 'PyTorch Bi-LSTM Evaluation',
                desc: 'Deep bidirectional recurrent sequence evaluator maps temporal patterns to our 57-class ISL vocabulary.',
                icon: Zap,
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
              },
              {
                step: '06',
                title: 'Debounce & Speech Output',
                desc: 'Requires 3 consecutive matching frames to eliminate flicker before firing high-fidelity neural speech synthesis.',
                icon: Volume2,
                color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-all duration-200 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                      STAGE {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SECTION */}
      <section id="benefits" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="success" size="md">Transformative Impact</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Organizations Choose SignBridge AI
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Empowering communication across workplaces, educational institutions, emergency services, and everyday interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Faster Communication',
                desc: 'Eliminates delays by converting sign language into text and natural voice instantaneously during meetings or calls.',
                icon: Zap,
              },
              {
                title: 'Improved Accessibility',
                desc: 'Enforces WCAG 2.2 AA standards with visible focus rings, high-contrast modes, and screen reader announcements.',
                icon: Heart,
              },
              {
                title: 'Real-Time Recognition',
                desc: 'Maintains under 45ms end-to-end latency via optimized WebSockets and asynchronous PyTorch worker pools.',
                icon: Activity,
              },
              {
                title: 'Inclusive Workplaces',
                desc: 'Helps enterprises meet DEI (Diversity, Equity, and Inclusion) benchmarks by bridging internal communication barriers.',
                icon: Building2,
              },
              {
                title: 'Educational Curriculum',
                desc: 'Features an interactive learning center where students and teachers can practice ISL with immediate AI scoring feedback.',
                icon: GraduationCap,
              },
              {
                title: 'Healthcare & Emergency Support',
                desc: 'Provides critical diagnostic phrase recognition (`EMERGENCY`, `PAIN`, `ALLERGY`, `DOCTOR`) for triage and hospital staff.',
                icon: Stethoscope,
              },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} variant="interactive" className="p-6 space-y-4 bg-slate-900/40 border-slate-800/80">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-h5 font-bold text-white">{benefit.title}</h3>
                  <p className="text-small text-slate-400 leading-relaxed">{benefit.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="accent" size="md">Simple 5-Step Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get Started in Less Than 60 Seconds
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              No complex installations or specialized calibration required. Start translating from any standard browser.
            </p>
          </div>

          {/* Interactive Step Selector */}
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                '1. Enable Camera',
                '2. Capture Hand Gestures',
                '3. AI Recognizes Signs',
                '4. Text Translation',
                '5. Speech Synthesis',
              ].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTabWorkflow(idx)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px] focus-ring ${
                    activeTabWorkflow === idx
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active Step Card */}
            <div className="max-w-3xl mx-auto rounded-2xl border border-indigo-500/30 bg-slate-900 p-8 sm:p-12 shadow-2xl text-left space-y-6">
              {[
                {
                  title: 'Step 1: Enable Webcam Permissions',
                  desc: 'Click "Launch Studio" and authorize your browser to access the webcam. All processing happens locally or in ephemeral secure memory sessions. We never record or save your personal video feed.',
                  icon: Camera,
                  badge: 'Zero Installation',
                },
                {
                  title: 'Step 2: Present Your Hands in Viewport',
                  desc: 'Position your hands inside the glowing MediaPipe canvas. The system automatically tracks 42 3D coordinates (`x, y, z`) across both left and right hands with high-precision skeletal overlays.',
                  icon: Layers,
                  badge: 'MediaPipe 3D',
                },
                {
                  title: 'Step 3: Temporal Sequence Classification',
                  desc: 'As you perform the sign, our circular buffer collects a 30-frame temporal window. The PyTorch Bi-LSTM neural network evaluates the trajectory and computes probability scores across the ISL dictionary.',
                  icon: Zap,
                  badge: 'PyTorch Bi-LSTM',
                },
                {
                  title: 'Step 4: Instant Text Translation',
                  desc: 'Once the top prediction exceeds our confidence threshold (`>85%`) and passes debounce checks (`3 consecutive frames`), the recognized gesture is immediately appended to your natural translation transcript.',
                  icon: BookOpen,
                  badge: 'Debounced Output',
                },
                {
                  title: 'Step 5: High-Fidelity Speech Synthesis',
                  desc: 'The translated text is automatically spoken aloud using neural voices (`Edge TTS` or `Azure Speech`). You can adjust speaking speed (`0.5x - 2.0x`), choose voice genders, or mute audio at any time.',
                  icon: Volume2,
                  badge: 'Multi-Vendor TTS',
                },
              ][activeTabWorkflow] && (() => {
                const stepObj = [
                  {
                    title: 'Step 1: Enable Webcam Permissions',
                    desc: 'Click "Launch Studio" and authorize your browser to access the webcam. All processing happens locally or in ephemeral secure memory sessions. We never record or save your personal video feed.',
                    icon: Camera,
                    badge: 'Zero Installation',
                  },
                  {
                    title: 'Step 2: Present Your Hands in Viewport',
                    desc: 'Position your hands inside the glowing MediaPipe canvas. The system automatically tracks 42 3D coordinates (`x, y, z`) across both left and right hands with high-precision skeletal overlays.',
                    icon: Layers,
                    badge: 'MediaPipe 3D',
                  },
                  {
                    title: 'Step 3: Temporal Sequence Classification',
                    desc: 'As you perform the sign, our circular buffer collects a 30-frame temporal window. The PyTorch Bi-LSTM neural network evaluates the trajectory and computes probability scores across the ISL dictionary.',
                    icon: Zap,
                    badge: 'PyTorch Bi-LSTM',
                  },
                  {
                    title: 'Step 4: Instant Text Translation',
                    desc: 'Once the top prediction exceeds our confidence threshold (`>85%`) and passes debounce checks (`3 consecutive frames`), the recognized gesture is immediately appended to your natural translation transcript.',
                    icon: BookOpen,
                    badge: 'Debounced Output',
                  },
                  {
                    title: 'Step 5: High-Fidelity Speech Synthesis',
                    desc: 'The translated text is automatically spoken aloud using neural voices (`Edge TTS` or `Azure Speech`). You can adjust speaking speed (`0.5x - 2.0x`), choose voice genders, or mute audio at any time.',
                    icon: Volume2,
                    badge: 'Multi-Vendor TTS',
                  },
                ][activeTabWorkflow];
                const Icon = stepObj.icon;
                return (
                  <motion.div
                    key={activeTabWorkflow}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" size="md">{stepObj.badge}</Badge>
                      <span className="font-mono text-sm font-bold text-slate-500">STEP {activeTabWorkflow + 1} OF 5</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">{stepObj.title}</h3>
                    </div>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">{stepObj.desc}</p>
                  </motion.div>
                );
              })()}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={activeTabWorkflow === 0}
                  onClick={() => setActiveTabWorkflow(Math.max(0, activeTabWorkflow - 1))}
                >
                  Previous Step
                </Button>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === activeTabWorkflow ? 'bg-indigo-500' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={activeTabWorkflow === 4}
                  onClick={() => setActiveTabWorkflow(Math.min(4, activeTabWorkflow + 1))}
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES GRID SECTION */}
      <section id="features-grid" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="info" size="md">Platform Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise-Grade Feature Suite
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Explore the comprehensive toolkit built to support real-time translation, user governance, and ISL education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Real-Time Recognition"
              description="Low-latency WebSocket streaming captures and decodes hand trajectories at 60 FPS without frame dropping."
              icon={<Camera className="w-6 h-6" />}
              badgeText="Core Engine"
            />
            <FeatureCard
              title="AI Translation Transcript"
              description="Constructs grammatically coherent English sentences from continuous gesture sequences with confidence ratings."
              icon={<BookOpen className="w-6 h-6" />}
              badgeText="NLP"
            />
            <FeatureCard
              title="Natural Speech Synthesis"
              description="Converts translated text into natural audio using Edge Neural and Azure voices with customizable speaking rates."
              icon={<Volume2 className="w-6 h-6" />}
              badgeText="Audio"
            />
            <FeatureCard
              title="Translation History"
              description="Automatically logs all completed recognition sessions into your secure MongoDB database with timestamp exports."
              icon={<HistoryIcon className="w-6 h-6" />}
              badgeText="Storage"
            />
            <FeatureCard
              title="Interactive Learning Center"
              description="Practice daily ISL vocabulary lessons with instant real-time AI scoring and skeletal pose alignment feedback."
              icon={<GraduationCap className="w-6 h-6" />}
              badgeText="Education"
            />
            <FeatureCard
              title="ISL Sign Dictionary"
              description="Browse over 500+ standard Indian Sign Language gestures with video demonstrations and 3D coordinate vectors."
              icon={<Layers className="w-6 h-6" />}
              badgeText="Reference"
            />
            <FeatureCard
              title="Enterprise Analytics"
              description="Monitor system telemetry, recognition accuracy histograms, and latency metrics via Prometheus & Grafana."
              icon={<Activity className="w-6 h-6" />}
              badgeText="Observability"
            />
            <FeatureCard
              title="WCAG 2.2 AA Accessible"
              description="Enforces 44x44px touch targets, high-contrast visible focus rings, and full screen-reader accessibility."
              icon={<Heart className="w-6 h-6" />}
              badgeText="Inclusion"
            />
          </div>

          <div className="text-center pt-4">
            <Link href="/features">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Explore All Features in Detail
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TECHNOLOGY STACK SECTION */}
      <section id="tech-stack" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <Badge variant="purple" size="md">Engineering Stack</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powered by Modern, Scalable Technologies
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Our cloud-native stack combines state-of-the-art computer vision libraries with robust asynchronous microservices.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { name: 'React 19 / Next.js', role: 'Frontend UI', icon: Globe, color: 'border-cyan-500/30 text-cyan-400' },
              { name: 'FastAPI Gateway', role: 'Async Orchestrator', icon: Zap, color: 'border-emerald-500/30 text-emerald-400' },
              { name: 'MediaPipe 3D', role: 'Hand Tracking', icon: Layers, color: 'border-indigo-500/30 text-indigo-400' },
              { name: 'PyTorch Bi-LSTM', role: 'Temporal AI Model', icon: Cpu, color: 'border-purple-500/30 text-purple-400' },
              { name: 'MongoDB 7.0', role: 'Enterprise Database', icon: Database, color: 'border-amber-500/30 text-amber-400' },
              { name: 'Docker & K8s', role: 'Container Engine', icon: Server, color: 'border-blue-500/30 text-blue-400' },
              { name: 'WebSockets', role: 'Low-Latency Stream', icon: Activity, color: 'border-rose-500/30 text-rose-400' },
            ].map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className={`rounded-xl border bg-slate-900/60 p-5 flex flex-col items-center justify-center gap-2 text-center select-none ${tech.color}`}
                >
                  <Icon className="w-8 h-8" />
                  <div className="text-sm font-bold text-white mt-1">{tech.name}</div>
                  <div className="text-caption text-slate-400">{tech.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. STATISTICS SECTION */}
      <section id="statistics" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="primary" size="md">Performance Benchmarks</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Illustrative System Metrics & SLAs
            </h2>
            <p className="text-sm text-slate-400">
              *Note: The statistics below illustrate target benchmarks and production SLA guarantees across our distributed Kubernetes cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '99.4%', label: 'Target Recognition Accuracy', desc: 'Tested across our 57-class temporal benchmark dataset under standard lighting.' },
              { value: '500+', label: 'Supported ISL Gestures', desc: 'Covering essential medical, educational, and daily conversational vocabulary.' },
              { value: '<45ms', label: 'Average Response Time', desc: 'End-to-end WebSocket landmark extraction and sequence prediction latency.' },
              { value: '10,000+', label: 'Concurrent Users Supported', desc: 'Horizontally scalable via Kubernetes HPA and asynchronous Python worker pods.' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 text-left">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <p className="text-caption text-slate-400 leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="accent" size="md">Community & Enterprise Trust</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Accessibility Leaders
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              See what researchers, educators, and enterprise partners have to say about deploying SignBridge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: 'SignBridge AI reduced our emergency room communication barrier significantly. Medical triage staff can now understand ISL diagnostic signs instantly.',
                name: 'Dr. Rajesh Sharma',
                role: 'Chief Medical Officer',
                org: 'AIIMS Medical Center',
                avatar: 'RS',
              },
              {
                quote: 'The 3D MediaPipe landmark tracking is extraordinarily robust. Even under fluctuating classroom lighting, our students receive instant feedback on their gestures.',
                name: 'Priya Mukherjee',
                role: 'Senior Accessibility Director',
                org: 'Delhi University Disability Cell',
                avatar: 'PM',
              },
              {
                quote: 'As a software company committed to DEI, integrating SignBridge AI into our internal video meetings allowed our deaf engineers to participate seamlessly.',
                name: 'Vikramaditya Rao',
                role: 'VP of Engineering & DEI',
                org: 'TechCorp India Enterprise',
                avatar: 'VR',
              },
            ].map((t) => (
              <Card key={t.name} variant="standard" className="p-6 flex flex-col justify-between space-y-6 bg-slate-900/60 border-slate-800">
                <p className="text-sm text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{t.name}</div>
                    <div className="text-caption text-slate-400 truncate">{t.role} &bull; {t.org}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 11. PRICING PREVIEW SECTION */}
      <section id="pricing-preview" className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="purple" size="md">Transparent Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Plans for Every Community & Organization
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Start free today for personal communication. Upgrade to Pro or Enterprise for custom vocabularies and API integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {[
              {
                tier: 'Free Personal',
                price: '$0',
                period: 'forever',
                desc: 'Ideal for individuals practicing Indian Sign Language or communicating at home.',
                features: ['Unlimited basic ISL recognition', 'Standard 57-gesture vocabulary', 'Webcam browser access', 'Community forum support'],
                cta: 'Start Free Today',
                href: '/register',
                highlight: false,
              },
              {
                tier: 'Pro Educator',
                price: '$29',
                period: 'per month',
                desc: 'Perfect for teachers, interpreters, and accessibility professionals needing history and TTS.',
                features: ['Everything in Free', 'Unlimited translation history logs', 'High-fidelity Azure & Edge Neural TTS', 'Interactive learning practice scoring', 'Priority email & chat support'],
                cta: 'Start 14-Day Pro Trial',
                href: '/register?plan=pro',
                highlight: true,
              },
              {
                tier: 'Enterprise SaaS',
                price: 'Custom',
                period: 'annual billing',
                desc: 'Tailored for hospitals, universities, and corporations requiring custom models and SLAs.',
                features: ['Everything in Pro', 'Custom domain gesture vocabulary training', 'REST API & WebSocket SDK access', 'On-premise Kubernetes container support', '99.9% uptime SLA & dedicated account rep'],
                cta: 'Contact Enterprise Sales',
                href: '/contact',
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.tier}
                className={`rounded-2xl border p-8 flex flex-col justify-between space-y-6 relative transition-all duration-200 ${
                  p.highlight
                    ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/60 shadow-2xl shadow-indigo-500/10 scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="space-y-4">
                  <div className="text-lg font-bold text-white">{p.tier}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">{p.price}</span>
                    <span className="text-caption text-slate-400">/{p.period}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                  <ul className="space-y-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <Link href={p.href}>
                    <Button variant={p.highlight ? 'gradient' : 'outline'} fullWidth size="lg">
                      {p.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link href="/pricing" className="text-sm font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1">
              Compare all features and detailed tier breakdowns <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 12. FAQ PREVIEW SECTION */}
      <section id="faq-preview" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="info" size="md">Got Questions?</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Everything you need to know about our MediaPipe hand tracking, privacy guarantees, and system setup.
            </p>
          </div>

          <Accordion items={faqPreviewItems} className="bg-slate-900/80 border-slate-800" />

          <div className="text-center pt-2">
            <Link href="/faq">
              <Button variant="outline" size="md" icon={<HelpCircle className="w-4 h-4" />}>
                View Complete FAQ & Knowledge Base
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 13. NEWSLETTER BANNER SECTION */}
      <section id="newsletter" className="py-20 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <Badge variant="purple" size="md">Stay Ahead</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              Join Our Accessibility Research & Product Dispatch
            </h2>
            <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Subscribe to receive updates on new ISL gesture models, MediaPipe landmark enhancements, and inclusive design webinars.
            </p>

            <div className="max-w-md mx-auto pt-2">
              <Link href="#contentinfo">
                <Button variant="gradient" size="lg" fullWidth icon={<ArrowRight className="w-4 h-4" />}>
                  Subscribe via Footer Box Below
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA SECTION */}
      <section id="get-started" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Start Translating in Seconds &bull; No Credit Card Needed
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to Experience Real-Time Indian Sign Language Translation?
          </h2>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users, educators, and enterprise partners building a more accessible and inclusive world today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/studio">
              <Button variant="gradient" size="lg" icon={<Camera className="w-5 h-5" />} className="w-full sm:w-auto px-8 py-4 text-base shadow-xl shadow-indigo-500/25">
                Launch Live Studio Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" icon={<Building2 className="w-5 h-5" />} className="w-full sm:w-auto px-8 py-4 text-base">
                Request Enterprise Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
