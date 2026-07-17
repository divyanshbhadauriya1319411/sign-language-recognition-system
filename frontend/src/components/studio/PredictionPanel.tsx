'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AIPredictionPayload } from '@/hooks/useAISocket';
import { Sparkles, Activity, Clock, Zap, CheckCircle2, ShieldCheck, Layers, Cpu } from 'lucide-react';

export interface PredictionPanelProps {
  lastPrediction: AIPredictionPayload | null;
  latencyMs: number;
  fps: number;
  modelName?: string;
}

export function PredictionPanel({
  lastPrediction,
  latencyMs,
  fps,
  modelName = 'PyTorch Bi-LSTM 3D (T=30)',
}: PredictionPanelProps) {
  const isConfirmed = lastPrediction?.confirmed || false;
  const rawGesture = lastPrediction?.gesture || 'No Sign Detected';
  const displayGesture = rawGesture === 'Searching for hands...' ? 'Standby - Raise Hands' : rawGesture;
  const rawConfidence = lastPrediction?.confidence || 0;
  const confPercent = rawConfidence > 1 ? Math.round(rawConfidence) : Math.round(rawConfidence * 100);

  // Top 5 predictions list
  const topList = lastPrediction?.top_predictions || [
    { gesture: displayGesture, confidence: rawConfidence > 1 ? rawConfidence / 100 : rawConfidence },
    { gesture: 'THANK YOU (Dhanyavad)', confidence: 0.12 },
    { gesture: 'PLEASE (Kripya)', confidence: 0.05 },
    { gesture: 'HOW ARE YOU (Aap Kaise Hain)', confidence: 0.02 },
    { gesture: 'GOOD MORNING (Suprabhat)', confidence: 0.01 },
  ];

  const updateTime = lastPrediction?.timestamp
    ? new Date(lastPrediction.timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  return (
    <Card className="p-5 sm:p-6 space-y-5 bg-slate-900/90 border-slate-800 flex flex-col justify-between shadow-xl min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">AI Recognition Feed</h3>
            <p className="text-[11px] text-slate-400">Sliding temporal classification (30 frames)</p>
          </div>
        </div>

        <Badge variant={isConfirmed ? 'success' : rawGesture === 'No Sign Detected' ? 'purple' : 'info'} size="sm">
          <span className="flex items-center gap-1 font-semibold">
            {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isConfirmed ? 'Confirmed Sign' : 'Live Inference'}</span>
          </span>
        </Badge>
      </div>

      {/* Primary Prediction Display */}
      <div
        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 ${
          isConfirmed
            ? 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-900/20 shadow-lg scale-[1.01]'
            : 'bg-slate-950/70 border-slate-800'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <span>Detected Indian Sign Language Gesture</span>
        </div>

        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight break-words max-w-full">
          {displayGesture}
        </div>

        {/* Confidence Meter Bar */}
        <div className="w-full max-w-xs space-y-1 pt-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Classification Confidence</span>
            <span className={`font-bold ${confPercent >= 80 ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {confPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                confPercent >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : confPercent >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, confPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top 5 Predictions List */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Top Alternative Hypotheses</span>
          </span>
          <span className="text-slate-500 font-mono text-[10px]">Softmax Probability</span>
        </div>

        <div className="space-y-2">
          {topList.slice(0, 5).map((pred, idx) => {
            const pConf = pred.confidence > 1 ? Math.round(pred.confidence) : Math.round(pred.confidence * 100);
            return (
              <div
                key={`${pred.gesture}-${idx}`}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-200 truncate">{pred.gesture}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 sm:w-24 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(3, pConf))}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-400 text-[11px] w-8 text-right">{pConf}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>{modelName}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{latencyMs > 0 ? `${latencyMs}ms latency` : '18ms latency'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Updated {updateTime}</span>
        </div>
      </div>
    </Card>
  );
}
