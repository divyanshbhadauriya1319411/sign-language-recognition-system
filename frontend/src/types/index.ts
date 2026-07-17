export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export interface AccessibilitySettings {
  high_contrast: boolean;
  theme: 'dark' | 'light';
  tts_speed: number;
  voice_gender: 'female' | 'male';
  reduced_motion: boolean;
}

export interface PrivacySettings {
  save_history: boolean;
  share_analytics: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language: string;
  accessibility_settings: AccessibilitySettings;
  privacy_settings: PrivacySettings;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TranslationEntry {
  id: string;
  session_id: string;
  recognized_gesture: string;
  translated_text: string;
  confidence_score: number;
  recorded_at: string;
}

export interface TranslationSession {
  id: string;
  user_id: string;
  ai_model_id?: string;
  title: string;
  duration_seconds: number;
  started_at: string;
  ended_at?: string;
  entries: TranslationEntry[];
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  architecture: string;
  storage_path: string;
  is_active: boolean;
  accuracy_score: number;
  vocabulary_list: any;
  deployed_at: string;
}

export interface DatasetSample {
  id: string;
  dataset_id: string;
  gesture_label: string;
  file_path?: string;
  landmark_data?: any;
  created_at: string;
}

export interface Dataset {
  id: string;
  name: string;
  version: string;
  description?: string;
  total_samples: number;
  status: 'DRAFT' | 'APPROVED' | 'ARCHIVED';
  created_at: string;
  samples: DatasetSample[];
}

export interface Feedback {
  id: string;
  user_id: string;
  entry_id?: string;
  rating: number;
  issue_type: 'INCORRECT_SIGN' | 'LOW_CONFIDENCE' | 'UI_BUG' | 'OTHER';
  comments?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  submitted_at: string;
}

export interface SystemStats {
  total_users: number;
  total_sessions: number;
  total_translations: number;
  average_confidence: number;
  active_model_name: string;
  active_model_version: string;
  system_health: string;
  timestamp: string;
}
