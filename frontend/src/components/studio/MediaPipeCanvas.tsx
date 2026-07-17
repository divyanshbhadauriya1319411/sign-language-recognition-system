'use client';

import React, { useEffect, useRef } from 'react';

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface MediaPipeCanvasProps {
  landmarks?: Landmark[];
  numHands?: number;
  handedness?: string[];
  width?: number;
  height?: number;
  showOverlay?: boolean;
  confidence?: number;
  isMirrored?: boolean;
}

// MediaPipe 21 hand joints connections
const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky finger
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Knuckle cross (palm base)
  [5, 9], [9, 13], [13, 17],
];

export function MediaPipeCanvas({
  landmarks = [],
  numHands = 0,
  handedness = [],
  width = 1280,
  height = 720,
  showOverlay = true,
  confidence = 0,
  isMirrored = false,
}: MediaPipeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dynamically match canvas internal resolution to its client display rect or props
    const rect = canvas.getBoundingClientRect();
    const renderW = rect.width || width;
    const renderH = rect.height || height;
    canvas.width = renderW;
    canvas.height = renderH;

    ctx.clearRect(0, 0, renderW, renderH);

    if (!showOverlay || !landmarks || landmarks.length < 21) return;

    // Determine visual status from prediction confidence (0 to 1 range or percentage)
    const normalizedConf = confidence > 1 ? confidence / 100 : confidence;
    const isHighConf = normalizedConf >= 0.75;
    const isMedConf = normalizedConf >= 0.5 && normalizedConf < 0.75;

    const lineColor = isHighConf ? '#10b981' : isMedConf ? '#f59e0b' : '#6366f1'; // Emerald, Amber, Indigo
    const jointColor = isHighConf ? '#34d399' : isMedConf ? '#fbbf24' : '#a855f7'; // Mint, Gold, Purple

    const drawHandSlice = (handSlice: Landmark[], handIdx: number) => {
      // 1. Draw skeletal vectors
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = Math.max(2.5, renderW / 350);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const start = handSlice[startIdx];
        const end = handSlice[endIdx];
        if (start && end) {
          const startX = isMirrored ? (1 - start.x) * renderW : start.x * renderW;
          const startY = start.y * renderH;
          const endX = isMirrored ? (1 - end.x) * renderW : end.x * renderW;
          const endY = end.y * renderH;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });

      // 2. Draw 3D joints with depth scaling (`z` coordinate)
      let minX = renderW;
      let maxX = 0;
      let minY = renderH;
      let maxY = 0;

      handSlice.forEach((lm, idx) => {
        const x = isMirrored ? (1 - lm.x) * renderW : lm.x * renderW;
        const y = lm.y * height; // fallback to renderH if height undefined

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        // Depth cue: `z` near zero is mid, negative z is closer to camera -> slightly larger circle
        const depthBoost = lm.z < 0 ? Math.min(3, -lm.z * 15) : 0;
        const baseRadius = idx === 0 ? 6 : idx % 4 === 0 ? 5 : 3.5; // Wrist & fingertips slightly larger
        const radius = Math.max(2, baseRadius + depthBoost);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = idx === 0 ? '#f43f5e' : idx % 4 === 0 ? '#38bdf8' : jointColor; // Wrist rose, fingertips cyan, rest primary
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // 3. Draw Bounding Box & Badge Label around hand
      const wrist = handSlice[0];
      if (wrist && maxX > minX && maxY > minY) {
        const boxPad = 15;
        const bx = Math.max(0, minX - boxPad);
        const by = Math.max(0, minY - boxPad);
        const bw = Math.min(renderW - bx, maxX - minX + boxPad * 2);
        const bh = Math.min(renderH - by, maxY - minY + boxPad * 2);

        // Subtle bounding box outline
        ctx.strokeStyle = isHighConf ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        // Handedness Label Pill
        const rawHand = handedness[handIdx] || `Hand #${handIdx + 1}`;
        // If mirrored, flip Left/Right label visually so it matches user perspective
        let label = rawHand;
        if (isMirrored) {
          if (rawHand.toLowerCase().includes('left')) label = 'Right Hand';
          else if (rawHand.toLowerCase().includes('right')) label = 'Left Hand';
        }

        const pillText = `${label} (${Math.round(normalizedConf * 100)}%)`;
        ctx.font = '600 11px Inter, sans-serif';
        const textMetrics = ctx.measureText(pillText);
        const pillW = textMetrics.width + 16;
        const pillH = 22;
        const pillX = Math.max(4, bx);
        const pillY = Math.max(4, by - pillH - 4);

        // Pill background
        ctx.fillStyle = isHighConf ? 'rgba(6, 78, 59, 0.9)' : 'rgba(30, 27, 75, 0.9)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fill();
        ctx.strokeStyle = isHighConf ? '#10b981' : '#6366f1';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pill text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(pillText, pillX + 8, pillY + 15);
      }
    };

    // Render primary hand
    drawHandSlice(landmarks.slice(0, 21), 0);

    // Render secondary hand if 42+ landmarks
    if (numHands > 1 && landmarks.length >= 42) {
      drawHandSlice(landmarks.slice(21, 42), 1);
    }
  }, [landmarks, numHands, handedness, width, height, showOverlay, confidence, isMirrored]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full object-cover z-20"
      aria-hidden="true"
    />
  );
}
