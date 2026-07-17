'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '@/store';

export interface AIStreamResponse {
  status: string;
  gesture: string;
  confidence: number;
  confirmed: boolean;
  top_predictions?: { gesture: string; confidence: number }[];
  raw_landmarks?: { x: number; y: number; z: number; visibility?: number }[];
  num_hands?: number;
  handedness?: string[];
  tts_audio_base64?: string;
}

export function useAIStream(sessionId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<AIStreamResponse | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<HTMLAudioElement | null>(null);

  const { tts_speed, voice_gender } = useAppSelector((state) => state.preferences);

  const connect = useCallback(() => {
    if (!sessionId) return;
    const wsUrl = process.env.NEXT_PUBLIC_AI_WS_URL || 'ws://localhost:8001/ai/v1/stream';
    const fullUrl = `${wsUrl}/${sessionId}`;

    try {
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: AIStreamResponse = JSON.parse(event.data);
          setLastPrediction(data);

          if (data.confirmed && data.gesture && data.gesture !== 'No Sign Detected' && data.gesture !== 'Searching for hands...') {
            setTranscript((prev) => {
              // Avoid adding duplicate consecutive signs if already the last item
              if (prev.length > 0 && prev[prev.length - 1] === data.gesture) {
                return prev;
              }
              return [...prev, data.gesture];
            });

            // Play audio if available
            if (data.tts_audio_base64) {
              playAudio(`data:audio/mpeg;base64,${data.tts_audio_base64}`);
            }
          }
        } catch (e) {
          console.error('Failed to parse AI stream message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
    }
  }, [sessionId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendFrame = useCallback(
    (frameBase64: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'frame',
            frame_base64: frameBase64,
            enable_tts: true,
            voice_gender: voice_gender || 'female',
            tts_speed: tts_speed || 1.0,
          })
        );
      }
    },
    [voice_gender, tts_speed]
  );

  const playAudio = (audioUri: string) => {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.pause();
      }
      const audio = new Audio(audioUri);
      audioCtxRef.current = audio;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const clearTranscript = () => setTranscript([]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastPrediction,
    transcript,
    connect,
    disconnect,
    sendFrame,
    clearTranscript,
  };
}
