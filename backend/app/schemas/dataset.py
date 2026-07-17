from app.schemas.ai_model import DatasetCreate, DatasetResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

class DatasetSampleCreate(BaseModel):
    gesture_label: str
    file_path: Optional[str] = None
    landmark_data: Optional[Dict[str, Any]] = None

class DatasetSampleResponse(BaseModel):
    id: str
    dataset_id: str
    gesture_label: str
    file_path: Optional[str] = None
    landmark_data: Optional[Dict[str, Any]] = None

__all__ = ["DatasetCreate", "DatasetResponse", "DatasetSampleCreate", "DatasetSampleResponse"]
