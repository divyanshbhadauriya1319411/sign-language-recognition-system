'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import {
  ShieldCheck,
  Calendar,
  Share2,
  Printer,
  Lock,
  FileText,
  Mail,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';

/**
 * Public Privacy Policy Page (`/privacy`)
 * Documents our strict zero-video retention architecture, encrypted 126-dimensional float vector transmission,
 * HIPAA/FERPA/GDPR/DPDP compliance protocols, and desktop sticky Table of Contents.
 */
export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'overview', label: '1. Executive Summary & Zero-Video Policy' },
    { id: 'data-collected', label: '2. What Data We Collect vs. Process' },
    { id: 'mediapipe-processing', label: '3. Local WebRTC & MediaPipe Landmark Extraction' },
    { id: 'websocket-encryption', label: '4. WebSocket Encryption & Vector Transmission' },
    { id: 'mongodb-storage', label: '5. Storage & MongoDB Encryption at Rest' },
    { id: 'hipaa-compliance', label: '6. HIPAA, FERPA & India DPDP Act Compliance' },
    { id: 'user-rights', label: '7. Your Rights & Data Deletion Requests' },
    { id: 'contact-dpo', label: '8. Contact Data Protection Officer (`DPO`)' },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-16 md:pt-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="purple" size="md">Legal &amp; Privacy Protocol</Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Effective Date: July 15, 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            SignBridge AI Privacy Policy &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Zero-Video Guarantee
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We believe that accessibility tools should never compromise personal dignity or institutional privacy. This policy outlines exactly how our 3D spatial computer vision engine processes hand landmarks locally without ever saving or transmitting video streams.
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
                Contact DPO
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
                <Badge variant="success" size="sm">Sovereign Architecture</Badge>
                <h5 className="text-sm font-bold text-white">Need On-Prem Isolation?</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For hospitals and government defense units, our Enterprise tier deploys containerized Docker images inside your air-gapped intranet.
                </p>
                <Link href="/contact" className="block pt-1">
                  <Button variant="gradient" size="sm" className="w-full">
                    Request Air-Gapped K8s Spec
                  </Button>
                </Link>
              </Card>
            </aside>

            {/* Main Policy Document */}
            <article className="lg:col-span-9 space-y-12 text-left text-slate-300 leading-relaxed sm:text-body">
              {/* Section 1 */}
              <section id="overview" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  1. Executive Summary: The Zero-Video Guarantee
                </h2>
                <p>
                  At SignBridge AI (`SignBridge Technologies Pvt. Ltd.`), our core architectural mandate is straightforward: <strong className="text-emerald-400">we never record, store, or transmit your raw webcam video frames to our cloud servers.</strong>
                </p>
                <p>
                  When you open the SignBridge AI Studio or embed our real-time widget, video capture via `navigator.mediaDevices.getUserMedia` occurs strictly within your browser&apos;s local `WebRTC` sandbox. All spatial hand extraction is computed client-side using WebAssembly (`Wasm`) and WebGL accelerators. Once our local pre-processor extracts numerical 3D spatial coordinate matrices (`x, y, z` landmarks), the original video frames are immediately discarded from volatile RAM.
                </p>
              </section>

              {/* Alert Callout */}
              <AlertBanner type="info" title="Zero-Video Technical Verification">
                Security auditors and network administrators can inspect our network tab at any time: the only payloads transmitted across our WebSocket connections (`wss://api.signbridge.ai/ai/v1/stream`) are JSON/binary float arrays representing normalized skeletal coordinates (`126 float values per window`). No image bytes (`JPG, PNG, WebP`) or video streams (`H.264, VP8`) ever traverse the network.
              </AlertBanner>

              {/* Section 2 */}
              <section id="data-collected" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  2. What Data We Collect vs. What We Process Locally
                </h2>
                <p>
                  We maintain a strict separation between ephemeral processing data (`which never touches our storage disk`) and account telemetry (`which is encrypted at rest`).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <Card variant="standard" className="p-6 bg-slate-900/50 border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                      <Cpu className="w-5 h-5" />
                      Ephemeral Edge Data (`Never Saved`)
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
                      <li>Raw webcam RGB image frames and video streams</li>
                      <li>Un-normalized local browser camera resolution matrices</li>
                      <li>Skeletal landmark coordinates (`discarded immediately after sequence classification`)</li>
                      <li>Audio input streams (`when utilizing dual-way speech-to-sign modules`)</li>
                    </ul>
                  </Card>

                  <Card variant="standard" className="p-6 bg-slate-900/50 border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                      <Database className="w-5 h-5" />
                      Account &amp; Session Logs (`Encrypted`)
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
                      <li>Account registration metadata (`Name, Work Email, Organization Role`)</li>
                      <li>Translated text transcripts (`only when user explicitly clicks "Save Session History"`)</li>
                      <li>System latency metrics (`Prometheus connection duration, FPS averages`)</li>
                      <li>Billing and subscription status tokens (`handled via secure PCI-DSS Stripe endpoints`)</li>
                    </ul>
                  </Card>
                </div>
              </section>

              {/* Section 3 */}
              <section id="mediapipe-processing" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  3. Local WebRTC &amp; MediaPipe Landmark Extraction
                </h2>
                <p>
                  SignBridge AI utilizes Google&apos;s MediaPipe Hands model compiled directly to WebAssembly (`Wasm`). This means that when your webcam activates, the neural network evaluating your hand joints runs inside your browser process (`Chrome V8 / Safari Nitro engine`).
                </p>
                <p>
                  Our spatial normalization algorithm shifts the wrist joint (`joint 0`) to coordinates `(0,0,0)` and scales all Euclidean joint distances by palm span. Consequently, even if a third party intercepted the numerical vector payload, it would be mathematically impossible to reconstruct the user&apos;s face, background room details, or visual identity from the 126-dimensional skeleton matrix.
                </p>
              </section>

              {/* Section 4 */}
              <section id="websocket-encryption" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  4. WebSocket Encryption &amp; Vector Transmission
                </h2>
                <p>
                  When a sliding window of `T=30` frames accumulates (`approx. 500ms of continuous motion`), the normalized sequence vector is transmitted to our backend inference workers (`PyTorch Bi-LSTM / TCN engine`) to classify the gesture.
                </p>
                <p>
                  All WebSocket transport channels utilize Transport Layer Security (`TLS 1.3`) with perfect forward secrecy (`ECDHE-RSA-AES256-GCM-SHA384`). Once our backend model predicts the sign token (`e.g., "HOSPITAL"` or `"EMERGENCY"`), the inference worker returns the string token to your browser and immediately flushes the numerical vector from memory.
                </p>
              </section>

              {/* Section 5 */}
              <section id="mongodb-storage" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  5. Storage &amp; MongoDB Encryption at Rest
                </h2>
                <p>
                  For users on Pro or Enterprise tiers who opt to save their translation histories for medical documentation or academic review, text transcripts are stored in our isolated MongoDB 7.0 cluster.
                </p>
                <p>
                  We enforce field-level encryption (`CSFLE`) and disk-level AES-256 encryption at rest across all database instances. Access is restricted to authenticated account owners via short-lived JSON Web Tokens (`JWT`) and strict Role-Based Access Control (`RBAC`) policies (`Admin vs User`).
                </p>
              </section>

              {/* Section 6 */}
              <section id="hipaa-compliance" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  6. HIPAA, FERPA &amp; India DPDP Act Compliance
                </h2>
                <p>
                  SignBridge AI is built to satisfy stringent international medical and institutional privacy statutes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>
                    <strong className="text-white">HIPAA (`Health Insurance Portability and Accountability Act`):</strong> Because no raw video frames are saved or transmitted, and because text transcripts are isolated in dedicated tenants, SignBridge AI qualifies for formal Business Associate Agreements (`BAA`) with healthcare networks.
                  </li>
                  <li>
                    <strong className="text-white">FERPA (`Family Educational Rights and Privacy Act`):</strong> Educational classroom sessions do not expose student biometrics or video recordings to third-party databases.
                  </li>
                  <li>
                    <strong className="text-white">India DPDP Act 2023 (`Digital Personal Data Protection Act`):</strong> We respect explicit consent mandates, provide immediate withdrawal rights, and maintain local data residency options within our Indian AWS/GCP data centers in Mumbai and Bengaluru.
                  </li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="user-rights" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  7. Your Rights &amp; Data Deletion Requests
                </h2>
                <p>
                  Under applicable global data protection laws, you retain absolute sovereignty over your account data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li><strong className="text-white">Right to Access &amp; Portability:</strong> Export all your stored translation logs and account telemetry in clean CSV or JSON format directly from your dashboard settings.</li>
                  <li><strong className="text-white">Right to Erasure (`Right to be Forgotten`):</strong> Clicking &quot;Delete Account&quot; triggers an automated cascading purge across all MongoDB collections and backup snapshots within 24 hours.</li>
                  <li><strong className="text-white">Right to Opt-Out of AI Training:</strong> We never use user account transcripts or personal sessions to train commercial base models without explicit opt-in consent and financial grant agreements.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="contact-dpo" className="space-y-6 pt-4 border-t border-slate-800">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  8. Contact Our Data Protection Officer (`DPO`)
                </h2>
                <p>
                  If you have questions regarding our zero-video architecture, need to execute a formal HIPAA Business Associate Agreement, or wish to submit a formal data deletion inquiry, please contact our legal team:
                </p>

                <Card variant="standard" className="p-6 bg-slate-900 border-slate-800 space-y-3">
                  <div className="font-bold text-white text-base">SignBridge AI Office of Data Protection &amp; Legal Compliance</div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <div><strong className="text-slate-400">Chief Data Protection Officer:</strong> Adv. A. K. Nair</div>
                    <div><strong className="text-slate-400">Headquarters Address:</strong> SignBridge AI Innovation Labs, Electronic City Phase 1, Bengaluru, Karnataka 560100, India</div>
                    <div><strong className="text-slate-400">Legal Email:</strong> dpo@signbridge.ai / privacy@signbridge.ai</div>
                    <div><strong className="text-slate-400">SLA Response Time:</strong> Within 24 business hours for all compliance notices</div>
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
