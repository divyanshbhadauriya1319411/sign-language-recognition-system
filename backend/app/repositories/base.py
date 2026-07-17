from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.database import BaseMongoRepository

CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(BaseMongoRepository, Generic[CreateSchemaType, UpdateSchemaType]):
    """
    MongoDB Repository base class wrapping BaseMongoRepository and supporting Pydantic schema conversions
    along with ACID transaction sessions and ObjectId conversion.
    """
    def __init__(self, collection_name: str):
        super().__init__(collection_name=collection_name)

    async def get(self, db: Any = None, id: Optional[str] = None, session: Optional[AsyncIOMotorClientSession] = None, **kwargs) -> Optional[Dict[str, Any]]:
        target_id = id or kwargs.get("doc_id")
        if not target_id:
            return None
        return await self.get_by_id(target_id, session=session)

    async def get_multi(
        self,
        db: Any = None,
        *,
        skip: int = 0,
        limit: int = 100,
        filter_query: Optional[Dict[str, Any]] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        return await self.find_many(filter_query=filter_query or {}, skip=skip, limit=limit, session=session)

    async def create(
        self,
        db: Any = None,
        *,
        obj_in: Union[CreateSchemaType, Dict[str, Any]],
        created_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Dict[str, Any]:
        obj_in_data = obj_in.model_dump() if isinstance(obj_in, BaseModel) else dict(obj_in)
        return await super().create(data=obj_in_data, created_by=created_by, session=session)

    async def update(
        self,
        db: Any = None,
        *,
        db_obj: Dict[str, Any],
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
        updated_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        obj_id = db_obj.get("id") or db_obj.get("_id")
        if not obj_id:
            return None
        if isinstance(obj_in, dict):
            update_data = dict(obj_in)
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        return await super().update(doc_id=str(obj_id), update_data=update_data, updated_by=updated_by, session=session)

    async def remove(
        self,
        db: Any = None,
        *,
        id: str,
        deleted_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> bool:
        return await self.soft_delete(doc_id=id, deleted_by=deleted_by, session=session)
