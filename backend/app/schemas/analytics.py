from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class AnalyticsResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    id: str
    date: str
    total_active_users: int
    total_translations: int
    avg_inference_latency_ms: float
    model_accuracy_rate: float
    websocket_connections_peak: int
    top_recognized_signs: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

class LogEntryCreate(BaseModel):
    level: str = "INFO"
    category: str = "SYSTEM"
    message: str
    correlation_id: Optional[str] = None
    metadata: Dict[str, Any] = {}

class LogEntryResponse(BaseModel):
    id: str
    timestamp: datetime
    level: str
    category: str
    message: str
    correlation_id: Optional[str] = None
    metadata: Dict[str, Any]

class SystemSettingResponse(BaseModel):
    id: str
    key: str
    value: Any
    description: str
    is_public: bool

class AuditTrailResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    details: Dict[str, Any]
    timestamp: datetime
