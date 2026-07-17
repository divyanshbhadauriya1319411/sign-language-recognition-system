from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, status
from app.pipeline.normalizer import landmark_normalizer
from app.pipeline.temporal_buffer import buffer_manager
from app.pipeline.classifier import isl_classifier
from app.pipeline.sentence_builder import sentence_builder
from app.tts.engine import tts_engine

router = APIRouter()

class FramePredictRequest(BaseModel):
    session_id: str = "benchmark_session"
    landmarks: List[Dict[str, float]] = []
    num_hands: int = 1

class FramePredictResponse(BaseModel):
    gesture: str
    confidence: float
    confirmed: bool
    top_predictions: List[Dict[str, Any]] = []
    sentence_tokens: List[str] = []
    formatted_sentence: str = ""
    is_sentence_final: bool = False

class SentenceCommandRequest(BaseModel):
    session_id: str = "benchmark_session"
    action: str = "UNDO_LAST_TOKEN"  # UNDO_LAST_TOKEN, CLEAR_ACTIVE_SENTENCE, CHECK_PAUSE

class SentenceStateResponse(BaseModel):
    session_id: str
    sentence_tokens: List[str]
    formatted_sentence: str
    is_sentence_final: bool
    history: List[str]

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    voice_gender: str = "female"
    speed: float = Field(1.0, ge=0.5, le=2.0)

class TTSResponse(BaseModel):
    audio_base64: str
    format: str = "audio/mpeg"

@router.post("/predict/frame", response_model=FramePredictResponse, status_code=status.HTTP_200_OK)
async def predict_single_frame(request: FramePredictRequest):
    """Single frame/landmark evaluation endpoint for benchmark testing and REST inference."""
    norm_vector = landmark_normalizer.normalize(request.landmarks, num_hands=request.num_hands)
    temporal_tensor = buffer_manager.add_frame(request.session_id, norm_vector)
    res = isl_classifier.classify_sequence(request.session_id, temporal_tensor)
    
    if res["confirmed"]:
        state = sentence_builder.add_token(request.session_id, res["gesture"], res["confidence"])
    else:
        state = sentence_builder.check_pause_boundary(request.session_id)

    return FramePredictResponse(
        gesture=res["gesture"],
        confidence=res["confidence"],
        confirmed=res["confirmed"],
        top_predictions=res.get("top_predictions", []),
        sentence_tokens=state["tokens"],
        formatted_sentence=state["formatted_sentence"],
        is_sentence_final=state["is_sentence_final"]
    )

@router.post("/predict/sentence/command", response_model=SentenceStateResponse, status_code=status.HTTP_200_OK)
async def execute_sentence_command(request: SentenceCommandRequest):
    """Interactive sentence editing commands via REST (Undo, Clear, Check Pause)."""
    action = request.action.upper()
    if action == "UNDO_LAST_TOKEN":
        state = sentence_builder.undo_last_token(request.session_id)
    elif action == "CLEAR_ACTIVE_SENTENCE":
        state = sentence_builder.clear_active_sentence(request.session_id)
    elif action == "CHECK_PAUSE":
        state = sentence_builder.check_pause_boundary(request.session_id)
    else:
        state = sentence_builder.get_sentence_state(request.session_id)
        
    return SentenceStateResponse(
        session_id=request.session_id,
        sentence_tokens=state["tokens"],
        formatted_sentence=state["formatted_sentence"],
        is_sentence_final=state["is_sentence_final"],
        history=state["history"]
    )

@router.post("/tts/synthesize", response_model=TTSResponse, status_code=status.HTTP_200_OK)
async def synthesize_tts(request: TTSRequest):
    """Converts translated text into synthesized speech audio string."""
    audio_b64 = await tts_engine.synthesize(request.text, voice_gender=request.voice_gender, speed=request.speed)
    return TTSResponse(audio_base64=audio_b64)

@router.get("/models/active", status_code=status.HTTP_200_OK)
async def get_active_model_info():
    """Returns metadata and vocabulary definition of currently active ISL model."""
    return {
        "architecture": "ISLTemporalClassifier (Bi-LSTM)",
        "num_classes": len(isl_classifier.vocabulary),
        "vocabulary": isl_classifier.vocabulary
    }
