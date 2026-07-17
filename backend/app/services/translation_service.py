import csv
import io
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import status
from app.core.errors import AppException
from app.repositories.translation_repository import translation_repo
from app.repositories.ai_model_repository import ai_model_repo
from app.repositories.audit_repository import audit_repo
from app.schemas.translation import (
    TranslationCreate, TranslationResponse, HistoryCreate, HistoryResponse,
    ConversationCreate, ConversationResponse
)

class TranslationService:
    async def create_translation(self, user_id: str, request: TranslationCreate) -> TranslationResponse:
        data = request.model_dump()
        data["user_id"] = user_id
        doc = await translation_repo.create(obj_in=data, created_by=user_id)
        
        # Automatically record history entry
        history_data = {
            "user_id": user_id,
            "translation_id": str(doc["id"]),
            "title": f"Sign: {request.recognized_gesture}",
            "summary_text": request.translated_text,
            "category": "General",
            "is_favorite": False,
            "timestamp": datetime.now(timezone.utc)
        }
        await translation_repo.create_history_entry(history_data)

        await audit_repo.log_action(
            user_id=user_id, action="TRANSLATION_RECORDED", resource_type="Translation", resource_id=str(doc["id"])
        )

        return TranslationResponse(
            id=str(doc["id"]),
            user_id=user_id,
            session_id=doc.get("session_id"),
            conversation_id=doc.get("conversation_id"),
            recognized_gesture=doc["recognized_gesture"],
            translated_text=doc["translated_text"],
            confidence_score=doc["confidence_score"],
            speech_audio_url=doc.get("speech_audio_url"),
            inference_latency_ms=doc.get("inference_latency_ms", 0.0),
            engine_used=doc.get("engine_used", "pytorch_bilstm"),
            created_at=doc.get("created_at")
        )

    async def get_user_translations(self, user_id: str, skip: int = 0, limit: int = 50) -> List[TranslationResponse]:
        docs = await translation_repo.get_by_user(user_id=user_id, skip=skip, limit=limit)
        return [
            TranslationResponse(
                id=str(d["id"]),
                user_id=d["user_id"],
                session_id=d.get("session_id"),
                conversation_id=d.get("conversation_id"),
                recognized_gesture=d["recognized_gesture"],
                translated_text=d["translated_text"],
                confidence_score=d["confidence_score"],
                speech_audio_url=d.get("speech_audio_url"),
                inference_latency_ms=d.get("inference_latency_ms", 0.0),
                engine_used=d.get("engine_used", "pytorch_bilstm"),
                created_at=d.get("created_at")
            ) for d in docs
        ]

    async def get_user_history(self, user_id: str, skip: int = 0, limit: int = 50) -> List[HistoryResponse]:
        docs = await translation_repo.get_history(user_id=user_id, skip=skip, limit=limit)
        return [
            HistoryResponse(
                id=str(d["id"]),
                user_id=d["user_id"],
                translation_id=d["translation_id"],
                title=d.get("title", ""),
                summary_text=d.get("summary_text", ""),
                category=d.get("category", "General"),
                is_favorite=d.get("is_favorite", False),
                timestamp=d.get("timestamp", datetime.now(timezone.utc)),
                created_at=d.get("created_at")
            ) for d in docs
        ]

    async def add_history_entry(self, user_id: str, request: HistoryCreate) -> HistoryResponse:
        data = request.model_dump()
        data["user_id"] = user_id
        data["timestamp"] = datetime.now(timezone.utc)
        doc = await translation_repo.create_history_entry(data)
        return HistoryResponse(
            id=str(doc["id"]),
            user_id=user_id,
            translation_id=doc["translation_id"],
            title=doc["title"],
            summary_text=doc["summary_text"],
            category=doc["category"],
            is_favorite=doc.get("is_favorite", False),
            timestamp=doc["timestamp"],
            created_at=doc.get("created_at")
        )

    async def export_history_csv(self, user_id: str) -> str:
        docs = await translation_repo.get_history(user_id=user_id, skip=0, limit=1000)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Timestamp", "Title", "Summary Text", "Category", "Favorite"])
        for d in docs:
            ts = d.get("timestamp", datetime.now(timezone.utc))
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S") if isinstance(ts, datetime) else str(ts)
            writer.writerow([
                ts_str,
                d.get("title", ""),
                d.get("summary_text", ""),
                d.get("category", "General"),
                "Yes" if d.get("is_favorite") else "No"
            ])
        return output.getvalue()

translation_service = TranslationService()
