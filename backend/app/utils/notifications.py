import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class INotificationService(ABC):
    @abstractmethod
    async def send_notification(self, user_id: str, title: str, message: str, category: str = "system", action_url: Optional[str] = None) -> bool:
        pass


class DefaultNotificationService(INotificationService):
    """Orchestrates notification persistence to MongoDB and real-time push/email readiness."""
    async def send_notification(self, user_id: str, title: str, message: str, category: str = "system", action_url: Optional[str] = None) -> bool:
        try:
            from app.database import get_db
            from datetime import datetime, timezone
            db = await get_db()
            notif_doc = {
                "user_id": user_id,
                "title": title,
                "message": message,
                "category": category,
                "action_url": action_url,
                "is_read": False,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "is_deleted": False,
                "version": 1
            }
            await db["notifications"].insert_one(notif_doc)
            logger.info(f"Notification persisted for user {user_id}: [{category}] {title}")
            return True
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            return False

notification_service = DefaultNotificationService()
