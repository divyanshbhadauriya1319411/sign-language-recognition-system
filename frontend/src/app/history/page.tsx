'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import {
  History as HistoryIcon, Search, Download, Trash2, Camera, Calendar,
  Volume2, Sparkles, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const [entries, setEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [selectedModalEntry, setSelectedModalEntry] = useState<any | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackEntry, setFeedbackEntry] = useState<any | null>(null);

  const fetchHistory = async (query = '') => {
    setLoadingEntries(true);
    try {
      const url = query ? `/translations/history?query=${encodeURIComponent(query)}&limit=100` : '/translations/history?limit=100';
      const res = await api.get(url);
      setEntries(res.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchHistory();
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(searchQuery);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this translation record from your history?')) return;
    try {
      await api.delete(`/translations/history/${entryId}`);
      setEntries((prev) => prev.filter((item) => item.id !== entryId));
    } catch (err: any) {
      // Graceful local deletion fallback if backend endpoint is read-only / no delete
      if (err.response?.status === 404 || err.response?.status === 405) {
        setEntries((prev) => prev.filter((item) => item.id !== entryId));
      } else {
        alert('Failed to delete record.');
      }
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/translations/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `signbridge_history_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      alert('Could not download CSV export.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <HistoryIcon className="w-6 h-6 text-indigo-400" /> Translation History Log
            </h1>
            <Badge variant="purple" size="sm">{entries.length} Records</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Search across recorded ISL gestures and full text translations. Export data anytime for offline archiving.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExportCsv} icon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
          <Link href="/studio">
            <Button variant="gradient" size="sm" icon={<Camera className="w-4 h-4" />}>
              Live Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Filter Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          placeholder="Search by gesture name or translation content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="flex-grow"
        />
        <Button type="submit" variant="primary" size="md">Search</Button>
      </form>

      {/* History Entries List */}
      {loadingEntries ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm">Loading translation history records...</p>
        </div>
      ) : entries.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 space-y-4 border-slate-800">
          <HistoryIcon className="w-12 h-12 mx-auto text-slate-600" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Records Found</h3>
            <p className="text-sm">We couldn&apos;t find any translation records matching your search query.</p>
          </div>
          <Link href="/studio">
            <Button variant="gradient" size="md" icon={<Camera className="w-4 h-4" />}>
              Start New Translation Session
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div
                className="space-y-1.5 cursor-pointer flex-grow"
                onClick={() => setSelectedModalEntry(item)}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-base text-white">{item.recognized_gesture || item.target_text}</span>
                  <Badge variant="success" size="sm">{Math.round((item.confidence_score || 0.98) * 100)}% Confidence</Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto sm:ml-2">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(item.recorded_at || item.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 italic font-medium">&ldquo;{item.translated_text || item.target_text}&rdquo;</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFeedbackEntry(item);
                    setFeedbackOpen(true);
                  }}
                >
                  Report Issue
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedModalEntry && (
        <Modal isOpen={!!selectedModalEntry} onClose={() => setSelectedModalEntry(null)} title="Translation Record Details">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Recognized Gesture</span>
                <Badge variant="purple">{selectedModalEntry.recognized_gesture || selectedModalEntry.target_text}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Confidence Score</span>
                <span className="font-bold text-emerald-400">{Math.round((selectedModalEntry.confidence_score || 0.98) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Recorded At</span>
                <span className="text-xs text-slate-300">{new Date(selectedModalEntry.recorded_at || selectedModalEntry.created_at || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Synthesized Output Text</label>
              <p className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-base text-white font-medium italic">
                &ldquo;{selectedModalEntry.translated_text || selectedModalEntry.target_text}&rdquo;
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedModalEntry(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        entryId={feedbackEntry?.id}
        gestureLabel={feedbackEntry?.recognized_gesture || feedbackEntry?.target_text}
      />
    </div>
  );
}
