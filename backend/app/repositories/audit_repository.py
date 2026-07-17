from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.database import BaseMongoRepository

class AuditRepository(BaseMongoRepository):
    def __init__(self):
        super().__init__(collection_name="audit_trails")

    async def log_action(
        self,
        user_id: Optional[str],
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Dict[str, Any]:
        doc = {
            "user_id": user_id,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc),
            "is_deleted": False,
            "version": 1
        }
        res = await self.collection.insert_one(doc, session=session)
        created_doc = await self.collection.find_one({"_id": res.inserted_id}, session=session)
        return self._convert_id(created_doc)

    async def get_logs(
        self,
        skip: int = 0,
        limit: int = 100,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"is_deleted": False}, session=session).sort("timestamp", -1).skip(skip).limit(limit)
        docs = []
        async for doc in cursor:
            docs.append(self._convert_id(doc))
        return docs

audit_repo = AuditRepository()
