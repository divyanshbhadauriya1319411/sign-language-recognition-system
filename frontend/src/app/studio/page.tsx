'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppSelector } from '@/store';
import { useAISocket, AIPredictionPayload } from '@/hooks/useAISocket';
import api from '@/services/api';
import { StudioToolbar } from '@/components/studio/StudioToolbar';
import { WebcamPanel } from '@/components/studio/WebcamPanel';
import { PredictionPanel } from '@/components/studio/PredictionPanel';
import { SentenceBuilder } from '@/components/studio/SentenceBuilder';
import { TTSPanel } from '@/components/studio/TTSPanel';
import { RecognitionHistory, HistoryItem } from '@/components/studio/RecognitionHistory';
import { AIStatusDiagnostics } from '@/components/studio/AIStatusDiagnostics';
import { StudioControls } from '@/components/studio/StudioControls';
import { StudioErrorModal, StudioErrorType } from '@/components/studio/StudioErrorModal';
import { VocabularyDrawer } from '@/components/studio/VocabularyDrawer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  LayoutGrid,
  History,
  Volume2,
  FileText,
  Activity,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function StudioPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Session & UI States
  const [sessionId, setSessionId] = useState<string>('guest_session');
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState<string>(
    `Live ISL Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  );
  const [isRecordingSession, setIsRecordingSession] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'prediction' | 'builder' | 'history' | 'tts'>('prediction');
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);
  const [showCheatSheetDrawer, setShowCheatSheetDrawer] = useState<boolean>(false);
  const [activeError, setActiveError] = useState<StudioErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recognition data states
  const [recognizedWords, setRecognizedWords] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [lastTTSBase64, setLastTTSBase64] = useState<string | undefined>(undefined);

  // Initialize backend session if authenticated
  useEffect(() => {
    async function initSession() {
      if (isAuthenticated && user) {
        const generatedId = `user_session_${Date.now()}`;
        setDbSessionId(generatedId);
        setSessionId(generatedId);
      } else {
        setSessionId(`guest_session_${Date.now()}`);
      }
    }
    initSession();
  }, [isAuthenticated, user]);

  // AI Socket connection
  const handlePredictionEvent = useCallback(
    (pred: AIPredictionPayload) => {
      if (pred.confirmed && pred.gesture && pred.gesture !== 'No Sign Detected' && pred.gesture !== 'Searching for hands...') {
        // Append word if not identical to immediate last
        setRecognizedWords((prev) => {
          if (prev.length > 0 && prev[prev.length - 1] === pred.gesture) {
            return prev;
          }
          return [...prev, pred.gesture];
        });

        // Add to history log
        const newItem: HistoryItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          gesture: pred.gesture,
          confidence: pred.confidence,
          timestamp: Date.now(),
        };
        setHistoryItems((prev) => [newItem, ...prev]);

        // Capture TTS audio if returned
        if (pred.tts_audio_base64) {
          setLastTTSBase64(pred.tts_audio_base64);
        }

        // If authenticated and recording session, save to backend translations endpoint
        if (isAuthenticated && isRecordingSession) {
          const confScore = pred.confidence > 1 ? pred.confidence / 100 : pred.confidence;
          const latencyVal = Math.round(pred.latency_ms || pred.processing_latency_ms || 25);
          const genTransId = `live_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

          api
            .post('/translations/', {
              recognized_gesture: pred.gesture,
              translated_text: pred.gesture,
              confidence_score: confScore,
              session_id: dbSessionId || sessionId,
              inference_latency_ms: latencyVal,
              engine_used: 'pytorch_bilstm'
            })
            .then((res) => {
              const returnedId = res.data?.id || genTransId;
              api
                .post('/translations/history', {
                  translation_id: returnedId,
                  title: `ISL Sign: ${pred.gesture}`,
                  summary_text: pred.gesture,
                  category: 'Studio Live'
                })
                .catch(() => {});
            })
            .catch(() => {});
        }
      }
    },
    [isAuthenticated, isRecordingSession, dbSessionId, sessionId]
  );

  const handleSocketError = useCallback((errText: string) => {
    setActiveError('websocket_disconnected');
    setErrorMessage(errText);
  }, []);

  const {
    status: socketStatus,
    isConnected,
    lastPrediction,
    systemHealth,
    latencyMs,
    connect: connectSocket,
    disconnect: disconnectSocket,
    sendFrame,
    sendCommand,
  } = useAISocket({
    sessionId,
    autoConnect: true,
    onPrediction: handlePredictionEvent,
    onError: handleSocketError,
  });

  // Handle camera frame dispatch
  const handleFrameCapture = useCallback(
    (base64Frame: string) => {
      sendFrame(base64Frame);
    },
    [sendFrame]
  );

  // Control button handlers
  const handleStartDetection = () => {
    if (socketStatus !== 'connected') connectSocket();
  };

  const handlePauseDetection = () => {
    // Handled in controls / camera state synchronization
  };

  const handleResumeDetection = () => {
    if (socketStatus !== 'connected') connectSocket();
  };

  const handleStopSession = () => {
    disconnectSocket();
    setIsRecordingSession(false);
  };

  const handleResetSession = () => {
    setRecognizedWords([]);
    setHistoryItems([]);
    sendCommand?.('CLEAR_ACTIVE_SENTENCE');
  };

  const handleInsertToBuilder = (word: string) => {
    setRecognizedWords((prev) => [...prev, word]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleSaveConversation = async (fullText: string) => {
    if (!isAuthenticated) {
      // Fallback local file save
      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SignBridge-Conversation-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      const res = await api.post('/translations/', {
        recognized_gesture: 'Compiled Sentence',
        translated_text: fullText,
        confidence_score: 0.98,
        session_id: dbSessionId || sessionId,
        inference_latency_ms: 30,
        engine_used: 'pytorch_bilstm'
      });
      const transId = res.data?.id || `compiled_${Date.now()}`;
      await api.post('/translations/history', {
        translation_id: transId,
        title: 'Compiled Sentence',
        summary_text: fullText,
        category: 'Compiled Sentence'
      });
    } catch (e) {
      console.error('Failed to save to database:', e);
    }
  };

  // Sync camera slice error with active error modal if needed
  const cameraError = useAppSelector((state) => state.camera.error);
  useEffect(() => {
    if (cameraError) {
      if (cameraError.toLowerCase().includes('denied')) {
        setActiveError('permission_denied');
      } else {
        setActiveError('camera_unavailable');
      }
      setErrorMessage(cameraError);
    }
  }, [cameraError]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        {/* Sticky Studio Toolbar */}
        <StudioToolbar
          socketStatus={socketStatus}
          latencyMs={latencyMs}
          sessionTitle={sessionTitle}
          onUpdateSessionTitle={(title) => {
            setSessionTitle(title);
          }}
          onOpenHelp={() => setShowCheatSheetDrawer(true)}
          onOpenDiagnostics={() => setShowDiagnosticsModal(true)}
        />

        {/* Main Workspace Layout */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Desktop & Large Screen Grid (12 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column Suite (7 Columns): Webcam Panel + Controls + TTS */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              {/* Webcam & MediaPipe 3D Landmark Viewport */}
              <WebcamPanel
                onFrameCapture={handleFrameCapture}
                landmarks={lastPrediction?.raw_landmarks || []}
                numHands={lastPrediction?.num_hands || 0}
                handedness={lastPrediction?.handedness || []}
                lastPredictionConfidence={lastPrediction?.confidence || 0}
                isSessionRecording={isRecordingSession}
              />

              {/* Primary Studio Actions & Hotkeys Control Bar */}
              <StudioControls
                isStreaming={isConnected}
                isPaused={socketStatus === 'disconnected'}
                isRecording={isRecordingSession}
                onStart={handleStartDetection}
                onPause={handlePauseDetection}
                onResume={handleResumeDetection}
                onStop={handleStopSession}
                onReset={handleResetSession}
                onTakeSnapshot={() => {}}
                onToggleRecord={() => setIsRecordingSession(!isRecordingSession)}
              />

              {/* Speech Synthesis Panel (TTS) */}
              <div className="hidden sm:block">
                <TTSPanel currentText={recognizedWords.join(' ')} lastAudioBase64={lastTTSBase64} />
              </div>
            </div>

            {/* Right Column Suite (5 Columns): Prediction + Sentence Builder + History */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 flex flex-col">
              {/* Mobile/Tablet Tab Switcher for Right Panels */}
              <div className="flex sm:hidden items-center justify-between p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
                {[
                  { id: 'prediction', label: 'Prediction', icon: <Activity className="w-3.5 h-3.5" /> },
                  { id: 'builder', label: 'Sentence', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" /> },
                  { id: 'tts', label: 'Speech', icon: <Volume2 className="w-3.5 h-3.5" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveRightTab(t.id as any)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeRightTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Prediction Panel (Always visible on desktop, tabbed on mobile) */}
              <div className={activeRightTab !== 'prediction' ? 'hidden sm:block' : 'block'}>
                <PredictionPanel
                  lastPrediction={lastPrediction}
                  latencyMs={latencyMs}
                  fps={systemHealth.fps || 30}
                  modelName={systemHealth.model_version || 'PyTorch Bi-LSTM 3D v2.4'}
                />
              </div>

              {/* Smart Sentence Builder (Always visible on desktop, tabbed on mobile) */}
              <div className={activeRightTab !== 'builder' ? 'hidden sm:block' : 'block'}>
                <SentenceBuilder
                  words={recognizedWords}
                  onWordsChange={setRecognizedWords}
                  onClear={() => {
                    setRecognizedWords([]);
                    sendCommand?.('CLEAR_ACTIVE_SENTENCE');
                  }}
                  onSaveConversation={handleSaveConversation}
                />
              </div>

              {/* Temporal Recognition History Sidebar (Always visible on desktop, tabbed on mobile) */}
              <div className={activeRightTab !== 'history' ? 'hidden sm:block' : 'block'}>
                <RecognitionHistory
                  items={historyItems}
                  onInsertToBuilder={handleInsertToBuilder}
                  onDeleteItem={handleDeleteHistoryItem}
                  onClearAll={handleClearHistory}
                />
              </div>

              {/* TTS Panel on Mobile tab */}
              <div className={activeRightTab === 'tts' ? 'block sm:hidden' : 'hidden'}>
                <TTSPanel currentText={recognizedWords.join(' ')} lastAudioBase64={lastTTSBase64} />
              </div>
            </div>
          </div>
        </main>

        {/* AI System Diagnostics Modal */}
        {showDiagnosticsModal && (
          <AIStatusDiagnostics
            systemHealth={systemHealth}
            socketStatus={socketStatus}
            latencyMs={latencyMs}
            cameraFps={systemHealth.fps || 30}
            resolution="1080p HD"
            lowLightWarning={false}
            onClose={() => setShowDiagnosticsModal(false)}
            isModal={true}
          />
        )}

        {/* Error States Modal */}
        <StudioErrorModal
          errorType={activeError}
          errorMessage={errorMessage}
          onRetry={() => {
            setActiveError(null);
            setErrorMessage(null);
            connectSocket();
          }}
          onDismiss={() => {
            setActiveError(null);
            setErrorMessage(null);
          }}
        />

        {/* ISL Vocabulary & Cheat Sheet Drawer */}
        <VocabularyDrawer isOpen={showCheatSheetDrawer} onClose={() => setShowCheatSheetDrawer(false)} />
      </div>
  );
}
