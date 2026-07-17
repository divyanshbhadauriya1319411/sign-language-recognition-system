'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptySearchState } from '@/components/empty-states/EmptyState';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  Share2,
  TrendingUp,
} from 'lucide-react';

import { BLOG_POSTS, BlogPostData } from '@/data/blogData';

/**
 * Public Blog Index Page (`/blog`)
 * Features a hero banner for our featured breakthrough article, category filtering chips,
 * instant search across abstracts, and rich card layout.
 */
export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Articles (6)' },
    { id: 'engineering', label: 'Engineering & AI' },
    { id: 'accessibility', label: 'Accessibility & Ethics' },
    { id: 'case_study', label: 'Case Studies & Grants' },
    { id: 'product', label: 'Product Updates' },
  ];

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-purple-600/20 to-indigo-500/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="purple" size="md">Engineering &amp; Research Blog</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.14]">
            Research, AI Insights &amp;{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Accessibility Stories
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Deep technical dives into 3D computer vision pipelines, real-time debouncing algorithms, and institutional case studies from the engineering team.
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto pt-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles by title, topic, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-base text-white placeholder:text-slate-500 shadow-xl focus-ring transition-all"
              aria-label="Search blog articles"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. FEATURED POST HERO BANNER (Only when not searching/filtering) */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="py-16 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">Featured Research Paper</span>
              </div>
            </div>

            <Card variant="standard" className="p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/30 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-5 text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="purple" size="sm">{featuredPost.categoryLabel}</Badge>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.publishedDate}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white hover:text-indigo-300 transition-colors tracking-tight leading-tight">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 font-bold font-mono text-sm flex items-center justify-center text-white border border-indigo-400/30">
                        {featuredPost.author.avatar}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">{featuredPost.author.name}</div>
                        <div className="text-xs text-slate-400">{featuredPost.author.role}</div>
                      </div>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button variant="gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                        Read Deep Dive
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
                  <div className="w-full aspect-square rounded-2xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col justify-between font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>PyTorch Bi-LSTM Model</span>
                      <span className="text-emerald-400 font-bold">ACC: 98.4%</span>
                    </div>
                    <div className="space-y-2 text-indigo-300/80 text-left overflow-hidden">
                      <div><span className="text-purple-400">class</span> <span className="text-amber-300">TemporalConvNet</span>(nn.Module):</div>
                      <div className="pl-3">self.conv1 = nn.Conv1d(126, 256, k=3)</div>
                      <div className="pl-3">self.lstm = nn.LSTM(256, 128, bi=True)</div>
                      <div className="pl-3 text-slate-500"># Sliding buffer T=30 windows</div>
                      <div className="pl-3 text-slate-500"># Debounced output logits</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center text-slate-300 font-semibold">
                      Live Inference: 38ms
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 3. CATEGORY CHIPS BAR */}
      <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-3.5 px-4 overflow-x-auto select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[38px] inline-flex items-center gap-1.5 focus-ring ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. BLOG POSTS GRID */}
      <section className="py-20 border-b border-slate-800/80 min-h-[550px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.slug}
                  variant="standard"
                  className="p-6 space-y-5 bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          post.category === 'engineering'
                            ? 'purple'
                            : post.category === 'accessibility'
                            ? 'info'
                            : post.category === 'case_study'
                            ? 'success'
                            : 'accent'
                        }
                        size="sm"
                      >
                        {post.categoryLabel}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{post.readTime}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 font-bold font-mono text-xs flex items-center justify-center text-slate-300 border border-slate-700">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{post.author.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{post.publishedDate}</div>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="text-indigo-400 hover:text-indigo-300 p-1">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptySearchState
              query={searchQuery}
              onClear={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            />
          )}
        </div>
      </section>

      {/* 5. NEWSLETTER SUBSCRIPTION BANNER */}
      <section className="py-20 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="purple" size="md">Stay Updated</Badge>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Subscribe to AI &amp; Accessibility Research Updates
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get bi-weekly notifications on new model releases, open-source dataset drops, and institutional case studies directly from our engineering team.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/contact">
              <Button variant="gradient" size="lg" icon={<Sparkles className="w-4 h-4" />} className="shadow-lg shadow-indigo-500/25">
                Subscribe to Research Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
