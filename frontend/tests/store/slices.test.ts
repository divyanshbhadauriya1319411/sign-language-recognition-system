import { describe, it, expect } from 'vitest';
import authReducer, { setCredentials, setUser, logout, setLoading } from '@/store/slices/authSlice';
import cameraReducer, {
  setDeviceId,
  setStreaming,
  setResolution,
  setFps,
  setLowLightWarning,
  setCameraError,
  toggleOverlay,
} from '@/store/slices/cameraSlice';
import preferencesReducer, {
  setTheme,
  toggleHighContrast,
  setTTSSpeed,
  setVoiceGender,
  setPreferences,
} from '@/store/slices/preferencesSlice';

describe('Redux Store Slices Test Suite', () => {
  describe('authSlice', () => {
    it('should handle initial state correctly', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(true);
    });

    it('should handle setCredentials', () => {
      const mockUser = {
        id: '123',
        email: 'user@example.com',
        full_name: 'Test User',
        role: 'USER' as const,
        is_active: true,
        is_verified: true,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };
      const state = authReducer(
        undefined,
        setCredentials({
          user: mockUser,
          access_token: 'mock-access',
          refresh_token: 'mock-refresh',
        })
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-access');
      expect(state.isLoading).toBe(false);
    });

    it('should handle logout cleanly', () => {
      const loggedInState = {
        user: { id: '1', email: 'test@test.com', full_name: 'Test', role: 'USER' as const, is_active: true, is_verified: true, created_at: '', updated_at: '' },
        isAuthenticated: true,
        isLoading: false,
        token: 'token-123',
      };
      const state = authReducer(loggedInState, logout());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle setLoading state transitions', () => {
      const state = authReducer(undefined, setLoading(false));
      expect(state.isLoading).toBe(false);
    });
  });

  describe('cameraSlice', () => {
    it('should handle initial state correctly', () => {
      const state = cameraReducer(undefined, { type: 'unknown' });
      expect(state.isStreaming).toBe(false);
      expect(state.resolution).toBe('720p');
      expect(state.showOverlay).toBe(true);
    });

    it('should update streaming state and reset fps when stopped', () => {
      let state = cameraReducer(undefined, setStreaming(true));
      expect(state.isStreaming).toBe(true);
      state = cameraReducer(state, setFps(30));
      expect(state.fps).toBe(30);

      state = cameraReducer(state, setStreaming(false));
      expect(state.isStreaming).toBe(false);
      expect(state.fps).toBe(0);
    });

    it('should handle resolution, low light warning, and error updates', () => {
      let state = cameraReducer(undefined, setResolution('1080p'));
      expect(state.resolution).toBe('1080p');

      state = cameraReducer(state, setLowLightWarning(true));
      expect(state.lowLightWarning).toBe(true);

      state = cameraReducer(state, setCameraError('Permission denied'));
      expect(state.error).toBe('Permission denied');
    });

    it('should toggle overlay flag', () => {
      const state1 = cameraReducer(undefined, toggleOverlay());
      expect(state1.showOverlay).toBe(false);
      const state2 = cameraReducer(state1, toggleOverlay());
      expect(state2.showOverlay).toBe(true);
    });
  });

  describe('preferencesSlice', () => {
    it('should handle default accessibility preferences', () => {
      const state = preferencesReducer(undefined, { type: 'unknown' });
      expect(state.theme).toBe('dark');
      expect(state.high_contrast).toBe(false);
      expect(state.tts_speed).toBe(1.0);
    });

    it('should toggle high contrast and update theme/tts speed', () => {
      let state = preferencesReducer(undefined, toggleHighContrast());
      expect(state.high_contrast).toBe(true);

      state = preferencesReducer(state, setTheme('light'));
      expect(state.theme).toBe('light');

      state = preferencesReducer(state, setTTSSpeed(1.25));
      expect(state.tts_speed).toBe(1.25);

      state = preferencesReducer(state, setVoiceGender('male'));
      expect(state.voice_gender).toBe('male');
    });

    it('should bulk update preferences via setPreferences', () => {
      const state = preferencesReducer(
        undefined,
        setPreferences({
          reduced_motion: true,
          language: 'hi',
        })
      );
      expect(state.reduced_motion).toBe(true);
      expect(state.language).toBe('hi');
    });
  });
});
