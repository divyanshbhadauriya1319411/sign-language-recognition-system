from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class AIModelCreate(BaseModel):
    name: str = "ISL Bi-LSTM Sequence Classifier"
    version: str = "v2.0.0-enterprise"
    description: str = ""
    file_path: str
    accuracy: float = 0.994
    loss: float = 0.012
    vocabulary_size: int = 57
    architecture: str = "BiLSTM_TCN_Temporal"

class AIModelResponse(BaseModel):
    id: str
    name: str
    version: str
    description: str
    file_path: str
    accuracy: float
    loss: float
    vocabulary_size: int
    architecture: str
    is_active: bool
    created_at: Optional[datetime] = None

class DatasetCreate(BaseModel):
    gesture_label: str
    sample_file_url: str
    file_type: str = "landmark_cif"

class DatasetResponse(BaseModel):
    id: str
    gesture_label: str
    sample_file_url: str
    file_type: str
    uploaded_by: str
    is_verified: bool
    is_processed: bool
    created_at: Optional[datetime] = None
