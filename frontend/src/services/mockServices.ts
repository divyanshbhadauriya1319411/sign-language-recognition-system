import { User } from '@/types';

export const MOCK_ADMIN_USER: User = {
  id: 'mock-user-admin-001',
  email: 'admin@signbridge.com',
  is_active: true,
  is_verified: true,
  role: 'ADMIN',
  created_at: new Date(Date.now() - 31536000000).toISOString(),
  updated_at: new Date().toISOString(),
  profile: {
    id: 'mock-profile-001',
    user_id: 'mock-user-admin-001',
    full_name: 'SignBridge Enterprise Admin',
    avatar_url: '',
    preferred_language: 'en',
    accessibility_settings: {
      high_contrast: false,
      theme: 'dark',
      tts_speed: 1.0,
      voice_gender: 'female',
      reduced_motion: false,
    },
    privacy_settings: {
      save_history: true,
      share_analytics: true,
    },
  },
};

export const MOCK_TRANSLATIONS_HISTORY = [
  {
    id: 'hist-item-101',
    user_id: 'mock-user-admin-001',
    input_gesture: 'HELLO',
    translated_text: 'Hello, welcome to SignBridge Enterprise.',
    confidence_score: 0.985,
    duration_seconds: 2.4,
    modality: 'GESTURE_TO_SPEECH',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'hist-item-102',
    user_id: 'mock-user-admin-001',
    input_gesture: 'THANK_YOU',
    translated_text: 'Thank you for testing our real-time AI pipeline.',
    confidence_score: 0.992,
    duration_seconds: 1.8,
    modality: 'GESTURE_TO_SPEECH',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'hist-item-103',
    user_id: 'mock-user-admin-001',
    input_gesture: 'PLEASE_HELP',
    translated_text: 'Please assist with translation.',
    confidence_score: 0.941,
    duration_seconds: 3.1,
    modality: 'GESTURE_TO_TEXT',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'hist-item-104',
    user_id: 'mock-user-admin-001',
    input_gesture: 'YES',
    translated_text: 'Yes, acknowledged.',
    confidence_score: 0.998,
    duration_seconds: 1.2,
    modality: 'GESTURE_TO_SPEECH',
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 'hist-item-105',
    user_id: 'mock-user-admin-001',
    input_gesture: 'NO',
    translated_text: 'No sign detected / rejected.',
    confidence_score: 0.964,
    duration_seconds: 1.5,
    modality: 'GESTURE_TO_TEXT',
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const MOCK_ADMIN_STATS = {
  total_users: 142,
  total_translations: 3840,
  average_confidence: 0.992,
  active_websocket_connections: 18,
  system_health: 'OPTIMAL',
  daily_volume: [
    { date: 'Mon', count: 420 },
    { date: 'Tue', count: 580 },
    { date: 'Wed', count: 610 },
    { date: 'Thu', count: 730 },
    { date: 'Fri', count: 690 },
    { date: 'Sat', count: 450 },
    { date: 'Sun', count: 360 },
  ],
};

export const MOCK_ADMIN_USERS_LIST: User[] = [
  MOCK_ADMIN_USER,
  {
    id: 'mock-user-002',
    email: 'researcher@ai-lab.org',
    is_active: true,
    is_verified: true,
    role: 'USER',
    created_at: new Date(Date.now() - 15000000000).toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      id: 'mock-profile-002',
      user_id: 'mock-user-002',
      full_name: 'Dr. Elena Rostova',
      preferred_language: 'en',
      accessibility_settings: {
        high_contrast: false,
        theme: 'light',
        tts_speed: 1.0,
        voice_gender: 'female',
        reduced_motion: false,
      },
      privacy_settings: {
        save_history: true,
        share_analytics: false,
      },
    },
  },
  {
    id: 'mock-user-003',
    email: 'qa-tester@signbridge.com',
    is_active: true,
    is_verified: true,
    role: 'USER',
    created_at: new Date(Date.now() - 8000000000).toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      id: 'mock-profile-003',
      user_id: 'mock-user-003',
      full_name: 'QA Testing Analyst',
      preferred_language: 'en',
      accessibility_settings: {
        high_contrast: false,
        theme: 'dark',
        tts_speed: 1.0,
        voice_gender: 'male',
        reduced_motion: false,
      },
      privacy_settings: {
        save_history: true,
        share_analytics: true,
      },
    },
  },
];

export const MOCK_SYSTEM_HEALTH = {
  status: 'OPTIMAL',
  database: { status: 'CONNECTED', pool_size: 10, active_connections: 3 },
  redis: { status: 'ONLINE', memory_used_mb: 28.4, keys: 142 },
  celery_workers: { status: 'RUNNING', active_tasks: 0, completed_tasks: 84 },
  ai_service: { status: 'ONLINE', endpoint: 'ws://localhost:8001/ai/v1/stream', avg_latency_ms: 26.8 },
};

export const MOCK_FEEDBACK_SUBMISSIONS = [
  {
    id: 'fb-001',
    user_id: 'mock-user-admin-001',
    gesture_name: 'HELLO',
    status: 'VERIFIED',
    submitted_at: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Clear landmark capture under good lighting.',
  },
  {
    id: 'fb-002',
    user_id: 'mock-user-002',
    gesture_name: 'EMERGENCY',
    status: 'PENDING',
    submitted_at: new Date(Date.now() - 36000000).toISOString(),
    notes: 'Rapid gesture variation, needs dataset augmentation.',
  },
];

export function getMockResponseByEndpoint(url: string, method: string = 'get'): any {
  const cleanUrl = url.replace(/^[a-zA-Z]+:\/\/[^/]+(\/api\/v1)?/, '').split('?')[0];

  if (cleanUrl.includes('/users/me/profile') && method.toLowerCase() === 'put') {
    return { ...MOCK_ADMIN_USER.profile, message: 'Profile updated in testing build' };
  }
  if (cleanUrl.includes('/users/me')) {
    return MOCK_ADMIN_USER;
  }
  if (cleanUrl.includes('/auth/login') || cleanUrl.includes('/auth/register')) {
    return {
      access_token: 'mock-access-token-jwt-testing-build',
      refresh_token: 'mock-refresh-token-jwt-testing-build',
      token_type: 'bearer',
    };
  }
  if (cleanUrl.includes('/auth/refresh')) {
    return {
      access_token: 'mock-access-token-jwt-testing-build-refreshed',
      refresh_token: 'mock-refresh-token-jwt-testing-build-refreshed',
      token_type: 'bearer',
    };
  }
  if (cleanUrl.includes('/translations/history')) {
    return MOCK_TRANSLATIONS_HISTORY;
  }
  if (cleanUrl.includes('/translations/')) {
    return MOCK_TRANSLATIONS_HISTORY;
  }
  if (cleanUrl.includes('/admin/stats')) {
    return MOCK_ADMIN_STATS;
  }
  if (cleanUrl.includes('/admin/users')) {
    return MOCK_ADMIN_USERS_LIST;
  }
  if (cleanUrl.includes('/admin/health')) {
    return MOCK_SYSTEM_HEALTH;
  }
  if (cleanUrl.includes('/feedback/my-submissions')) {
    return MOCK_FEEDBACK_SUBMISSIONS;
  }
  if (cleanUrl.includes('/admin/train')) {
    return { task_id: 'mock_celery_task_84920', status: 'SUBMITTED', message: 'Mock training job triggered successfully' };
  }
  return { status: 'SUCCESS', message: 'Mock testing response' };
}
