from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class AIModelEntity(BaseModel):
    id: Optional[str] = None
    name: str = "ISL Bi-LSTM Sequence Classifier"
    version: str = "v2.0.0-enterprise"
    description: str = "Temporal Bi-LSTM trained on 57 Indian Sign Language vocabulary signs with 3D MediaPipe spatial invariance"
    file_path: str = "/app/models/isl_gesture_model_v2.pt"
    accuracy: float = 0.994
    loss: float = 0.012
    vocabulary_size: int = 57
    architecture: str = "BiLSTM_TCN_Temporal"
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version_num: int = 1

class DatasetModel(BaseModel):
    id: Optional[str] = None
    gesture_label: str
    sample_file_url: str
    file_type: str = "landmark_cif"  # landmark_cif | video_mp4
    uploaded_by: str
    is_verified: bool = False
    is_processed: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1
