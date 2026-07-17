import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessibilitySettings } from '@/types';

interface PreferencesState extends AccessibilitySettings {
  language: string;
}

const initialState: PreferencesState = {
  high_contrast: false,
  theme: 'dark',
  tts_speed: 1.0,
  voice_gender: 'female',
  reduced_motion: false,
  language: 'en',
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    toggleHighContrast: (state) => {
      state.high_contrast = !state.high_contrast;
    },
    setTTSSpeed: (state, action: PayloadAction<number>) => {
      state.tts_speed = action.payload;
    },
    setVoiceGender: (state, action: PayloadAction<'female' | 'male'>) => {
      state.voice_gender = action.payload;
    },
    setPreferences: (state, action: PayloadAction<Partial<PreferencesState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTheme, toggleHighContrast, setTTSSpeed, setVoiceGender, setPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
