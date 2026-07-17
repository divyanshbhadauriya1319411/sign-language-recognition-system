from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class TranslationCreate(BaseModel):
    recognized_gesture: str
    translated_text: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    session_id: Optional[str] = None
    conversation_id: Optional[str] = None
    speech_audio_url: Optional[str] = None
    inference_latency_ms: float = 0.0
    engine_used: str = "pytorch_bilstm"

class TranslationResponse(BaseModel):
    id: str
    user_id: str
    session_id: Optional[str] = None
    conversation_id: Optional[str] = None
    recognized_gesture: str
    translated_text: str
    confidence_score: float
    speech_audio_url: Optional[str] = None
    inference_latency_ms: float
    engine_used: str
    created_at: Optional[datetime] = None

class HistoryCreate(BaseModel):
    translation_id: str
    title: str
    summary_text: str
    category: str = "General"

class HistoryResponse(BaseModel):
    id: str
    user_id: str
    translation_id: str
    title: str
    summary_text: str
    category: str
    is_favorite: bool
    timestamp: datetime
    created_at: Optional[datetime] = None

class ConversationCreate(BaseModel):
    title: str = "New Sign Conversation"
    participant_name: Optional[str] = None

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    participant_name: Optional[str] = None
    entry_count: int
    created_at: Optional[datetime] = None
