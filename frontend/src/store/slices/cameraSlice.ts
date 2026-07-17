import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CameraState {
  deviceId: string | null;
  isStreaming: boolean;
  resolution: '720p' | '1080p';
  fps: number;
  lowLightWarning: boolean;
  error: string | null;
  showOverlay: boolean;
}

const initialState: CameraState = {
  deviceId: null,
  isStreaming: false,
  resolution: '720p',
  fps: 0,
  lowLightWarning: false,
  error: null,
  showOverlay: true,
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setDeviceId: (state, action: PayloadAction<string | null>) => {
      state.deviceId = action.payload;
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
      if (!action.payload) {
        state.fps = 0;
      }
    },
    setResolution: (state, action: PayloadAction<'720p' | '1080p'>) => {
      state.resolution = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
    setLowLightWarning: (state, action: PayloadAction<boolean>) => {
      state.lowLightWarning = action.payload;
    },
    setCameraError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleOverlay: (state) => {
      state.showOverlay = !state.showOverlay;
    },
  },
});

export const {
  setDeviceId,
  setStreaming,
  setResolution,
  setFps,
  setLowLightWarning,
  setCameraError,
  toggleOverlay,
} = cameraSlice.actions;
export default cameraSlice.reducer;
