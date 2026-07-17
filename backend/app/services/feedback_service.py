from typing import List, Optional, Dict, Any
from app.repositories.feedback_repository import feedback_repo
from app.repositories.audit_repository import audit_repo
from app.schemas.feedback import FeedbackCreate, FeedbackResponse

class FeedbackService:
    async def create_feedback(self, user_id: str, request: FeedbackCreate) -> FeedbackResponse:
        data = request.model_dump()
        data["user_id"] = user_id
        data["is_reviewed"] = False
        doc = await feedback_repo.create(obj_in=data, created_by=user_id)
        
        await audit_repo.log_action(
            user_id=user_id, action="FEEDBACK_SUBMITTED", resource_type="Feedback", resource_id=str(doc["id"])
        )

        return FeedbackResponse(
            id=str(doc["id"]),
            user_id=user_id,
            translation_id=doc.get("translation_id"),
            rating=doc["rating"],
            issue_type=doc.get("issue_type"),
            expected_gesture=doc.get("expected_gesture"),
            actual_gesture=doc.get("actual_gesture"),
            comments=doc.get("comments"),
            is_reviewed=doc.get("is_reviewed", False),
            created_at=doc.get("created_at")
        )

    async def list_feedback(self, skip: int = 0, limit: int = 100) -> List[FeedbackResponse]:
        docs = await feedback_repo.get_recent_feedback(skip=skip, limit=limit)
        return [
            FeedbackResponse(
                id=str(d["id"]),
                user_id=d["user_id"],
                translation_id=d.get("translation_id"),
                rating=d["rating"],
                issue_type=d.get("issue_type"),
                expected_gesture=d.get("expected_gesture"),
                actual_gesture=d.get("actual_gesture"),
                comments=d.get("comments"),
                is_reviewed=d.get("is_reviewed", False),
                created_at=d.get("created_at")
            ) for d in docs
        ]

feedback_service = FeedbackService()
