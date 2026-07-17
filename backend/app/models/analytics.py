from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class AnalyticsModel(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    id: Optional[str] = None
    date: str = Field(..., description="ISO Date string YYYY-MM-DD")
    total_active_users: int = 0
    total_translations: int = 0
    avg_inference_latency_ms: float = 0.0
    model_accuracy_rate: float = 0.994
    websocket_connections_peak: int = 0
    top_recognized_signs: List[Dict[str, Any]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class LogEntryModel(BaseModel):
    id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: str = "INFO"  # DEBUG | INFO | WARNING | ERROR | CRITICAL
    category: str = "SYSTEM"  # AUTH | API | DB | AI | WEBSOCKET | SECURITY | STORAGE
    message: str
    correlation_id: Optional[str] = None
    metadata: Dict[str, Any] = {}
    created_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class SystemSettingModel(BaseModel):
    id: Optional[str] = None
    key: str = Field(..., description="Unique configuration setting key")
    value: Any
    description: str = ""
    is_public: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class AuditTrailModel(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    action: str = Field(..., description="Action e.g. USER_LOGIN, ROLE_CHANGED, RETRAINING_TRIGGERED")
    resource_type: str = "USER"
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    details: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    created_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1
