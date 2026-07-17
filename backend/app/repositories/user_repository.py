from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.repositories.base import CRUDBase
from app.schemas.user import UserCreate, UserUpdate
from app.database import get_db

class UserRepository(CRUDBase[UserCreate, UserUpdate]):
    def __init__(self):
        super().__init__(collection_name="users")

    async def get_by_email(
        self,
        email: str,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        return await self.find_one({"email": email.lower()}, session=session)

    async def get_profile(
        self,
        user_id: str,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        db = await get_db()
        doc = await db["profiles"].find_one({"user_id": user_id, "is_deleted": False}, session=session)
        return self._convert_id(doc)

    async def create_profile(
        self,
        user_id: str,
        profile_data: Dict[str, Any],
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Dict[str, Any]:
        db = await get_db()
        profile_data = dict(profile_data)
        profile_doc = {
            "user_id": user_id,
            "full_name": profile_data.get("full_name"),
            "avatar_url": profile_data.get("avatar_url"),
            "bio": profile_data.get("bio"),
            "organization": profile_data.get("organization"),
            "accessibility_profile": profile_data.get("accessibility_profile", {
                "high_contrast": False,
                "reduced_motion": False,
                "tts_speed": 1.0,
                "voice_gender": "female",
                "font_scale": "normal"
            }),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "is_deleted": False,
            "version": 1
        }
        res = await db["profiles"].insert_one(profile_doc, session=session)
        created_doc = await db["profiles"].find_one({"_id": res.inserted_id}, session=session)
        return self._convert_id(created_doc)

    async def update_profile(
        self,
        user_id: str,
        update_data: Dict[str, Any],
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        db = await get_db()
        update_data = dict(update_data)
        update_data["updated_at"] = datetime.now(timezone.utc)
        res = await db["profiles"].find_one_and_update(
            {"user_id": user_id, "is_deleted": False},
            {"$set": update_data, "$inc": {"version": 1}},
            return_document=True,
            session=session
        )
        return self._convert_id(res)

user_repo = UserRepository()
