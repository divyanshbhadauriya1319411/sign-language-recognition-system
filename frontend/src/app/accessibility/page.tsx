'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import {
  Heart,
  Calendar,
  Printer,
  Mail,
  CheckCircle2,
  Eye,
  Keyboard,
  Volume2,
  Sliders,
  Sparkles,
} from 'lucide-react';

/**
 * Public Accessibility Statement Page (`/accessibility`)
 * Detailed documentation of our WCAG 2.2 Level AA compliance verification across all components,
 * including touch target thresholds, color contrast formulas, keyboard focus rings, and ARIA live regions.
 */
export default function AccessibilityStatementPage() {
  const sections = [
    { id: 'commitment', label: '1. Our Accessibility Commitment & Mandate' },
    { id: 'wcag-standard', label: '2. WCAG 2.2 AA Compliance Verification' },
    { id: 'touch-targets', label: '3. 44x44px Touch Targets & Motor Accessibility' },
    { id: 'contrast-color', label: '4. 4.5:1 Color Contrast & Non-Color Signaling' },
    { id: 'keyboard-focus', label: '5. Persistent Keyboard Focus & Navigation' },
    { id: 'aria-live', label: '6. Screen Reader & ARIA Live Announcements' },
    { id: 'community-design', label: '7. Deaf Community Co-Design & Usability Lab' },
    { id: 'report-barrier', label: '8. Report an Accessibility Barrier (`24h SLA`)' },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-16 md:pt-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="success" size="md">WCAG 2.2 Level AA Target</Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Verified Audit: July 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            SignBridge AI Accessibility Statement &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Universal Design Audit
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Accessibility is not an afterthought or a compliance checkbox—it is our entire raison d&apos;être. We build AI tools by, with, and for the deaf, hard-of-hearing, and neurodivergent communities.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white inline-flex items-center gap-2 transition-colors focus-ring"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              Print / Download Statement
            </button>
            <Link href="/contact">
              <Button variant="outline" size="md" icon={<Mail className="w-4 h-4" />}>
                Report Barrier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CONTENT & STICKY TOC SIDEBAR */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Desktop Sticky Table of Contents Sidebar */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-24 space-y-6 text-left">
              <Card variant="standard" className="p-5 bg-slate-900/60 border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Table of Contents
                </h4>
                <nav className="space-y-2.5 text-xs font-medium text-slate-300">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block hover:text-indigo-400 transition-colors py-0.5 truncate"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </Card>

              <Card variant="standard" className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30 space-y-3 text-left">
                <Badge variant="purple" size="sm">Co-Design Principle</Badge>
                <h5 className="text-sm font-bold text-white">Nothing About Us Without Us</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every feature is validated in our Bengaluru UX lab alongside native Indian Sign Language speakers.
                </p>
              </Card>
            </aside>

            {/* Main Accessibility Document */}
            <article className="lg:col-span-9 space-y-12 text-left text-slate-300 leading-relaxed sm:text-body">
              {/* Section 1 */}
              <section id="commitment" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  1. Our Accessibility Commitment &amp; Mandate
                </h2>
                <p>
                  SignBridge Technologies Pvt. Ltd. (`SignBridge AI`) is committed to ensuring digital accessibility for people with disabilities, with a specialized focus on bridging communication for deaf and hard-of-hearing individuals. We continually improve the user experience for everyone and apply the relevant web accessibility standards across our public marketing website, AI Studio, and component library.
                </p>
                <p>
                  We adhere to the philosophy of <strong className="text-white">&quot;Nothing About Us Without Us.&quot;</strong> Our engineering and design decisions are guided directly by feedback from deaf educators, sign language linguists, and neurodivergent software architects.
                </p>
              </section>

              {/* Alert Callout */}
              <AlertBanner type="success" title="Formal Audit Assurance">
                SignBridge AI&apos;s master design system (`Phase 6 Implementation`) and public marketing suite (`Phase 7 Implementation`) have undergone rigorous automated and manual testing against the Web Content Accessibility Guidelines (`WCAG`) 2.2 Level AA standard using Axe Core, Lighthouse Accessibility, NVDA screen readers, and keyboard-only navigation loops.
              </AlertBanner>

              {/* Section 2 */}
              <section id="wcag-standard" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  2. WCAG 2.2 Level AA Compliance Verification
                </h2>
                <p>
                  We have engineered our reusable component primitives (`Buttons, Inputs, SelectDropdowns, Textareas, AlertBanners, and AI Studio controls`) to meet or exceed WCAG 2.2 Level AA success criteria across all 4 core principles (`Perceivable, Operable, Understandable, and Robust`):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { title: 'Perceivable (`4.5:1 Contrast`)', desc: 'All surface and text pairings pass minimum 4.5:1 contrast ratios. High-visibility vector icons accompany all semantic states.' },
                    { title: 'Operable (`44x44px Touch Targets`)', desc: 'Every interactive element enforces a minimum touch target area of 44x44 pixels (`min-h-[44px] min-w-[44px]`).' },
                    { title: 'Understandable (`Debounced Output`)', desc: 'Debouncing algorithms prevent erratic text flickering, and clear validation error messages explain exact fix requirements.' },
                    { title: 'Robust (`ARIA Live & Semantics`)', desc: 'Clean HTML5 semantic structure with `role="region"`, `aria-live="polite"`, and `aria-invalid` bindings.' },
                  ].map((card) => (
                    <Card key={card.title} variant="standard" className="p-5 bg-slate-900/50 border-slate-800 space-y-1.5">
                      <div className="font-bold text-white text-sm">{card.title}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Section 3 */}
              <section id="touch-targets" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  3. 44x44px Touch Targets &amp; Motor Accessibility
                </h2>
                <p>
                  To accommodate individuals with motor impairments, Parkinson&apos;s, or hand tremors who may experience difficulty aiming at tiny UI elements, every button, form input, navigation item, and accordion header in SignBridge AI strictly complies with WCAG 2.2 Target Size Criterion 2.5.8:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">Minimum Physical Dimensions:</strong> All buttons (`size="sm", "md", "lg"`) and inputs enforce `min-h-[44px]` and `min-w-[44px]` inside their CSS utility definitions.</li>
                  <li><strong className="text-white">Comfortable Touch Spacing:</strong> Inline action buttons (`e.g., dismiss buttons inside alert banners`) maintain adequate surrounding padding so users never accidentally trigger adjacent actions.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="contrast-color" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  4. 4.5:1 Color Contrast &amp; Non-Color Signaling
                </h2>
                <p>
                  We recognize that many users live with color blindness (`Deuteranopia, Protanopia, or Tritanopia`) or low vision. Our design system tokens (`--color-surface`, `--color-text-primary`, `--color-text-secondary`) guarantee clear legibility:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">High Contrast Ratios:</strong> Body text (`text-slate-300 on slate-950/900`) achieves a contrast ratio exceeding 10.5:1, well above the 4.5:1 AA requirement.</li>
                  <li><strong className="text-white">Zero Color Reliance (`Criterion 1.4.1`):</strong> Critical status indicators (`RealTimeStatusIndicator` and `ConfidenceScoreIndicator`) never rely on red/green color shifts alone. Every status change is explicitly labeled with text (`"Connected" vs "Error"`) and accompanied by distinct vector iconography (`CheckCircle2, Radio, AlertTriangle`).</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="keyboard-focus" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  5. Persistent Keyboard Focus &amp; Navigation
                </h2>
                <p>
                  For users who navigate via keyboard shortcuts, switch devices, or screen reader tabbing (`Tab / Shift+Tab`), we enforce high-visibility focus rings (`focus-ring` utility class):
                </p>
                <p>
                  Whenever an input, button, or link receives focus, a bright 2px indigo/purple ring (`focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-950`) renders immediately around the element. No focus outlines are ever hidden or suppressed (`outline: none is forbidden without a replacement ring`).
                </p>
              </section>

              {/* Section 6 */}
              <section id="aria-live" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  6. Screen Reader &amp; ARIA Live Announcements
                </h2>
                <p>
                  Because real-time sign language recognition dynamically updates transcription logs as gestures are recognized, we integrate semantic ARIA live regions to keep blind and deaf-blind screen reader users informed:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">Polite Live Regions (`aria-live="polite"`):</strong> Newly recognized sentence transcripts are announced asynchronously by NVDA, VoiceOver, and JAWS without interrupting active typing.</li>
                  <li><strong className="text-white">Form Error Descriptors (`aria-describedby`):</strong> All input fields link dynamically to helper text (`id="-helper"`) and error messages (`id="-error"`) so screen readers instantly speak exact validation requirements upon focus.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="community-design" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  7. Deaf Community Co-Design &amp; Usability Lab
                </h2>
                <p>
                  Our design benchmarks are continuously reviewed at our Bengaluru Innovation Lab in partnership with local deaf advocacy organizations and sign language interpreters. We conduct monthly user testing sessions evaluating:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>Lighting and camera angle tolerances across diverse Indian households.</li>
                  <li>Latency perception thresholds during rapid dual-hand fingerspelling (`T=30 sliding windows`).</li>
                  <li>Visual clarity of real-time skeletal overlays (`MediaPipe 21 landmarks`) on mobile and desktop screens.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="report-barrier" className="space-y-6 pt-4 border-t border-slate-800">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  8. Report an Accessibility Barrier (`24-Hour SLA`)
                </h2>
                <p>
                  If you encounter any barrier that prevents you from fully perceiving, operating, or understanding our website or AI Studio, we want to hear from you immediately. We guarantee a direct engineering response within <strong className="text-white">24 business hours</strong> to triage and resolve reported barriers.
                </p>

                <Card variant="standard" className="p-6 bg-slate-900 border-slate-800 space-y-3">
                  <div className="font-bold text-white text-base">SignBridge AI Accessibility Engineering Team</div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div><strong className="text-slate-400">Head of Accessibility:</strong> Priya Sharma (`Lead UX & Accessibility Engineer`)</div>
                    <div><strong className="text-slate-400">Direct Accessibility Email:</strong> accessibility@signbridge.ai / support@signbridge.ai</div>
                    <div><strong className="text-slate-400">Video Relay Support:</strong> Available upon request during standard IST business hours</div>
                    <div><strong className="text-slate-400">Resolution SLA:</strong> Initial triage within 24 hours; critical barrier deployment within 72 hours</div>
                  </div>
                </Card>
              </section>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
