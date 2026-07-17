import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent

class AISettings(BaseSettings):
    PROJECT_NAME: str = "SignBridge AI Engine"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    REDIS_URL: str = "redis://redis:6379/0"
    
    AI_MODEL_PATH: str = str(BASE_DIR / "models_store" / "isl_gesture_model_v1.pt")
    AI_VOCABULARY_PATH: str = str(BASE_DIR / "models_store" / "vocabulary.json")
    
    TEMPORAL_BUFFER_SIZE: int = 30
    CONFIDENCE_THRESHOLD: float = 0.75
    MIN_HAND_DETECTION_CONFIDENCE: float = 0.7
    MIN_HAND_TRACKING_CONFIDENCE: float = 0.5
    CONSECUTIVE_CONFIRM_FRAMES: int = 3
    
    # Sentence Builder thresholds
    PAUSE_THRESHOLD_SECONDS: float = 1.2
    DEBOUNCE_COOLDOWN_SECONDS: float = 0.25

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = AISettings()
