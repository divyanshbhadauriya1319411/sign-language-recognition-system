'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  AlertTriangle,
  Home,
  Sparkles,
  HelpCircle,
  Search,
  BookOpen,
  ArrowLeft,
  Compass,
} from 'lucide-react';

/**
 * Public 404 Not Found Page (`/not-found`)
 * Features an accessible, friendly error layout with quick navigation destinations,
 * instant search redirect to FAQ, and direct studio return actions.
 */
export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/faq?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        {/* Error Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-4">
          <Badge variant="purple" size="md">Error 404 &bull; Route Missing</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Page or Gesture Route{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Not Found
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            The page you are looking for may have been moved, renamed, or is currently undergoing maintenance. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative pt-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
          <input
            type="text"
            placeholder="Search our FAQ or knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm sm:text-base text-white placeholder:text-slate-500 shadow-xl focus-ring transition-all"
            aria-label="Search FAQ or site routes"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors focus-ring"
          >
            Search
          </button>
        </form>

        {/* Quick Destination Cards Grid */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          {[
            {
              title: 'Return to Landing Page',
              desc: 'Explore product demo, live 3D webcam mockup, and architecture overview.',
              icon: Home,
              href: '/',
              badge: 'Home',
              variant: 'purple' as const,
            },
            {
              title: 'Launch Live AI Studio',
              desc: 'Turn on your camera right now to test real-time ISL recognition.',
              icon: Sparkles,
              href: '/studio',
              badge: 'Interactive Demo',
              variant: 'accent' as const,
            },
            {
              title: 'Browse Capabilities & Features',
              desc: 'Deep dive into MediaPipe tracking, debouncing, and custom training.',
              icon: BookOpen,
              href: '/features',
              badge: 'Capabilities',
              variant: 'info' as const,
            },
            {
              title: 'Visit FAQ & Support Center',
              desc: 'Check technical response SLAs, HIPAA compliance, or contact engineers.',
              icon: HelpCircle,
              href: '/faq',
              badge: 'Support',
              variant: 'success' as const,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="block group">
                <Card
                  variant="standard"
                  className="p-5 bg-slate-900/60 border-slate-800 group-hover:border-slate-700 transition-all space-y-2 h-full flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={item.variant} size="sm">{item.badge}</Badge>
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom Back Button */}
        <div className="pt-4 flex justify-center">
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
          >
            Go Back to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}
