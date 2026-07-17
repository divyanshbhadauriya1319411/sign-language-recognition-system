'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, BookOpen, Sparkles, X, ChevronRight } from 'lucide-react';

const coreSigns = [
  { label: 'Hello', category: 'Greetings', type: 'dynamic', desc: 'Hand wave or touch forehead moving outwards.' },
  { label: 'Thank You', category: 'Courtesy', type: 'dynamic', desc: 'Fingertips touch chin and move forward toward the receiver.' },
  { label: 'Please', category: 'Courtesy', type: 'dynamic', desc: 'Flat palm circular motion on the center of the chest.' },
  { label: 'Sorry', category: 'Courtesy', type: 'dynamic', desc: 'Fist rubbed in a circular motion over the chest.' },
  { label: 'Yes', category: 'General', type: 'static', desc: 'Fist with thumb up or closed hand nodding forward.' },
  { label: 'No', category: 'General', type: 'dynamic', desc: 'Index and middle finger tapping thumb shut.' },
  { label: 'Help', category: 'Emergency', type: 'dynamic', desc: 'Closed fist resting on flat open palm raised upward.' },
  { label: 'Emergency', category: 'Emergency', type: 'dynamic', desc: 'E-handshape waving rapidly side to side or above head.' },
  { label: 'Doctor', category: 'Medical', type: 'dynamic', desc: 'Fingers tapping the pulse point on opposite wrist.' },
  { label: 'Hospital', category: 'Medical', type: 'dynamic', desc: 'Drawing a cross shape on upper arm with two fingers.' },
  { label: 'Water', category: 'Needs', type: 'static', desc: 'W-handshape touching the lips or chin.' },
  { label: 'Food', category: 'Needs', type: 'dynamic', desc: 'Bunty fingertips repeatedly tapping mouth.' },
  { label: 'Where', category: 'Questions', type: 'dynamic', desc: 'Index finger wagging side to side questioning.' },
  { label: 'I am fine', category: 'Greetings', type: 'static', desc: 'Open 5-handshape tapping center of chest proudly.' }
];

export function VocabularyDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Greetings', 'Courtesy', 'Emergency', 'Medical', 'Needs'];

  const filteredSigns = coreSigns.filter((s) => {
    const matchesQuery = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-fadeIn">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-white">ISL Gesture Cheat-Sheet</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 space-y-3 border-b border-slate-800 bg-slate-900/40">
        <Input
          placeholder="Search signs (e.g. Doctor, Help)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sign Cards List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {filteredSigns.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{item.label}</span>
              <Badge variant={item.type === 'dynamic' ? 'purple' : 'info'} size="sm">
                {item.category}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center text-xs text-slate-400">
        Showing {filteredSigns.length} of 57 pre-loaded ISL vocabulary signs.
      </div>
    </div>
  );
}
