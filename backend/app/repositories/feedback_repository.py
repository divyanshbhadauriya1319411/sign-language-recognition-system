from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.repositories.base import CRUDBase
from app.schemas.feedback import FeedbackCreate

class FeedbackRepository(CRUDBase[FeedbackCreate, FeedbackCreate]):
    def __init__(self):
        super().__init__(collection_name="feedback")

    async def get_recent_feedback(
        self,
        skip: int = 0,
        limit: int = 100,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        return await self.find_many(skip=skip, limit=limit, sort=[("created_at", -1)], session=session)

feedback_repo = FeedbackRepository()
