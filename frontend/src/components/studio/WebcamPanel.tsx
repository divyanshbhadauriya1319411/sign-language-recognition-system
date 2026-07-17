'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setDeviceId,
  setStreaming,
  setResolution,
  setFps,
  setLowLightWarning,
  setCameraError,
  toggleOverlay,
} from '@/store/slices/cameraSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MediaPipeCanvas } from '@/components/studio/MediaPipeCanvas';
import { Spinner } from '@/components/progress/Loader';
import {
  Camera as CameraIcon,
  Video,
  VideoOff,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Sliders,
  FlipHorizontal,
  CircleDot,
  CheckCircle2,
  Camera,
  ShieldAlert,
  Play,
  Pause,
} from 'lucide-react';

export type CameraOperationalState =
  | 'initial'
  | 'permission_requested'
  | 'permission_denied'
  | 'connecting'
  | 'live'
  | 'paused'
  | 'unavailable'
  | 'recording';

export interface WebcamPanelProps {
  onFrameCapture: (base64Frame: string) => void;
  landmarks?: any[];
  numHands?: number;
  handedness?: string[];
  lastPredictionConfidence?: number;
  onTakeSnapshot?: (dataUrl: string) => void;
  isSessionRecording?: boolean;
}

export function WebcamPanel({
  onFrameCapture,
  landmarks = [],
  numHands = 0,
  handedness = [],
  lastPredictionConfidence = 0,
  onTakeSnapshot,
  isSessionRecording = false,
}: WebcamPanelProps) {
  const dispatch = useAppDispatch();
  const { deviceId, isStreaming, resolution, fps, lowLightWarning, error, showOverlay } = useAppSelector(
    (state) => state.camera
  );

  const [cameraState, setCameraState] = useState<CameraOperationalState>('initial');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fpsCounterRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: performance.now() });

  // Enumerate devices
  const enumerateCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = all.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !deviceId) {
        dispatch(setDeviceId(videoInputs[0].deviceId));
      }
    } catch (err) {
      console.error('Failed to enumerate cameras:', err);
    }
  }, [deviceId, dispatch]);

  // Start Camera
  const startCamera = useCallback(async () => {
    dispatch(setCameraError(null));
    setCameraState('permission_requested');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: resolution === '1080p' ? { ideal: 1920 } : { ideal: 1280 },
        height: resolution === '1080p' ? { ideal: 1080 } : { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: false,
    };

    try {
      setCameraState('connecting');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      dispatch(setStreaming(true));
      setCameraState(isSessionRecording ? 'recording' : 'live');
      await enumerateCameraDevices();
    } catch (err: any) {
      console.error('Camera access error:', err);
      dispatch(setStreaming(false));
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('permission_denied');
        dispatch(setCameraError('Camera access was denied by your browser. Please allow webcam permissions.'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('unavailable');
        dispatch(setCameraError('No camera device was detected on your computer or USB ports.'));
      } else {
        setCameraState('unavailable');
        dispatch(setCameraError(`Could not access camera: ${err.message || 'Device in use by another application'}`));
      }
    }
  }, [deviceId, resolution, isSessionRecording, dispatch, enumerateCameraDevices]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    dispatch(setStreaming(false));
    dispatch(setFps(0));
    setCameraState('initial');
  }, [dispatch]);

  // Toggle Pause
  const togglePause = useCallback(() => {
    if (cameraState === 'live' || cameraState === 'recording') {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      setCameraState('paused');
      dispatch(setStreaming(false));
    } else if (cameraState === 'paused') {
      setCameraState(isSessionRecording ? 'recording' : 'live');
      dispatch(setStreaming(true));
    }
  }, [cameraState, isSessionRecording, dispatch]);

  // Capture frames and calculate FPS loop
  useEffect(() => {
    if ((cameraState !== 'live' && cameraState !== 'recording') || !isStreaming) {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      return;
    }

    frameIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = hiddenCanvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Low light detection using luminance average
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const sampleData = ctx.getImageData(0, 0, Math.min(100, canvas.width), Math.min(100, canvas.height)).data;
      let totalLum = 0;
      for (let i = 0; i < sampleData.length; i += 4) {
        totalLum += 0.299 * sampleData[i] + 0.587 * sampleData[i + 1] + 0.114 * sampleData[i + 2];
      }
      const avgLum = totalLum / (sampleData.length / 4);
      dispatch(setLowLightWarning(avgLum < 45));

      // Capture frame base64 for AI WebSocket
      const base64Frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      if (base64Frame) {
        onFrameCapture(base64Frame);
      }

      // FPS calculation
      fpsCounterRef.current.frames += 1;
      const now = performance.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        dispatch(setFps(Math.round((fpsCounterRef.current.frames * 1000) / (now - fpsCounterRef.current.lastTime))));
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }
    }, 100); // 10 FPS transmission target to balance network and latency

    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, [cameraState, isStreaming, onFrameCapture, dispatch]);

  // Sync state with parent recording state
  useEffect(() => {
    if (cameraState === 'live' && isSessionRecording) {
      setCameraState('recording');
    } else if (cameraState === 'recording' && !isSessionRecording) {
      setCameraState('live');
    }
  }, [isSessionRecording, cameraState]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Snapshot capture
  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    const canvas = hiddenCanvasRef.current;
    if (!video || !canvas || video.readyState !== 4) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setSnapshotPreview(dataUrl);
    if (onTakeSnapshot) onTakeSnapshot(dataUrl);
    setTimeout(() => setSnapshotPreview(null), 3000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full min-h-[420px] lg:min-h-[520px]'
      }`}
    >
      {/* Top Camera Controls Bar */}
      <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left Status Pill + FPS */}
        <div className="flex items-center gap-2">
          {cameraState === 'live' ? (
            <Badge variant="success" size="sm">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Camera Live</span>
              </span>
            </Badge>
          ) : cameraState === 'recording' ? (
            <Badge variant="danger" size="sm">
              <span className="flex items-center gap-1.5 font-bold">
                <CircleDot className="w-3.5 h-3.5 animate-ping text-rose-500" />
                <span>REC Session active</span>
              </span>
            </Badge>
          ) : cameraState === 'paused' ? (
            <Badge variant="warning" size="sm">
              <span className="flex items-center gap-1.5 font-bold">
                <Pause className="w-3 h-3" />
                <span>Stream Paused</span>
              </span>
            </Badge>
          ) : (
            <Badge variant="purple" size="sm">
              <span>{cameraState === 'connecting' ? 'Connecting...' : 'Camera Standby'}</span>
            </Badge>
          )}

          {fps > 0 && (
            <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 font-mono text-emerald-400 font-semibold">
              {fps} FPS
            </span>
          )}

          {lowLightWarning && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>Low Light Detected</span>
            </span>
          )}
        </div>

        {/* Right Settings Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-1">
          {/* Device Selector */}
          {devices.length > 1 && (
            <select
              value={deviceId || ''}
              onChange={(e) => {
                dispatch(setDeviceId(e.target.value));
                if (cameraState === 'live' || cameraState === 'recording') startCamera();
              }}
              aria-label="Select Camera Device"
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none max-w-[140px] truncate"
            >
              {devices.map((d, idx) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Webcam #${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          {/* Resolution Selector */}
          <button
            onClick={() => {
              const nextRes = resolution === '720p' ? '1080p' : '720p';
              dispatch(setResolution(nextRes));
              if (cameraState === 'live' || cameraState === 'recording') startCamera();
            }}
            className="px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-semibold transition-colors"
            title="Toggle HD Resolution"
          >
            {resolution}
          </button>

          {/* Mirror Mode Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-1.5 rounded-lg transition-colors ${
              isMirrored ? 'bg-indigo-600/30 text-indigo-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Toggle Mirror Mode (Horizontal Flip)"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* MediaPipe Overlay Toggle */}
          <button
            onClick={() => dispatch(toggleOverlay())}
            className={`p-1.5 rounded-lg transition-colors ${
              showOverlay ? 'bg-indigo-600/30 text-indigo-300' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title={showOverlay ? 'Hide 3D Skeletal Overlay' : 'Show 3D Skeletal Overlay'}
          >
            {showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Snapshot Capture button */}
          {(cameraState === 'live' || cameraState === 'recording') && (
            <button
              onClick={handleTakeSnapshot}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Take High-Res Snapshot (S)"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport / State Overlays */}
      <div className="relative flex-1 flex items-center justify-center bg-slate-950 overflow-hidden min-h-[360px]">
        {/* Hidden Canvas for capture & FPS */}
        <canvas ref={hiddenCanvasRef} className="hidden" />

        {/* Live Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isMirrored ? 'scale-x-[-1]' : ''
          } ${(cameraState === 'live' || cameraState === 'recording' || cameraState === 'paused') ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* MediaPipe 3D Landmark Overlay */}
        {showOverlay && (cameraState === 'live' || cameraState === 'recording') && (
          <MediaPipeCanvas
            landmarks={landmarks}
            numHands={numHands}
            handedness={handedness}
            confidence={lastPredictionConfidence}
            isMirrored={isMirrored}
          />
        )}

        {/* Snapshot Flash & Preview Popup */}
        {snapshotPreview && (
          <div className="absolute inset-x-4 bottom-16 z-30 flex items-center justify-between p-3 rounded-xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3">
              <img src={snapshotPreview} alt="Snapshot" className="w-16 h-12 object-cover rounded border border-slate-700" />
              <div>
                <p className="text-xs font-bold text-white">Snapshot Captured</p>
                <p className="text-[11px] text-slate-400">Resolution: {resolution} PNG</p>
              </div>
            </div>
            <a
              href={snapshotPreview}
              download={`signbridge-snapshot-${Date.now()}.png`}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              Download
            </a>
          </div>
        )}

        {/* State 1: Initial Standby */}
        {cameraState === 'initial' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/80 backdrop-blur-sm z-10">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-lg font-bold text-white">Webcam Standby Mode</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click below to authorize your high-definition camera feed and begin real-time MediaPipe hand landmark detection.
              </p>
            </div>
            <Button variant="gradient" size="lg" onClick={startCamera} icon={<CameraIcon className="w-4 h-4" />}>
              Activate Camera Feed
            </Button>
          </div>
        )}

        {/* State 2 & 4: Permission Requested / Connecting */}
        {(cameraState === 'permission_requested' || cameraState === 'connecting') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/90 backdrop-blur-sm z-10 animate-fade-in">
            <Spinner size="lg" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {cameraState === 'permission_requested' ? 'Waiting for Camera Permission...' : 'Initializing HD Video Track...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {cameraState === 'permission_requested'
                  ? 'Please click "Allow" when prompted by your browser to enable sign recognition.'
                  : `Configuring ${resolution} at 30 FPS targeting MediaPipe spatial pipeline.`}
              </p>
            </div>
          </div>
        )}

        {/* State 3: Permission Denied */}
        {cameraState === 'permission_denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/95 backdrop-blur-md z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-lg font-bold text-white">Camera Permission Denied</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We require webcam access to detect Indian Sign Language gestures in real time. All video processing occurs securely inside your browser and temporary buffers without permanent storage.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-left text-[11px] text-slate-400 font-mono space-y-1">
                <p className="font-bold text-slate-200">How to unlock camera access:</p>
                <p>1. Click the lock/camera icon next to your URL bar at the top of the browser.</p>
                <p>2. Toggle "Camera" permission from Block to Allow.</p>
                <p>3. Click "Retry Camera Connection" below.</p>
              </div>
            </div>
            <Button variant="outline" size="md" onClick={startCamera} icon={<RefreshCw className="w-4 h-4" />}>
              Retry Camera Connection
            </Button>
          </div>
        )}

        {/* State 6: Paused */}
        {cameraState === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950/80 backdrop-blur-sm z-10 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <Pause className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-white">Detection Paused</h3>
              <p className="text-xs text-slate-400">
                AI stream evaluation is temporarily halted to conserve CPU and GPU power.
              </p>
            </div>
            <Button variant="gradient" size="md" onClick={togglePause} icon={<Play className="w-4 h-4" />}>
              Resume Live Stream
            </Button>
          </div>
        )}

        {/* State 7: Camera Unavailable */}
        {cameraState === 'unavailable' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/95 backdrop-blur-md z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
              <VideoOff className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-lg font-bold text-white">Webcam Not Detected / In Use</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {error || 'No active video device was found on your system, or another program (Zoom, Teams) has locked the camera sensor.'}
              </p>
            </div>
            <Button variant="gradient" size="md" onClick={startCamera} icon={<RefreshCw className="w-4 h-4" />}>
              Scan for Camera Devices
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Control Actions Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {cameraState === 'live' || cameraState === 'recording' ? (
            <Button variant="outline" size="sm" onClick={togglePause} icon={<Pause className="w-3.5 h-3.5" />}>
              Pause Camera
            </Button>
          ) : cameraState === 'paused' ? (
            <Button variant="gradient" size="sm" onClick={togglePause} icon={<Play className="w-3.5 h-3.5" />}>
              Resume Camera
            </Button>
          ) : null}

          {(cameraState === 'live' || cameraState === 'paused' || cameraState === 'recording') && (
            <Button variant="danger" size="sm" onClick={stopCamera} icon={<VideoOff className="w-3.5 h-3.5" />}>
              Turn Off
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>MediaPipe Hands v0.4.16</span>
          <span>•</span>
          <span className="text-indigo-400 font-semibold">PyTorch Bi-LSTM</span>
        </div>
      </div>
    </div>
  );
}
