from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class TranslationModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    session_id: Optional[str] = None
    conversation_id: Optional[str] = None
    recognized_gesture: str
    translated_text: str
    confidence_score: float
    speech_audio_url: Optional[str] = None
    inference_latency_ms: float = 0.0
    engine_used: str = "pytorch_bilstm"
    landmarks_snapshot: Optional[List[Dict[str, float]]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    version: int = 1

class HistoryModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    translation_id: str
    title: str
    summary_text: str
    category: str = "General"
    is_favorite: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class ConversationModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str = "New Sign Conversation"
    participant_name: Optional[str] = None
    entry_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    version: int = 1
