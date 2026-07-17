'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/utility/Accordion';
import {
  Sparkles,
  Camera,
  Layers,
  Zap,
  Volume2,
  BookOpen,
  GraduationCap,
  Activity,
  Heart,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Cpu,
  Database,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';

/**
 * Public Features Page (`/features`)
 * Comprehensive breakdown of SignBridge AI's 8 core capabilities, architecture flow,
 * multi-device compatibility, and comparative tier matrix.
 */
export default function FeaturesPage() {
  const [activeTabSection, setActiveTabSection] = useState<string>('all');
  const [searchDictionary, setSearchDictionary] = useState<string>('');

  // Sample dictionary items for preview
  const sampleSigns = [
    { name: 'Namaste (Greeting)', category: 'Conversation', confidence: '99.8%', complexity: 'Low' },
    { name: 'Emergency Medical Support', category: 'Healthcare', confidence: '99.4%', complexity: 'Medium' },
    { name: 'Where is the Hospital?', category: 'Healthcare', confidence: '99.1%', complexity: 'Medium' },
    { name: 'Thank You Very Much', category: 'Conversation', confidence: '99.9%', complexity: 'Low' },
    { name: 'I Need Help / Assistance', category: 'Emergency', confidence: '98.9%', complexity: 'Low' },
    { name: 'What is Your Name?', category: 'Education', confidence: '99.3%', complexity: 'Medium' },
  ];

  const filteredSigns = sampleSigns.filter(
    (s) =>
      s.name.toLowerCase().includes(searchDictionary.toLowerCase()) ||
      s.category.toLowerCase().includes(searchDictionary.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-indigo-600/20 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="purple" size="md">Platform Architecture</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.14]">
            Engineered for Speed, Precision, &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Universal Access
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover how spatial MediaPipe 3D landmark tracking, temporal PyTorch Bi-LSTM neural networks, and accessible UI primitives bridge the gap between Indian Sign Language and spoken English.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/studio">
              <Button variant="gradient" size="lg" icon={<Camera className="w-5 h-5" />} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                Launch Live Studio Demo
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Compare Tier Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION PILLS BAR */}
      <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3.5 px-4 overflow-x-auto select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 min-w-max">
          {[
            { id: 'all', label: 'All Capabilities' },
            { id: 'core-engine', label: '1. Real-Time Recognition' },
            { id: 'nlp-translation', label: '2. NLP & Transcript' },
            { id: 'speech-tts', label: '3. Neural Speech TTS' },
            { id: 'history-storage', label: '4. Session History' },
            { id: 'learning-center', label: '5. Learning Center' },
            { id: 'dictionary', label: '6. ISL Dictionary' },
            { id: 'analytics', label: '7. Telemetry & KPIs' },
            { id: 'accessibility', label: '8. WCAG 2.2 AA' },
          ].map((item) => (
            <a
              key={item.id}
              href={item.id === 'all' ? '#' : `#${item.id}`}
              onClick={() => setActiveTabSection(item.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[38px] inline-flex items-center focus-ring ${
                activeTabSection === item.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* 3. DEEP-DIVE FEATURE SECTIONS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-28">
        {/* Feature 1: Real-Time Recognition */}
        <div id="core-engine" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-32">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <Badge variant="purple" size="md">Core Engine Feature</Badge>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Real-Time 3D Spatial Tracking &amp; Sequence Classification
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Problem Solved:</strong> Traditional sign language detection requires bulky data gloves, specialized depth cameras (`Kinect`), or high-latency cloud uploads that disrupt natural conversation.
              </p>
              <p>
                <strong className="text-white">User Benefit:</strong> Users communicate naturally using only standard laptop or USB webcams. Hand tracking operates at 60 FPS directly inside the browser using WebRTC streams.
              </p>
              <p>
                <strong className="text-white">Typical Use Cases:</strong> Instant interpretation during remote video standups, physician consultations, university lectures, and government service counters.
              </p>
              <p>
                <strong className="text-white">Technical &amp; Accessibility Specs:</strong> Spatial normalization (`126 float vector`) removes scale/distance bias. A sliding window (`T=30 frames`) evaluates temporal flow with debounced output (under 45ms total latency).
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
                <span>WEBSOCKET STREAM: /ai/v1/stream</span>
                <span className="text-emerald-400 font-bold">26.4ms Latency</span>
              </div>
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 to-slate-950" />
                <div className="relative z-10 text-center space-y-2">
                  <Cpu className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                  <div className="text-base font-bold text-white font-mono">Bi-LSTM Temporal Decoder Active</div>
                  <div className="text-xs text-slate-400">Sliding Circular Buffer: [Frame t-29 ... Frame t]</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature 2: NLP & Translation */}
        <div id="nlp-translation" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-32">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
                <span>NLP SENTENCE RECONSTRUCTION ENGINE</span>
                <Badge variant="success" size="sm">Confidence &gt; 98%</Badge>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-left font-mono text-sm">
                <div className="text-slate-500 text-xs">{'// Raw classified token stream:'}</div>
                <div className="text-purple-400">['PLEASE', 'CALL', 'DOCTOR', 'EMERGENCY']</div>
                <div className="text-slate-500 text-xs pt-2">{'// Grammatically smoothed English output:'}</div>
                <div className="text-emerald-400 font-bold text-base">"Please call a doctor for a medical emergency."</div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <Badge variant="info" size="md">NLP &amp; Grammar Engine</Badge>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Coherent Sentence Construction &amp; Debouncing
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Problem Solved:</strong> Sign language has its own unique grammatical syntax (`Subject-Object-Verb` or topic-comment) that differs significantly from standard spoken English word order.
              </p>
              <p>
                <strong className="text-white">User Benefit:</strong> Our NLP post-processing layer automatically maps isolated sign tokens into fluent, grammatically correct English sentences ready for professional documentation and speech.
              </p>
              <p>
                <strong className="text-white">Typical Use Cases:</strong> Real-time transcription during corporate board meetings, legal consultations, and patient history intake.
              </p>
              <p>
                <strong className="text-white">Technical &amp; Accessibility Specs:</strong> Utilizes 3-frame consecutive debouncing to prevent flickering outputs and provides transparent confidence percentage scores (`0.0 - 1.0`).
              </p>
            </div>
          </div>
        </div>

        {/* Feature 3: Natural Speech Synthesis */}
        <div id="speech-tts" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-32">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Volume2 className="w-6 h-6" />
              </div>
              <Badge variant="accent" size="md">Multi-Vendor Audio TTS</Badge>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              High-Fidelity Neural Speech Synthesis
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Problem Solved:</strong> Robotic or delayed text-to-speech outputs feel unnatural and impede emotional nuance when deaf individuals speak with hearing peers.
              </p>
              <p>
                <strong className="text-white">User Benefit:</strong> Users select from lifelike neural voices (`Edge TTS Neerja/Prabhat`, `Azure Speech`) with adjustable playback speeds (`0.75x - 1.5x`) and instant mute capabilities.
              </p>
              <p>
                <strong className="text-white">Typical Use Cases:</strong> Speaking aloud in public spaces, classroom discussions, telephone relay calls, and customer service kiosks.
              </p>
              <p>
                <strong className="text-white">Technical &amp; Accessibility Specs:</strong> Abstracted `ISpeechProvider` supports fallback between browser `speechSynthesis` and high-speed cloud neural endpoints with zero audio clipping.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>ACTIVE TTS VOICE: en-IN-NeerjaNeural</span>
                <Badge variant="purple" size="sm">Speed: 1.0x</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-sm font-semibold text-white italic">"Welcome to our accessibility presentation."</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div key={bar} className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${bar * 120}ms` }} />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature 4: Translation History & Storage */}
        <div id="history-storage" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-32">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
                <span>MONGODB 7.0 MOTOR PERSISTENCE</span>
                <span className="text-emerald-400">Encrypted at Rest</span>
              </div>
              <div className="space-y-2.5 text-slate-300">
                <div className="p-3 rounded bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                  <span>[2026-07-16 14:22:01] "Namaste! How are you?"</span>
                  <Badge variant="success" size="sm">99.8%</Badge>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                  <span>[2026-07-16 14:23:15] "Where is the pharmacy?"</span>
                  <Badge variant="success" size="sm">99.2%</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <Badge variant="warning" size="md">Enterprise Database</Badge>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Encrypted Session History &amp; Timestamp Exports
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Problem Solved:</strong> Users need a permanent, verifiable record of important translated conversations (`medical diagnoses`, `academic lectures`, `legal proceedings`) without manual note-taking.
              </p>
              <p>
                <strong className="text-white">User Benefit:</strong> All authenticated translation sessions are automatically persisted to MongoDB (`Translations`, `Sessions` collections) with full search, filtering, and JSON/CSV export capabilities.
              </p>
              <p>
                <strong className="text-white">Typical Use Cases:</strong> Archiving patient visit transcripts, reviewing classroom lecture notes, and compliance auditing.
              </p>
              <p>
                <strong className="text-white">Technical &amp; Accessibility Specs:</strong> Schema validated with `Motor` asynchronous Python driver, soft deletion (`is_deleted`), and strict JWT Role-Based Access Control (`RBAC`).
              </p>
            </div>
          </div>
        </div>

        {/* Feature 5: Interactive Learning Center */}
        <div id="learning-center" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-32">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <Badge variant="success" size="md">ISL Education</Badge>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Interactive Learning &amp; Real-Time Skeletal Scoring
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Problem Solved:</strong> Learning Indian Sign Language from static textbooks or 2D video tutorials provides zero feedback on correct hand posture or finger orientation.
              </p>
              <p>
                <strong className="text-white">User Benefit:</strong> Students and educators practice daily ISL vocabulary with instant AI scoring (`0 - 100% precision`) and skeletal coordinate alignment indicators comparing their pose against standard reference models.
              </p>
              <p>
                <strong className="text-white">Typical Use Cases:</strong> Special education academies, corporate DEI onboarding, and families learning ISL together at home.
              </p>
              <p>
                <strong className="text-white">Technical &amp; Accessibility Specs:</strong> Real-time Cosine Similarity computation across normalized 3D vectors (`x, y, z`) with keyboard-accessible navigation and visual focus rings.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card variant="standard" className="p-6 space-y-4 bg-slate-900/60 border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                <span>LESSON #4: DAILY CONVERSATIONS</span>
                <span className="text-emerald-400 font-bold">Accuracy: 96.8%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Target Gesture: "THANK YOU"</span>
                  <Badge variant="success" size="sm">Posture Match: Perfect</Badge>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[97%]" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature 6: ISL Sign Dictionary */}
        <div id="dictionary" className="space-y-8 scroll-mt-32 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <Badge variant="purple" size="md">500+ gestures</Badge>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Standard Indian Sign Language Dictionary
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Explore our searchable reference database containing standardized ISL gestures complete with confidence targets and vocabulary classifications.
              </p>
            </div>

            {/* Instant search filter */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter signs by name or category..."
                value={searchDictionary}
                onChange={(e) => setSearchDictionary(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus-ring"
                aria-label="Search ISL sign dictionary"
              />
            </div>
          </div>

          {/* Dictionary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSigns.map((sign) => (
              <Card key={sign.name} variant="interactive" className="p-5 space-y-3 bg-slate-900/40 border-slate-800">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">{sign.category}</Badge>
                  <span className="text-xs font-mono font-bold text-emerald-400">{sign.confidence}</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{sign.name}</h3>
                <div className="flex items-center justify-between text-caption text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Skeletal Complexity: {sign.complexity}</span>
                  <Link href="/studio" className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-semibold">
                    Test <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div >

      {/* 4. DEVICE & OS COMPATIBILITY MATRIX */}
      <section className="py-20 border-t border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <Badge variant="accent" size="md">Cross-Platform</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Universal Device &amp; OS Compatibility
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              SignBridge AI is built on WebRTC and WebGL standards, ensuring full functionality across desktop, tablet, and mobile browsers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Desktop Workstations',
                os: 'macOS, Windows 10/11, Linux',
                browser: 'Chrome 110+, Edge, Firefox, Safari',
                fps: '60 FPS Ultra-Low Latency',
                icon: Monitor,
              },
              {
                title: 'Tablets & iPads',
                os: 'iPadOS 16+, Android Tablet 12+',
                browser: 'Mobile Safari, Chrome Mobile',
                fps: '45-60 FPS Hardware Accelerated',
                icon: Tablet,
              },
              {
                title: 'Mobile Smartphones',
                os: 'iOS 16+, Android 12+',
                browser: 'Safari, Chrome, Samsung Internet',
                fps: '30-45 FPS Optimized WebGL',
                icon: Smartphone,
              },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{d.title}</h3>
                  <div className="space-y-2 text-sm text-slate-300 divide-y divide-slate-800">
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Supported OS:</span>
                      <span className="font-semibold text-right">{d.os}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">Browsers:</span>
                      <span className="font-semibold text-right">{d.browser}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">Target Frame Rate:</span>
                      <span className="text-emerald-400 font-bold text-right">{d.fps}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURE COMPARISON MATRIX TABLE */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="purple" size="md">Detailed Feature Comparison</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Compare Features Across All Tiers
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Granular technical breakdown of capabilities included in Free Personal, Pro Educator, and Enterprise SaaS plans.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <th className="p-4 sm:p-6">Feature Capability</th>
                  <th className="p-4 sm:p-6 text-center">Free Personal</th>
                  <th className="p-4 sm:p-6 text-center text-indigo-400">Pro Educator</th>
                  <th className="p-4 sm:p-6 text-center text-purple-400">Enterprise SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm text-slate-300">
                {[
                  { name: 'Real-Time MediaPipe 3D Landmark Tracking', free: true, pro: true, ent: true },
                  { name: 'Standard 57-Class ISL Vocabulary', free: true, pro: true, ent: true },
                  { name: 'Temporal T=30 Sliding Window Classification', free: true, pro: true, ent: true },
                  { name: 'Grammatical NLP Sentence Construction', free: true, pro: true, ent: true },
                  { name: 'Natural Speech TTS Output (`Neerja / Prabhat`)', free: false, pro: true, ent: true },
                  { name: 'Unlimited MongoDB Session History Persistence', free: false, pro: true, ent: true },
                  { name: 'Interactive Learning Center & Scoring', free: false, pro: true, ent: true },
                  { name: 'Custom Domain Gesture Fine-Tuning (`PyTorch`)', free: false, pro: false, ent: true },
                  { name: 'Low-Latency WebSocket SDK & REST API Access', free: false, pro: false, ent: true },
                  { name: 'On-Premise Kubernetes (`k8s`) Container Support', free: false, pro: false, ent: true },
                  { name: 'Role-Based Access Control (`Admin/User`)', free: false, pro: false, ent: true },
                  { name: 'Prometheus & Grafana Telemetry Metrics', free: false, pro: false, ent: true },
                ].map((row, idx) => (
                  <tr key={row.name} className={idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}>
                    <td className="p-4 sm:p-6 font-semibold text-white">{row.name}</td>
                    <td className="p-4 sm:p-6 text-center">
                      {row.free ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />}
                    </td>
                    <td className="p-4 sm:p-6 text-center">
                      {row.pro ? <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />}
                    </td>
                    <td className="p-4 sm:p-6 text-center">
                      {row.ent ? <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-4">
            <Link href="/pricing">
              <Button variant="gradient" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                View Complete Pricing Page
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
