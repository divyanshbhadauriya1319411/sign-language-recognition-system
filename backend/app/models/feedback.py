from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class FeedbackModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    translation_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    issue_type: Optional[str] = None  # INCORRECT_SIGN | LOW_CONFIDENCE | AUDIO_ISSUE | OTHER
    expected_gesture: Optional[str] = None
    actual_gesture: Optional[str] = None
    comments: Optional[str] = None
    is_reviewed: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class NotificationModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    message: str
    category: str = "system"  # system | security | training | model_update
    is_read: bool = False
    action_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1
