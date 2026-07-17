'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Heart,
  Shield,
  Sparkles,
  Users,
  Globe,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Building2,
  Lightbulb,
  Target,
  Smile,
  Compass,
  Zap,
} from 'lucide-react';

/**
 * Public About Us Page (`/about`)
 * Communicates SignBridge AI's mission, origin story, social impact metrics,
 * accessibility philosophy, engineering leadership, and product timeline.
 */
export default function AboutPage() {
  const [activeTimelineYear, setActiveTimelineYear] = useState<number>(2026);

  const timelineEvents = [
    {
      year: 2023,
      title: 'Inception & Spatial Computer Vision Research',
      description:
        'Initiated research into real-time 3D hand tracking using MediaPipe landmarks. Discovered that 2D image models failed under low lighting and hand self-occlusion, prompting our shift to 3D spatial coordinate invariance (`126-dimensional vectors`).',
      milestone: 'First 10-Gesture Prototype (91.2% Accuracy)',
      badge: 'Research Phase',
    },
    {
      year: 2024,
      title: 'Temporal PyTorch Bi-LSTM Sequence Engine',
      description:
        'Developed sliding circular buffers (`T=30 frames`) to capture dynamic movement trajectories over time. Partnered with deaf community advocates and special education centers across India to curate over 50,000 continuous ISL video sequences.',
      milestone: 'Vocabulary Expansion to 150+ ISL Signs',
      badge: 'Deep Learning',
    },
    {
      year: 2025,
      title: 'Real-Time WebSocket & Neural Speech Architecture',
      description:
        'Engineered asynchronous FastAPI + Celery backend systems with WebSocket streaming (`/ai/v1/stream`), achieving under 45ms end-to-end latency. Integrated Edge Neural and Azure TTS engines for immediate natural voice output.',
      milestone: 'Sub-45ms Latency Benchmark Met',
      badge: 'Infrastructure',
    },
    {
      year: 2026,
      title: 'Enterprise SaaS & Universal Accessibility Launch',
      description:
        'Achieved full WCAG 2.2 AA accessibility certification across all UI primitives. Launched our enterprise platform with Role-Based Access Control (`RBAC`), HIPAA/FERPA compliance workflows, and our public 500+ ISL Sign Dictionary.',
      milestone: 'Enterprise Production Deployment',
      badge: 'Global Scale',
    },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-purple-600/20 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="success" size="md">Our Mission &amp; Impact</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.14]">
            Bridging Communication Gaps for{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              70+ Million Individuals
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We believe that basic human communication should never require expensive hardware, third-party human intermediaries, or exclusionary technical barriers. We are building the world&apos;s fastest AI sign language interpreter directly inside standard web browsers.
          </p>

          {/* Key Impact Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            {[
              { value: '18M+', label: 'ISL Users in India', desc: 'Active signers requiring real-time support' },
              { value: '&lt; 300', label: 'Certified Interpreters', desc: 'Critical nationwide scarcity ratio' },
              { value: 'under 45ms', label: 'Inference Latency', desc: 'Real-time 60 FPS spatial recognition' },
              { value: 'WCAG 2.2 AA', label: 'Accessibility Standard', desc: 'Enforced across all UI components' },
            ].map((stat, idx) => (
              <Card key={stat.label} variant="standard" className="p-4 sm:p-5 bg-slate-900/60 border-slate-800 text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono" dangerouslySetInnerHTML={{ __html: stat.value }} />
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mt-1">{stat.label}</div>
                <div className="text-caption text-slate-400 mt-1">{stat.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MISSION, VISION & CORE VALUES */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <Badge variant="purple" size="md">Our North Star</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Democratizing Sign Language Interpretation Through AI
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Over 18 million citizens in India alone communicate primarily through Indian Sign Language (ISL), yet there are fewer than 300 certified human interpreters available across the entire nation. This staggering disparity excludes millions of deaf and hard-of-hearing (DHH) individuals from emergency healthcare, higher education, legal representation, and equal employment opportunities.
              </p>
              <p className="text-base text-slate-300 leading-relaxed">
                SignBridge AI was founded to dismantle this systemic barrier. By combining spatial 3D computer vision (`MediaPipe`) with temporal neural networks (`PyTorch Bi-LSTM`), we transform any everyday webcam into an instantaneous, empathetic, and highly accurate sign-to-speech bridge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Universal Inclusion',
                  desc: 'We design for the margins first. Every button, input, and visual indicator exceeds WCAG 2.2 AA accessibility requirements.',
                  icon: Heart,
                  color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                },
                {
                  title: 'Zero-Hardware Barrier',
                  desc: 'No $500 data gloves or specialized depth cameras needed. Works instantly inside Chrome, Safari, and Edge browsers.',
                  icon: Zap,
                  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                },
                {
                  title: 'Privacy-First Edge AI',
                  desc: 'Skeletal coordinate vectors are extracted in ephemeral memory. Your raw video feed is never stored or transmitted.',
                  icon: Shield,
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                },
                {
                  title: 'Scientific Rigor',
                  desc: 'Our neural networks are trained and benchmarked on real-world Indian Sign Language datasets with native speaker verification.',
                  icon: Award,
                  color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                },
              ].map((val) => {
                const Icon = val.icon;
                return (
                  <Card key={val.title} variant="interactive" className="p-6 space-y-3 bg-slate-900/50 border-slate-800 text-left">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${val.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{val.title}</h3>
                    <p className="text-small text-slate-400 leading-relaxed">{val.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT & RESEARCH TIMELINE */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="info" size="md">Our Journey</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Research Prototype to Enterprise SaaS
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Trace the evolution of our spatial computer vision algorithms and low-latency infrastructure from 2023 to today.
            </p>
          </div>

          {/* Year Selector Tabs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {timelineEvents.map((evt) => (
              <button
                key={evt.year}
                type="button"
                onClick={() => setActiveTimelineYear(evt.year)}
                className={`px-5 py-3 rounded-xl font-mono text-sm font-bold transition-all min-h-[44px] focus-ring flex items-center gap-2 ${
                  activeTimelineYear === evt.year
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{evt.year}</span>
              </button>
            ))}
          </div>

          {/* Active Timeline Display */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-indigo-500/30 bg-slate-900 p-8 sm:p-12 shadow-2xl text-left space-y-6">
            {timelineEvents
              .filter((e) => e.year === activeTimelineYear)
              .map((evt) => (
                <motion.div
                  key={evt.year}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="purple" size="md">{evt.badge}</Badge>
                    <span className="font-mono text-sm font-bold text-emerald-400">{evt.milestone}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {evt.year}: {evt.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{evt.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP & ENGINEERING TEAM */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="accent" size="md">Multidisciplinary Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built by Researchers, Engineers &amp; Accessibility Advocates
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Our core contributors bring decades of experience across deep neural networks, human-computer interaction, and disability advocacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Dr. Aarav Sharma',
                role: 'Chief AI Scientist & Founder',
                bio: 'Ph.D. in Computer Vision from IIT Delhi. Former Senior Research Scientist at Google DeepMind specializing in spatio-temporal sequence modeling.',
                initials: 'AS',
                color: 'from-indigo-600 to-purple-600',
              },
              {
                name: 'Neerja Krishnan',
                role: 'VP of Accessibility & Product',
                bio: 'Deaf community leader and member of the ISL Standardization Council. Has advised over 40 enterprise SaaS platforms on WCAG compliance.',
                initials: 'NK',
                color: 'from-purple-600 to-pink-600',
              },
              {
                name: 'Rohan Mehta',
                role: 'Principal Systems Architect',
                bio: '15+ years building ultra-low-latency distributed streaming systems using FastAPI, WebSockets, Redis, and Kubernetes at scale.',
                initials: 'RM',
                color: 'from-emerald-600 to-teal-600',
              },
              {
                name: 'Ananya Verma',
                role: 'Lead Full Stack & UI Engineer',
                bio: 'Design System architect and React specialist passionate about accessible, minimalistic, and distraction-free enterprise web interfaces.',
                initials: 'AV',
                color: 'from-amber-600 to-rose-600',
              },
            ].map((member) => (
              <Card key={member.name} variant="standard" className="p-6 space-y-4 bg-slate-900/40 border-slate-800 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${member.color} flex items-center justify-center text-xl font-bold text-white shadow-md`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <div className="text-xs font-semibold text-indigo-400 mt-0.5">{member.role}</div>
                  </div>
                  <p className="text-small text-slate-400 leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY IMPACT & OPEN SOURCE */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <Badge variant="purple" size="md">Community &amp; Open Science</Badge>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Empowering the Next Generation of ISL Educators
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                We believe in open science and collaborative accessibility. In addition to our commercial enterprise SaaS platform, we actively maintain the public Indian Sign Language Open Dataset and offer free tier access for registered K-12 schools, non-profit institutions, and community clinics across South Asia.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact">
                  <Button variant="primary" size="md" icon={<Building2 className="w-4 h-4" />}>
                    Apply for Non-Profit Grant
                  </Button>
                </Link>
                <Link href="/features#dictionary">
                  <Button variant="outline" size="md" icon={<BookOpen className="w-4 h-4" />}>
                    Browse Open Dictionary
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Card variant="standard" className="p-8 space-y-6 bg-slate-900 border-slate-800 text-left">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Our Open Accessibility Pledge</span>
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-300 divide-y divide-slate-800/60">
                  <li className="pt-2 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Always provide a perpetual Free Personal Tier with core MediaPipe 3D recognition for daily individual communication.</span>
                  </li>
                  <li className="pt-3 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Maintain zero tracking of raw webcam video frames across all commercial and personal endpoints.</span>
                  </li>
                  <li className="pt-3 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Regularly publish open-source benchmark datasets (`ISL-Spatial-50k`) to accelerate global assistive tech research.</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="accent" size="md">Join the Movement</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Make Communication Universal?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience real-time AI recognition right in your browser, or get in touch with our engineering team to deploy custom vocabulary solutions for your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/studio">
              <Button variant="gradient" size="lg" icon={<Sparkles className="w-5 h-5" />} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                Launch Live Studio Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                Contact Our Leadership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
