from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.repositories.base import CRUDBase
from app.schemas.translation import TranslationCreate
from app.database import get_db

class TranslationRepository(CRUDBase[TranslationCreate, TranslationCreate]):
    def __init__(self):
        super().__init__(collection_name="translations")

    async def get_by_user(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        return await self.find_many({"user_id": user_id}, skip=skip, limit=limit, sort=[("created_at", -1)], session=session)

    async def get_history(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        db = await get_db()
        cursor = db["history"].find({"user_id": user_id, "is_deleted": False}, session=session).sort("timestamp", -1).skip(skip).limit(limit)
        docs = []
        async for doc in cursor:
            docs.append(self._convert_id(doc))
        return docs

    async def create_history_entry(
        self,
        history_data: Dict[str, Any],
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Dict[str, Any]:
        db = await get_db()
        history_data = dict(history_data)
        history_data.setdefault("created_at", datetime.now(timezone.utc))
        history_data.setdefault("updated_at", datetime.now(timezone.utc))
        history_data.setdefault("is_deleted", False)
        history_data.setdefault("version", 1)
        res = await db["history"].insert_one(history_data, session=session)
        created_doc = await db["history"].find_one({"_id": res.inserted_id}, session=session)
        return self._convert_id(created_doc)

translation_repo = TranslationRepository()
