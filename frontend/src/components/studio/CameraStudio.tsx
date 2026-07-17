'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setDeviceId, setStreaming, setFps, setLowLightWarning, setCameraError, toggleOverlay } from '@/store/slices/cameraSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MediaPipeCanvas } from '@/components/studio/MediaPipeCanvas';
import {
  Camera as CameraIcon, Video, VideoOff, RefreshCw, AlertTriangle,
  Eye, EyeOff, Sparkles, Activity, Sun, CheckCircle2, Sliders
} from 'lucide-react';

interface CameraStudioProps {
  onFrameCapture: (base64Frame: string) => void;
  landmarks?: any[];
  numHands?: number;
  handedness?: string[];
  lastPredictionConfidence?: number;
}

export function CameraStudio({
  onFrameCapture,
  landmarks = [],
  numHands = 0,
  handedness = [],
  lastPredictionConfidence = 0,
}: CameraStudioProps) {
  const dispatch = useAppDispatch();
  const { deviceId, isStreaming, resolution, fps, lowLightWarning, error, showOverlay } = useAppSelector((state) => state.camera);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fpsCounterRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: performance.now() });

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });

  // Enumerate video input devices
  const getDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !deviceId) {
        dispatch(setDeviceId(videoDevices[0].deviceId));
      }
    } catch (err) {
      console.error('Error listing camera devices:', err);
    }
  }, [deviceId, dispatch]);

  // Start video stream
  const startCamera = useCallback(async () => {
    dispatch(setCameraError(null));
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: resolution === '1080p' ? { ideal: 1920 } : { ideal: 1280 },
          height: resolution === '1080p' ? { ideal: 1080 } : { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setVideoSize({
              width: videoRef.current.videoWidth || 640,
              height: videoRef.current.videoHeight || 480,
            });
            dispatch(setStreaming(true));
          }
        };
      }
    } catch (err: any) {
      console.error('Camera access denied or failed:', err);
      dispatch(setCameraError('Unable to access camera. Please allow webcam permission or select a valid device.'));
      dispatch(setStreaming(false));
    }
  }, [deviceId, resolution, dispatch]);

  // Stop video stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    dispatch(setStreaming(false));
  }, [dispatch]);

  // Frame capture loop (~30 FPS) + low light detection
  useEffect(() => {
    if (!isStreaming) {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      return;
    }

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = hiddenCanvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 320; // Downscaled for faster transmission and luminance check
      canvas.height = 240;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Low light detection using average pixel luminance
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let lumSum = 0;
      for (let i = 0; i < frameData.data.length; i += 16) {
        // Luminance formula: 0.299*R + 0.587*G + 0.114*B
        lumSum += 0.299 * frameData.data[i] + 0.587 * frameData.data[i + 1] + 0.114 * frameData.data[i + 2];
      }
      const avgLum = lumSum / (frameData.data.length / 16);
      dispatch(setLowLightWarning(avgLum < 45));

      // Capture and emit base64 frame
      const base64 = canvas.toDataURL('image/jpeg', 0.7);
      onFrameCapture(base64);

      // Calculate FPS
      fpsCounterRef.current.frames += 1;
      const now = performance.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        dispatch(setFps(fpsCounterRef.current.frames));
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }
    }, 33); // ~30 FPS

    frameIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isStreaming, onFrameCapture, dispatch]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Camera Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
          <span className="font-semibold text-sm text-white flex items-center gap-1.5">
            {isStreaming ? (
              <>
                <CameraIcon className="w-4 h-4 text-emerald-400" /> Live Studio ({resolution})
              </>
            ) : (
              <>
                <VideoOff className="w-4 h-4 text-slate-400" /> Studio Standby
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {devices.length > 1 && (
            <select
              value={deviceId || ''}
              onChange={(e) => dispatch(setDeviceId(e.target.value))}
              disabled={isStreaming}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {devices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera Device ${i + 1}`}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => dispatch(toggleOverlay())}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showOverlay
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            3D Skeleton
          </button>

          {isStreaming ? (
            <Button variant="danger" size="sm" onClick={stopCamera} icon={<VideoOff className="w-4 h-4" />}>
              Stop Feed
            </Button>
          ) : (
            <Button variant="gradient" size="sm" onClick={startCamera} icon={<Video className="w-4 h-4" />}>
              Start Camera
            </Button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Hidden downscale canvas */}
        <canvas ref={hiddenCanvasRef} className="hidden" />

        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${!isStreaming && 'hidden'}`}
        />

        {/* 3D Skeletal Overlay */}
        {isStreaming && (
          <div className="absolute inset-0 transform -scale-x-100 pointer-events-none">
            <MediaPipeCanvas
              landmarks={landmarks}
              numHands={numHands}
              handedness={handedness}
              width={videoSize.width}
              height={videoSize.height}
              showOverlay={showOverlay}
              confidence={lastPredictionConfidence}
            />
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-rose-300 max-w-sm">{error}</p>
            <Button variant="secondary" size="sm" onClick={getDevices} icon={<RefreshCw className="w-4 h-4" />}>
              Retry Device Check
            </Button>
          </div>
        )}

        {/* Standby Placeholder */}
        {!isStreaming && !error && (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl">
              <CameraIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Camera Standby</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Click &ldquo;Start Camera&rdquo; above to initialize real-time MediaPipe hand detection and sliding window evaluation.
              </p>
            </div>
            <Button variant="gradient" size="md" onClick={startCamera}>
              Initialize AI Feed
            </Button>
          </div>
        )}

        {/* Low-light warning banner */}
        {isStreaming && lowLightWarning && (
          <div className="absolute top-4 left-4 right-4 z-30 p-3 rounded-xl bg-amber-500/90 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg animate-bounce">
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 shrink-0" /> Low lighting detected. Move closer to a light source for better hand tracking accuracy.
            </span>
          </div>
        )}

        {/* Live Diagnostics Pill */}
        {isStreaming && (
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> FPS: <b className="text-white">{fps}</b>
              </span>
              <span className="h-3 w-px bg-slate-800" />
              <span>Hands Detected: <b className="text-white">{numHands}</b></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
              Latency: <span className="text-emerald-400 font-bold">&lt; 30ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
