from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.repositories.base import CRUDBase
from app.schemas.ai_model import AIModelCreate

class AIModelRepository(CRUDBase[AIModelCreate, AIModelCreate]):
    def __init__(self):
        super().__init__(collection_name="ai_models")

    async def get_active_model(self, session: Optional[AsyncIOMotorClientSession] = None) -> Optional[Dict[str, Any]]:
        return await self.find_one({"is_active": True}, session=session)

ai_model_repo = AIModelRepository()
