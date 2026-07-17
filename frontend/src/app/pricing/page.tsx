'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { Accordion } from '@/components/utility/Accordion';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  Zap,
  Lock,
  Camera,
  Volume2,
} from 'lucide-react';

/**
 * Public Pricing Page (`/pricing`)
 * Features a dynamic Monthly/Annual toggle (`20% savings`), 3 comprehensive tier cards,
 * a 16-item technical comparison table, and FAQ accordion.
 */
export default function PricingPage() {
  const [isAnnualBilling, setIsAnnualBilling] = useState<boolean>(true);

  const faqItems = [
    {
      id: 'pricing-faq-1',
      title: 'Is the Free Personal tier permanently free, or does it require a credit card?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          The Free Personal tier is <strong className="text-white">100% free forever</strong> and requires zero credit card details upon signup. It is designed to ensure deaf and hard-of-hearing individuals always have access to basic MediaPipe 3D sign language recognition for daily interactions.
        </p>
      ),
    },
    {
      id: 'pricing-faq-2',
      title: 'How does annual billing work and what is the discount policy?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          When you toggle <strong className="text-white">&quot;Annual Billing (Save 20%)&quot;</strong> above, our Pro tier drops from $29/month to $23/month billed annually ($276/year). You can cancel or switch back to monthly billing at any time from your account settings.
        </p>
      ),
    },
    {
      id: 'pricing-faq-3',
      title: 'Can we deploy SignBridge AI inside our own private Kubernetes cloud (`VPC/On-Prem`)?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          Yes! Our <strong className="text-white">Enterprise SaaS tier</strong> provides containerized Docker &amp; Kubernetes (`k8s`) images of our FastAPI inference engine and PyTorch workers. This ensures raw webcam frames and hospital patient data never leave your private hospital or campus intranet.
        </p>
      ),
    },
    {
      id: 'pricing-faq-4',
      title: 'Do you offer special discounts for K-12 schools, non-profits, and universities?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          Yes. Registered non-profit organizations, special education institutes, and accredited universities qualify for up to <strong className="text-white">75% off Pro licenses</strong> or complimentary accessibility grants. Contact our team via <Link href="/contact" className="text-indigo-400 underline">the contact page</Link> with your institution details.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-24 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-indigo-600/20 to-pink-500/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="purple" size="md">Transparent Pricing Plans</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.14]">
            Simple, Accessible Pricing for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Every Organization
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start free with permanent personal recognition, or upgrade to unlimited multi-vendor speech synthesis, custom vocabulary fine-tuning, and enterprise SLAs.
          </p>

          {/* Billing Toggle Bar */}
          <div className="pt-6 flex items-center justify-center gap-4 select-none">
            <span className={`text-sm font-semibold transition-colors ${!isAnnualBilling ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <ToggleSwitch
              checked={isAnnualBilling}
              onChange={() => setIsAnnualBilling(!isAnnualBilling)}
              aria-label="Toggle annual billing discount"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold transition-colors ${isAnnualBilling ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <Badge variant="success" size="sm" className="animate-pulse">
                Save 20%
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-TIER PRICING CARDS */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free Personal */}
            <Card variant="standard" className="p-8 space-y-6 bg-slate-900/40 border-slate-800 flex flex-col justify-between text-left relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="md">Personal / Student</Badge>
                  <span className="text-xs font-mono text-slate-400 uppercase">Forever Free</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Free Personal Tier</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Essential 3D spatial recognition for individual deaf and hard-of-hearing users during everyday video calls.
                </p>
                <div className="pt-2 pb-4 border-b border-slate-800 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white font-mono">$0</span>
                  <span className="text-sm text-slate-400 font-medium">/ month</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 pt-2">
                  {[
                    '60 minutes / month real-time 3D tracking',
                    'MediaPipe 21-landmark spatial coordinates',
                    'Standard 57-class ISL vocabulary access',
                    'Debounced text translation transcript',
                    'Community forum & self-serve documentation',
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  {[
                    'Natural voice TTS speech synthesis',
                    'Cloud session history & transcript exports',
                    'Interactive ISL learning center scoring',
                  ].map((noFeat) => (
                    <li key={noFeat} className="flex items-start gap-3 text-slate-500 opacity-60">
                      <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <span className="line-through">{noFeat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link href="/studio" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Launch Studio Free
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tier 2: Pro Educator (RECOMMENDED) */}
            <Card
              variant="standard"
              className="p-8 space-y-6 bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 flex flex-col justify-between text-left relative scale-[1.02] lg:-translate-y-2"
            >
              <div className="absolute -top-3.5 right-6">
                <Badge variant="purple" size="md" className="shadow-md">
                  Most Popular
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="accent" size="md">Educators &amp; Professionals</Badge>
                  <span className="text-xs font-mono text-indigo-400 uppercase">14-Day Free Trial</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Pro Educator Tier</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlimited translation, lifelike speech output, and interactive lesson scoring for teachers and active communicators.
                </p>
                <div className="pt-2 pb-4 border-b border-slate-800 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white font-mono">
                    ${isAnnualBilling ? '23' : '29'}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">/ month {isAnnualBilling && '(billed annually)'}</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 pt-2">
                  {[
                    'Unlimited real-time MediaPipe 3D tracking',
                    'Full 500+ ISL sign dictionary database',
                    'Natural speech synthesis (`Neerja & Prabhat`)',
                    'Adjustable speech playback speed (`0.75x - 1.5x`)',
                    'Encrypted MongoDB session history & CSV exports',
                    'Interactive learning center with skeletal scoring',
                    'Priority email support (`12-hour SLA`)',
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link href="/studio" className="block">
                  <Button variant="gradient" size="lg" icon={<Sparkles className="w-4 h-4" />} className="w-full shadow-lg shadow-indigo-500/30">
                    Start 14-Day Pro Trial
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tier 3: Enterprise SaaS */}
            <Card variant="standard" className="p-8 space-y-6 bg-slate-900/40 border-slate-800 flex flex-col justify-between text-left relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" size="md">Hospitals &amp; Enterprise</Badge>
                  <span className="text-xs font-mono text-amber-400 uppercase">Custom SLA</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Enterprise SaaS</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Dedicated high-speed WebSocket endpoints, custom PyTorch gesture training, and full institutional compliance.
                </p>
                <div className="pt-2 pb-4 border-b border-slate-800 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">Custom</span>
                  <span className="text-sm text-slate-400 font-medium">/ annual contract</span>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-300 pt-2">
                  {[
                    'Everything in Pro Educator included',
                    'Custom ISL gesture fine-tuning (`PyTorch Bi-LSTM`)',
                    'Low-latency WebSocket SDK (`/ai/v1/stream`)',
                    'On-premise Kubernetes (`k8s`) container options',
                    'Role-Based Access Control (`RBAC`) & Audit logs',
                    'HIPAA & FERPA Business Associate Agreements',
                    'Prometheus & Grafana telemetry endpoints',
                    'Dedicated Solution Architect (`2-hour SLA`)',
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link href="/contact" className="block">
                  <Button variant="outline" size="lg" icon={<Building2 className="w-4 h-4" />} className="w-full border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10">
                    Contact Sales &amp; Architects
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. DETAILED TECHNICAL COMPARISON MATRIX TABLE */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="info" size="md">Comprehensive Breakdown</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Compare All Features &amp; Specifications
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Evaluate exact spatial thresholds, audio capabilities, and compliance metrics across plans.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <th className="p-4 sm:p-6">Feature &amp; Specification</th>
                  <th className="p-4 sm:p-6 text-center">Free Personal</th>
                  <th className="p-4 sm:p-6 text-center text-indigo-400">Pro Educator</th>
                  <th className="p-4 sm:p-6 text-center text-purple-400">Enterprise SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm text-slate-300">
                {/* Section 1 */}
                <tr className="bg-slate-950/80 font-bold text-xs uppercase text-slate-400">
                  <td colSpan={4} className="p-4 sm:px-6">Spatio-Temporal AI &amp; Recognition</td>
                </tr>
                {[
                  { name: 'MediaPipe 3D Hand Landmark Tracking (`x,y,z`)', free: true, pro: true, ent: true },
                  { name: 'Sliding Circular Buffer (`T=30 consecutive frames`)', free: true, pro: true, ent: true },
                  { name: 'Vocabulary Size (`Standard vs Custom Dictionary`)', free: '57 Signs', pro: '500+ Signs', ent: 'Unlimited + Custom' },
                  { name: 'Average WebSocket Inference Latency Target', free: 'under 60ms', pro: 'under 45ms', ent: 'under 30ms (Dedicated)' },
                  { name: 'Custom Domain PyTorch Bi-LSTM Fine-Tuning', free: false, pro: false, ent: true },
                ].map((row, idx) => (
                  <tr key={row.name} className={idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}>
                    <td className="p-4 sm:p-6 font-medium text-white">{row.name}</td>
                    <td className="p-4 sm:p-6 text-center font-mono text-slate-300">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="p-4 sm:p-6 text-center font-mono text-indigo-300">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-4 sm:p-6 text-center font-mono text-purple-300 font-bold">
                      {typeof row.ent === 'boolean' ? (
                        row.ent ? <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.ent
                      )}
                    </td>
                  </tr>
                ))}

                {/* Section 2 */}
                <tr className="bg-slate-950/80 font-bold text-xs uppercase text-slate-400">
                  <td colSpan={4} className="p-4 sm:px-6">Audio Synthesis &amp; Education</td>
                </tr>
                {[
                  { name: 'Neural Voice TTS Output (`Edge Neural & Azure`)', free: false, pro: true, ent: true },
                  { name: 'Custom Playback Speed & Gender Switcher', free: false, pro: true, ent: true },
                  { name: 'Interactive Learning Center & Skeletal Scoring', free: false, pro: true, ent: true },
                  { name: 'MongoDB Session History Persistence & CSV Export', free: false, pro: true, ent: true },
                ].map((row, idx) => (
                  <tr key={row.name} className={idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}>
                    <td className="p-4 sm:p-6 font-medium text-white">{row.name}</td>
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

                {/* Section 3 */}
                <tr className="bg-slate-950/80 font-bold text-xs uppercase text-slate-400">
                  <td colSpan={4} className="p-4 sm:px-6">Security, Deployment &amp; Support</td>
                </tr>
                {[
                  { name: 'WCAG 2.2 AA High-Contrast Focus Ring Assurance', free: true, pro: true, ent: true },
                  { name: 'Role-Based Access Control (`Admin/User RBAC`)', free: false, pro: false, ent: true },
                  { name: 'HIPAA & FERPA Compliance (`Business Associate Agreement`)', free: false, pro: false, ent: true },
                  { name: 'On-Premise Kubernetes (`k8s`) Container Deployment', free: false, pro: false, ent: true },
                  { name: 'Prometheus & Grafana Telemetry Metrics Endpoint', free: false, pro: false, ent: true },
                  { name: 'Support Service Level Agreement (`SLA`)', free: 'Community Forum', pro: '12-Hour Priority Email', ent: '2-Hour Solution Architect' },
                ].map((row, idx) => (
                  <tr key={row.name} className={idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}>
                    <td className="p-4 sm:p-6 font-medium text-white">{row.name}</td>
                    <td className="p-4 sm:p-6 text-center font-mono text-slate-300">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="p-4 sm:p-6 text-center font-mono text-indigo-300">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-4 sm:p-6 text-center font-mono text-purple-300 font-bold">
                      {typeof row.ent === 'boolean' ? (
                        row.ent ? <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto" /> : <XCircle className="w-5 h-5 text-slate-700 mx-auto" />
                      ) : (
                        row.ent
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. PRICING FAQ ACCORDION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="purple" size="md">Billing Questions</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pricing &amp; Subscription FAQ
            </h2>
            <p className="text-sm text-slate-400">
              Find answers regarding institutional grants, cancellation flexibility, and hardware requirements.
            </p>
          </div>

          <Accordion items={faqItems} allowMultiple className="text-left" />
        </div>
      </section>

      {/* 5. ENTERPRISE BANNER CTA */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="warning" size="md">Need Custom Scale?</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deploy SignBridge AI Inside Your Private Cloud
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Contact our engineering architects to discuss custom PyTorch gesture training, isolated VPC endpoints, and institutional HIPAA agreements.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="gradient" size="lg" icon={<Building2 className="w-5 h-5" />} className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                Contact Enterprise Architecture Team
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto">
                Test Live Studio Demo First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
