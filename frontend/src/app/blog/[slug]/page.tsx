'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { BLOG_POSTS, BlogPostData } from '@/data/blogData';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  Cpu,
  ArrowRight,
} from 'lucide-react';

/**
 * Public Blog Article Detail Page (`/blog/[slug]`)
 * Features rich reading typography, technical code blocks, a desktop sticky Table of Contents (`TOC`),
 * author bio card, and related articles recommendations.
 */
export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : 'spatio-temporal-3d-recognition-pipeline';

  // Find post or fallback to featured post
  const post: BlogPostData = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. ARTICLE HERO HEADER */}
      <section className="relative pt-12 pb-16 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research Blog
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors focus-ring"
                aria-label="Print or save article as PDF"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="purple" size="md">{post.categoryLabel}</Badge>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedDate}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18]">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          </div>

          {/* Author Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 font-bold font-mono text-base flex items-center justify-center text-white border border-indigo-400/30 shadow-md">
              {post.author.avatar}
            </div>
            <div>
              <div className="text-base font-bold text-white">{post.author.name}</div>
              <div className="text-xs font-mono text-slate-400">{post.author.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT & STICKY TOC LAYOUT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Desktop Sticky Sidebar Table of Contents */}
            <aside className="lg:col-span-3 hidden lg:block sticky top-24 space-y-6 text-left">
              <Card variant="standard" className="p-5 bg-slate-900/60 border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Table of Contents
                </h4>
                <nav className="space-y-2.5 text-xs font-medium text-slate-300">
                  {[
                    { id: 'introduction', label: '1. Introduction & Challenge' },
                    { id: 'architecture', label: '2. Spatial Normalization (0,0,0)' },
                    { id: 'sliding-buffer', label: '3. Circular Buffer (T=30 Windows)' },
                    { id: 'code-impl', label: '4. PyTorch Bi-LSTM Implementation' },
                    { id: 'debouncing', label: '5. Consecutive Threshold Debouncing' },
                    { id: 'conclusion', label: '6. Conclusion & Next Steps' },
                  ].map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className="block hover:text-indigo-400 transition-colors py-0.5 truncate"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </Card>

              <Card variant="standard" className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30 space-y-3 text-left">
                <Badge variant="info" size="sm">Try It Live</Badge>
                <h5 className="text-sm font-bold text-white">Experience the AI Engine</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Test the exact 3D spatial recognition pipeline described in this paper inside your browser right now.
                </p>
                <Link href="/studio" className="block pt-1">
                  <Button variant="gradient" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />} className="w-full">
                    Launch Live Studio
                  </Button>
                </Link>
              </Card>
            </aside>

            {/* Main Article Prose Content */}
            <article className="lg:col-span-9 space-y-12 text-left text-slate-300 leading-relaxed sm:text-body">
              {/* Section 1: Introduction */}
              <section id="introduction" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  1. Introduction: Why 2D Vision Fails for Continuous Sign Language
                </h2>
                <p>
                  For over two decades, accessible sign language translation attempts have struggled with a fundamental bottleneck: relying on static 2D image snapshots (`RGB pixel classification`). While convolutional neural networks (`CNNs`) can easily classify static fingerspelling letters (`A, B, C`), true natural sign languages such as Indian Sign Language (`ISL`) are inherently <strong className="text-white">dynamic 3D spatio-temporal trajectories</strong>.
                </p>
                <p>
                  In continuous sign language, identical hand shapes can convey vastly different meanings depending on whether the hands move outward from the chest, rotate inward along the wrist, or accelerate upward toward the forehead. To solve this without forcing users to wear expensive data gloves or specialized depth cameras, SignBridge AI engineered a lightweight, browser-native 3D spatial tracking pipeline.
                </p>
              </section>

              {/* Alert Callout */}
              <AlertBanner type="info" title="Privacy-First Edge Architecture">
                All spatial landmark extraction runs locally on the user&apos;s device via WebGL/WebAssembly. Only lightweight numerical coordinate matrices (`126 float dimensions per frame`) are transmitted over TLS WebSockets for classification. Zero video frames are stored or sent to external servers.
              </AlertBanner>

              {/* Section 2: Spatial Normalization */}
              <section id="architecture" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  2. Spatial Landmark Normalization and Wrist Anchoring (`0,0,0`)
                </h2>
                <p>
                  As raw webcam frames enter the browser viewport at 60 FPS, we utilize Google&apos;s MediaPipe Hands model to detect 21 3D spatial landmarks per hand (`Wrist, Thumb, Index, Middle, Ring, Pinky joints`). Each landmark produces three coordinates (`x, y, z`), where `z` estimates relative depth from the camera sensor plane.
                </p>
                <p>
                  To make the neural network invariant to camera distance (`e.g. sitting close vs far from the laptop`) and user hand size (`child vs adult`), our pre-processing engine applies Euclidean normalization before inference:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>
                    <strong className="text-white">Wrist Origin Translation:</strong> The wrist joint (`landmark 0`) coordinate is subtracted from every other joint, centering the hand anchor at exactly `(0, 0, 0)`.
                  </li>
                  <li>
                    <strong className="text-white">Euclidean Scaling:</strong> Every joint coordinate vector is divided by the scalar distance between the wrist and the middle finger MCP joint (`landmark 9`), ensuring all hands scale to a uniform unit sphere.
                  </li>
                </ul>
              </section>

              {/* Section 3: Sliding Circular Buffer */}
              <section id="sliding-buffer" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  3. Circular Memory Buffer (`T=30 Consecutive Windows`)
                </h2>
                <p>
                  To capture the temporal trajectory of a gesture, our client-side runtime maintains a sliding circular memory buffer holding exactly <strong className="text-white">T=30 consecutive frames</strong> (approx. 500 milliseconds of motion). For dual-hand recognition, each frame contributes a 126-dimensional float vector (`2 hands x 21 landmarks x 3 coordinates`).
                </p>
                <p>
                  As each new frame arrives, the oldest frame (`t-30`) is evicted, and the updated `[30 x 126]` matrix tensor is serialized over binary WebSocket to our asynchronous FastAPI inference workers (`/ai/v1/stream`).
                </p>
              </section>

              {/* Section 4: Code Implementation */}
              <section id="code-impl" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  4. PyTorch Bi-LSTM Classification Architecture
                </h2>
                <p>
                  At the backend inference layer, the normalized `[30 x 126]` temporal sequence tensor is evaluated by our custom Hybrid Convolutional / Bidirectional LSTM architecture:
                </p>

                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 font-mono text-xs sm:text-sm text-slate-300">
                  <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-400" />
                      models/spatio_temporal_classifier.py
                    </span>
                    <span className="text-xs text-purple-400">PyTorch 2.4</span>
                  </div>
                  <pre className="p-4 overflow-x-auto leading-relaxed">
                    <code>{`import torch
import torch.nn as nn

class SpatioTemporalISLClassifier(nn.Module):
    def __init__(self, input_dim=126, hidden_dim=256, num_classes=500):
        super(SpatioTemporalISLClassifier, self).__init__()
        # Spatial feature extractor along temporal axis
        self.conv1d = nn.Conv1d(in_channels=input_dim, out_channels=128, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        
        # Bidirectional LSTM to capture forward & backward trajectory context
        self.lstm = nn.LSTM(
            input_size=128,
            hidden_size=hidden_dim,
            num_layers=2,
            batch_first=True,
            bidirectional=True
        )
        
        # Final classification head (2 * hidden_dim due to bi-directional concatenation)
        self.fc = nn.Linear(hidden_dim * 2, num_classes)

    def forward(self, x):
        # x shape: [batch_size, seq_len=30, input_dim=126]
        x = x.permute(0, 2, 1)  # -> [batch, 126, 30] for Conv1d
        x = self.dropout(self.relu(self.conv1d(x)))
        x = x.permute(0, 2, 1)  # -> [batch, 30, 128] for LSTM
        
        lstm_out, (hn, cn) = self.lstm(x)
        # Extract last forward and backward hidden state
        final_state = torch.cat((hn[-2, :, :], hn[-1, :, :]), dim=1)
        logits = self.fc(final_state)
        return logits`}</code>
                  </pre>
                </div>
              </section>

              {/* Section 5: Debouncing */}
              <section id="debouncing" className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  5. Consecutive Threshold Debouncing for Zero Text Flicker
                </h2>
                <p>
                  Even with 98.4% validation accuracy, continuous real-time video streams inevitably encounter momentary transition frames when the user&apos;s hands move between signs. During these split-second transitions, raw softmax logits might spike briefly for an unrelated sign.
                </p>
                <p>
                  To ensure that false text tokens never flicker onto the transcript, our stream processor enforces a strict <strong className="text-white">Consecutive Frame Debouncing Rule</strong>:
                </p>
                <Card variant="standard" className="p-5 bg-slate-900/40 border-slate-800 space-y-2">
                  <div className="text-sm font-mono font-bold text-indigo-400">
                    Debouncing Decision Rule (`Threshold = 85%, Frames = 3`)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    A sign class $S_k$ is committed to the NLP sentence builder only when the highest softmax confidence score exceeds `0.85` across at least <strong className="text-white">3 consecutive sliding window evaluations</strong> (`approx. 150ms of stable prediction`).
                  </p>
                </Card>
              </section>

              {/* Section 6: Conclusion */}
              <section id="conclusion" className="space-y-6 pt-4 border-t border-slate-800">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  6. Conclusion &amp; Future Directions
                </h2>
                <p>
                  By transforming raw 2D webcam streams into normalized 3D spatio-temporal vectors and evaluating them over continuous circular memory buffers, SignBridge AI bridges the communication gap with enterprise reliability and zero hardware hurdles.
                </p>
                <p>
                  Our research team is currently expanding our reference dictionary toward 2,000 regional ISL signs and optimizing our on-premise Kubernetes inference workers for emergency medical centers.
                </p>

                {/* Author Bio Box */}
                <Card variant="standard" className="p-6 bg-slate-900 border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-8">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 font-bold font-mono text-xl flex items-center justify-center text-white border border-indigo-400/30 shrink-0">
                    {post.author.avatar}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-lg font-bold text-white">{post.author.name}</h4>
                      <Badge variant="purple" size="sm">{post.author.role}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Dr. Krishnan leads SignBridge AI&apos;s computer vision and NLP research labs in Bengaluru. Prior to founding SignBridge, she held senior AI architecture roles focusing on assistive technologies and clinical diagnostics.
                    </p>
                  </div>
                </Card>
              </section>
            </article>
          </div>
        </div>
      </section>

      {/* 3. RELATED ARTICLES GRID */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="info" size="sm">Read Next</Badge>
              <h3 className="text-2xl font-extrabold text-white">Related Research &amp; Updates</h3>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rel) => (
              <Card
                key={rel.slug}
                variant="standard"
                className="p-6 space-y-4 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Badge variant="purple" size="sm">{rel.categoryLabel}</Badge>
                  <Link href={`/blog/${rel.slug}`}>
                    <h4 className="text-base font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{rel.publishedDate}</span>
                  <span className="text-indigo-400 font-semibold">{rel.readTime}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
