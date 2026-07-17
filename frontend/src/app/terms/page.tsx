'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import {
  FileText,
  Calendar,
  Printer,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Scale,
  AlertTriangle,
} from 'lucide-react';

/**
 * Public Terms of Service Page (`/terms`)
 * Documents our SaaS subscription agreements, acceptable use policies, medical disclaimers,
 * liability thresholds, and desktop sticky Table of Contents.
 */
export default function TermsOfServicePage() {
  const sections = [
    { id: 'acceptance', label: '1. Acceptance of Terms & Account Creation' },
    { id: 'service-scope', label: '2. Scope of Service & License Grant' },
    { id: 'acceptable-use', label: '3. Acceptable Use Policy & Restrictions' },
    { id: 'medical-disclaimer', label: '4. Medical & Emergency Diagnostic Disclaimer' },
    { id: 'subscriptions', label: '5. Subscriptions, Billing & Cancellation' },
    { id: 'ip-ownership', label: '6. Intellectual Property & Custom Models' },
    { id: 'limitation-liability', label: '7. Limitation of Liability & Indemnification' },
    { id: 'governing-law', label: '8. Governing Law & Dispute Resolution' },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-16 md:pt-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="purple" size="md">Legal Agreement</Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Effective Date: July 15, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            SignBridge AI Terms of Service &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              User License Agreement
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing the SignBridge AI platform. By using our web studio, APIs, or mobile widgets, you agree to bound by these subscription and operational conditions.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white inline-flex items-center gap-2 transition-colors focus-ring"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              Print / Download PDF
            </button>
            <Link href="/contact">
              <Button variant="outline" size="md" icon={<Mail className="w-4 h-4" />}>
                Legal Inquiries
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
                <Badge variant="warning" size="sm">Medical Notice</Badge>
                <h5 className="text-sm font-bold text-white">Assistive Platform Only</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  SignBridge AI provides communication facilitation. Always verify critical surgical or diagnostic instructions with human interpreters.
                </p>
              </Card>
            </aside>

            {/* Main Terms Document */}
            <article className="lg:col-span-9 space-y-12 text-left text-slate-300 leading-relaxed sm:text-body">
              {/* Section 1 */}
              <section id="acceptance" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  1. Acceptance of Terms &amp; Account Creation
                </h2>
                <p>
                  These Terms of Service (`Terms`) constitute a binding legal agreement between you (`the User or subscribing Institution`) and SignBridge Technologies Pvt. Ltd. (`SignBridge AI`). By registering an account, integrating our WebSocket stream endpoints (`/ai/v1/stream`), or utilizing our public web demo, you acknowledge that you have read, understood, and agreed to these Terms.
                </p>
                <p>
                  If you are entering into these Terms on behalf of a corporation, hospital network, or educational university, you represent that you hold the legal authority to bind that institutional entity to this agreement.
                </p>
              </section>

              {/* Section 2 */}
              <section id="service-scope" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  2. Scope of Service &amp; License Grant
                </h2>
                <p>
                  Subject to your compliance with these Terms and active subscription payments, SignBridge AI grants you a limited, non-exclusive, non-transferable, revocable license to access our real-time 3D spatial sign language recognition platform, neural TTS synthesis engines, and interactive learning tools.
                </p>
                <p>
                  The software is licensed as a cloud service (`SaaS`), or as a containerized on-premise deployment for Enterprise tier subscribers. You may not sublicense, resell, or redistribute our proprietary PyTorch Bi-LSTM weights or pre-processed spatial normalization matrices without written authorization.
                </p>
              </section>

              {/* Section 3 */}
              <section id="acceptable-use" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  3. Acceptable Use Policy &amp; Operational Restrictions
                </h2>
                <p>
                  To ensure platform stability and ethical AI deployment across our user community, you agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">Reverse Engineering:</strong> Attempting to decompile, disassemble, or reverse engineer the neural network weights, MediaPipe spatial normalization layers, or WebSocket binary protocols.</li>
                  <li><strong className="text-white">Abusive Scraping or Denial of Service:</strong> Flooding our WebSocket endpoints with synthetic, high-frequency frame payloads (`exceeding 60 FPS without Enterprise rate limits`) to disrupt service availability.</li>
                  <li><strong className="text-white">Deceptive Synthesis:</strong> Utilizing our neural voice TTS engines (`Neerja / Prabhat`) to impersonate real individuals, generate fraudulent voice biometrics, or spread malicious misinformation.</li>
                  <li><strong className="text-white">Unlicensed Commercial Resale:</strong> Packaging the Free Personal tier inside commercial telehealth or video conferencing software without upgrading to an appropriate Enterprise license.</li>
                </ul>
              </section>

              {/* Alert Callout */}
              <AlertBanner type="warning" title="Critical Medical & Diagnostic Disclaimer">
                SignBridge AI is designed as an assistive communication enhancement tool to bridge daily conversations between deaf/hard-of-hearing individuals and non-signers. <strong className="text-white">It is NOT a certified medical device under FDA or CDSCO regulations.</strong> While our spatio-temporal engine achieves high accuracy, AI recognition can occasionally misinterpret similar gestures. In high-stakes emergency room triage, surgical informed consent, or courtroom legal proceedings, SignBridge AI must be used in conjunction with or verified by a certified human sign language interpreter.
              </AlertBanner>

              {/* Section 4 */}
              <section id="medical-disclaimer" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  4. Medical &amp; Emergency Diagnostic Disclaimer
                </h2>
                <p>
                  By utilizing SignBridge AI in healthcare or clinical settings, you explicitly acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>The platform does not provide medical advice, diagnosis, or clinical treatment.</li>
                  <li>SignBridge AI shall not be held liable for any misinterpretation of patient symptoms, medication dosages, or clinical instructions resulting from AI transcription anomalies.</li>
                  <li>Healthcare providers remain solely responsible for validating patient understanding and maintaining standard clinical standard-of-care protocols.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="subscriptions" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  5. Subscriptions, Billing &amp; Cancellation
                </h2>
                <p>
                  SignBridge AI offers both free and paid subscription tiers (`Free Personal, Pro Educator, and Enterprise SaaS`):
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">Billing Cycle:</strong> Paid subscriptions are billed in advance on a monthly or annual basis via secure PCI-DSS Stripe payment gateways.</li>
                  <li><strong className="text-white">14-Day Free Trial:</strong> New subscribers to the Pro Educator tier receive a 14-day complimentary trial. If not canceled prior to the 14th day, standard monthly billing commences automatically.</li>
                  <li><strong className="text-white">Cancellation &amp; Refunds:</strong> You may cancel your subscription at any time from your account settings. Subscriptions remain active through the end of the paid cycle. We do not provide prorated refunds for mid-cycle cancellations unless required by mandatory statutory law.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="ip-ownership" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  6. Intellectual Property &amp; Custom Models
                </h2>
                <p>
                  All rights, title, and interest in and to the SignBridge AI platform (`including our frontend design system, spatial normalization code, PyTorch model architectures, and brand trademarks`) remain the exclusive property of SignBridge Technologies Pvt. Ltd.
                </p>
                <p>
                  For Enterprise subscribers who commission custom domain vocabulary training (`e.g., specific hospital or university sign dictionaries`), the custom neural network weights fine-tuned specifically for your organization shall remain dedicated solely to your institutional tenant and shall not be shared across public commercial pools.
                </p>
              </section>

              {/* Section 7 */}
              <section id="limitation-liability" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  7. Limitation of Liability &amp; Indemnification
                </h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SIGNBRIDGE AI, ITS DIRECTORS, EMPLOYEES, OR RESEARCH PARTNERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (`INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS CONTINUITY`) ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM.
                </p>
                <p>
                  Our total cumulative liability to you for any and all claims arising under these Terms during the twelve (`12`) months preceding the incident shall not exceed the total subscription fees actually paid by you to SignBridge AI during that specific period (`or $100 USD if utilizing the Free Personal tier`).
                </p>
              </section>

              {/* Section 8 */}
              <section id="governing-law" className="space-y-6 pt-4 border-t border-slate-800">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  8. Governing Law &amp; Dispute Resolution
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal suit, arbitration, or formal proceeding arising out of or relating to these Terms shall be instituted exclusively in the competent courts located in Bengaluru, Karnataka, India.
                </p>

                <Card variant="standard" className="p-6 bg-slate-900 border-slate-800 space-y-3">
                  <div className="font-bold text-white text-base">SignBridge AI Legal Department</div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div><strong className="text-slate-400">Head of Legal:</strong> Adv. K. R. Sundaram</div>
                    <div><strong className="text-slate-400">Corporate Headquarters:</strong> SignBridge AI Innovation Labs, Electronic City Phase 1, Bengaluru, Karnataka 560100, India</div>
                    <div><strong className="text-slate-400">Legal Contact:</strong> legal@signbridge.ai</div>
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
