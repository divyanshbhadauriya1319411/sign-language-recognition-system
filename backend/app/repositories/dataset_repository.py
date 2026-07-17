from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.repositories.base import CRUDBase
from app.schemas.ai_model import DatasetCreate

class DatasetRepository(CRUDBase[DatasetCreate, DatasetCreate]):
    def __init__(self):
        super().__init__(collection_name="datasets")

    async def get_unverified_samples(self, session: Optional[AsyncIOMotorClientSession] = None) -> List[Dict[str, Any]]:
        return await self.find_many({"is_verified": False}, session=session)

dataset_repo = DatasetRepository()
