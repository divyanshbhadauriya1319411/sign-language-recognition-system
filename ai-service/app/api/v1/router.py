from fastapi import APIRouter
from app.api.v1.endpoints import stream, predict

api_router = APIRouter()

api_router.include_router(stream.router, prefix="/stream", tags=["Real-Time WebSocket Stream"])
api_router.include_router(predict.router, tags=["AI Inference & TTS REST API"])
