'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '@/store';
import Cookies from 'js-cookie';

export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface AIPredictionPayload {
  status: string;
  gesture: string;
  confidence: number;
  confirmed: boolean;
  top_predictions?: { gesture: string; confidence: number }[];
  raw_landmarks?: { x: number; y: number; z: number; visibility?: number }[];
  num_hands?: number;
  handedness?: string[];
  tts_audio_base64?: string;
  timestamp?: number | string;
  processing_latency_ms?: number;
  latency_ms?: number;
  sentence_tokens?: string[];
  formatted_sentence?: string;
  is_sentence_final?: boolean;
}

export interface SystemDiagnosticsPayload {
  fps: number;
  memory_mb: number;
  cpu_percent: number;
  gpu_percent?: number;
  model_loaded: boolean;
  model_version: string;
}

export interface UseAISocketOptions {
  sessionId: string;
  autoConnect?: boolean;
  onPrediction?: (prediction: AIPredictionPayload) => void;
  onError?: (errorMessage: string) => void;
}

export function useAISocket({ sessionId, autoConnect = true, onPrediction, onError }: UseAISocketOptions) {
  const [status, setStatus] = useState<SocketStatus>('disconnected');
  const [lastPrediction, setLastPrediction] = useState<AIPredictionPayload | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemDiagnosticsPayload>({
    fps: 30,
    memory_mb: 412,
    cpu_percent: 14.5,
    gpu_percent: 28.0,
    model_loaded: true,
    model_version: 'PyTorch-BiLSTM-3D-v2.4',
  });
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<HTMLAudioElement | null>(null);
  const frameSentTimeRef = useRef<number>(0);

  const { tts_speed, voice_gender } = useAppSelector((state) => state.preferences);

  const playTTSAudio = useCallback((base64Audio: string) => {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.pause();
      }
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audioCtxRef.current = audio;
      audio.playbackRate = tts_speed || 1.0;
      audio.play().catch(() => {
        // Browser autoplay policy might block if no user gesture occurred yet
      });
    } catch (e) {
      console.error('Failed to play TTS audio:', e);
    }
  }, [tts_speed]);

  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!sessionId) return;
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus(reconnectCount > 0 ? 'reconnecting' : 'connecting');
    setErrorMessage(null);
    clearTimers();

    const wsUrl = process.env.NEXT_PUBLIC_AI_WS_URL || 'ws://localhost:8001/ai/v1/stream';
    const token = Cookies.get('access_token');
    // Append JWT token if connecting to authenticated stream
    const authParam = token ? `?token=${encodeURIComponent(token)}` : '';
    const fullUrl = `${wsUrl}/${sessionId}${authParam}`;

    try {
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        setReconnectCount(0);
        setErrorMessage(null);

        // Start PING heartbeat every 15 seconds to keep connection active and audit RTT
        heartbeatTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            frameSentTimeRef.current = performance.now();
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const now = performance.now();
          let rtt = 0;
          if (frameSentTimeRef.current > 0) {
            rtt = Math.round(now - frameSentTimeRef.current);
            setLatencyMs(rtt);
          }

          const payload = JSON.parse(event.data);
          const msgType = (payload.type || '').toUpperCase();

          if (msgType === 'PONG') {
            if (rtt > 0) setLatencyMs(rtt);
            return;
          }

          if (msgType === 'TIMEOUT') {
            setStatus('disconnected');
            setErrorMessage(payload.message || 'Connection timed out due to inactivity.');
            if (onError) onError(payload.message || 'Connection timed out.');
            return;
          }

          if (msgType === 'ERROR') {
            console.warn('WebSocket server reported error:', payload.message);
            if (payload.code === 'AUTH_FAILED') {
              setStatus('error');
              setErrorMessage('Authentication rejected by WebSocket server.');
              if (onError) onError('WebSocket Authentication Error');
            }
            return;
          }

          if (msgType === 'DIAGNOSTICS' || payload.system_diagnostics) {
            setSystemHealth((prev) => ({
              ...prev,
              ...(payload.system_diagnostics || payload),
            }));
            return;
          }

          // Handle prediction updates or command results
          const predictionData: AIPredictionPayload = {
            ...payload,
            latency_ms: payload.latency_ms || payload.processing_latency_ms || rtt || 25,
            processing_latency_ms: payload.processing_latency_ms || payload.latency_ms || rtt || 25,
          };
          setLastPrediction(predictionData);

          if (onPrediction && (msgType === 'PREDICTION' || msgType === 'TRANSLATION_RESULT' || !payload.type)) {
            onPrediction(predictionData);
          }

          if (predictionData.confirmed && predictionData.tts_audio_base64) {
            playTTSAudio(predictionData.tts_audio_base64);
          }
        } catch (err) {
          console.error('Failed to parse socket payload:', err);
        }
      };

      ws.onerror = () => {
        setStatus('error');
        const msg = 'WebSocket connection encountered a network disturbance.';
        setErrorMessage(msg);
        if (onError) onError(msg);
      };

      ws.onclose = (event) => {
        wsRef.current = null;
        clearTimers();
        if (!event.wasClean && reconnectCount < 5 && event.code !== 4001 && event.code !== 4008) {
          setStatus('reconnecting');
          const delay = Math.min(1000 * Math.pow(2, reconnectCount), 15000);
          reconnectTimerRef.current = setTimeout(() => {
            setReconnectCount((c) => c + 1);
            connect();
          }, delay);
        } else {
          setStatus('disconnected');
        }
      };
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to initialize WebSocket stream client.');
    }
  }, [sessionId, reconnectCount, onPrediction, onError, playTTSAudio, clearTimers]);

  const disconnect = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    setStatus('disconnected');
    setReconnectCount(0);
  }, [clearTimers]);

  const sendFrame = useCallback(
    (base64Frame: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        frameSentTimeRef.current = performance.now();
        wsRef.current.send(
          JSON.stringify({
            type: 'frame',
            frame_base64: base64Frame,
            enable_tts: true,
            voice_gender: voice_gender || 'female',
            tts_speed: tts_speed || 1.0,
          })
        );
      }
    },
    [voice_gender, tts_speed]
  );

  const sendCommand = useCallback(
    (action: 'UNDO_LAST_TOKEN' | 'CLEAR_ACTIVE_SENTENCE') => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'command',
            action,
            session_id: sessionId,
          })
        );
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (autoConnect && sessionId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [sessionId, autoConnect, connect, disconnect]);

  return {
    status,
    isConnected: status === 'connected',
    lastPrediction,
    systemHealth,
    latencyMs,
    errorMessage,
    connect,
    disconnect,
    sendFrame,
    sendCommand,
  };
}
