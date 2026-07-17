from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    translation_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    issue_type: Optional[str] = "INCORRECT_SIGN"
    expected_gesture: Optional[str] = None
    actual_gesture: Optional[str] = None
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    user_id: str
    translation_id: Optional[str] = None
    rating: int
    issue_type: Optional[str] = None
    expected_gesture: Optional[str] = None
    actual_gesture: Optional[str] = None
    comments: Optional[str] = None
    is_reviewed: bool
    created_at: Optional[datetime] = None

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    category: str = "system"
    action_url: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    category: str
    is_read: bool
    action_url: Optional[str] = None
    created_at: Optional[datetime] = None
