'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  PlusCircle,
  Clock,
  Sparkles,
  Check,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export interface HistoryItem {
  id: string;
  gesture: string;
  confidence: number;
  timestamp: number;
}

export interface RecognitionHistoryProps {
  items: HistoryItem[];
  onInsertToBuilder: (gesture: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function RecognitionHistory({ items, onInsertToBuilder, onDeleteItem, onClearAll }: RecognitionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minConfFilter, setMinConfFilter] = useState<number>(0);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.gesture.toLowerCase().includes(searchQuery.toLowerCase());
    const confPct = item.confidence > 1 ? item.confidence : item.confidence * 100;
    const matchesFilter = confPct >= minConfFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInsert = (item: HistoryItem) => {
    onInsertToBuilder(item.gesture);
    setInsertedId(item.id);
    setTimeout(() => setInsertedId(null), 1500);
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const header = 'Timestamp,Gesture,Confidence\n';
    const rows = items
      .map((item) => {
        const timeStr = new Date(item.timestamp).toISOString();
        const confPct = item.confidence > 1 ? Math.round(item.confidence) : Math.round(item.confidence * 100);
        return `"${timeStr}","${item.gesture.replace(/"/g, '""')}",${confPct}%`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SignBridge-Recognition-History-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    if (items.length === 0) return;
    const lines = items
      .map((item) => {
        const timeStr = new Date(item.timestamp).toLocaleTimeString();
        const confPct = item.confidence > 1 ? Math.round(item.confidence) : Math.round(item.confidence * 100);
        return `[${timeStr}] ${item.gesture} (Confidence: ${confPct}%)`;
      })
      .join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SignBridge-Recognition-Log-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4 bg-slate-900/90 border-slate-800 flex flex-col justify-between shadow-xl h-full min-h-[480px] max-h-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <History className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Temporal History Log</h3>
            <p className="text-[11px] text-slate-400">Past detections ({items.length} total)</p>
          </div>
        </div>

        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            className="text-slate-400 hover:text-rose-400 text-xs"
          >
            Clear Log
          </Button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recognized signs..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-semibold text-[11px]">Min Confidence:</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { label: 'All', val: 0 },
              { label: '75%+', val: 75 },
              { label: '90%+', val: 90 },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setMinConfFilter(f.val)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                  minConfFilter === f.val
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-500 my-auto">
            <History className="w-10 h-10 stroke-1 text-slate-600" />
            <p className="text-xs font-medium">
              {items.length === 0
                ? 'No recognition events logged yet. Active detections will appear here automatically.'
                : 'No log items match your search filter criteria.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const confPct = item.confidence > 1 ? Math.round(item.confidence) : Math.round(item.confidence * 100);
            const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between gap-3 transition-all group"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[160px] sm:max-w-[200px]">
                      {item.gesture}
                    </span>
                    <Badge variant={confPct >= 85 ? 'success' : confPct >= 65 ? 'info' : 'purple'} size="sm">
                      <span className="font-mono text-[10px]">{confPct}%</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{timeStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleInsert(item)}
                    className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold ${
                      insertedId === item.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    }`}
                    title="Insert Sign into Sentence Builder"
                  >
                    {insertedId === item.id ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    <span className="hidden xl:inline">{insertedId === item.id ? 'Added' : 'Insert'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Export Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
        <span className="text-[11px] font-mono text-slate-400">Export Log:</span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={items.length === 0}
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
          >
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTXT}
            disabled={items.length === 0}
            icon={<FileText className="w-3.5 h-3.5 text-indigo-400" />}
          >
            TXT
          </Button>
        </div>
      </div>
    </Card>
  );
}
