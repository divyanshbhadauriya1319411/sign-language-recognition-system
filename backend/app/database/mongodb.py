import logging
from typing import Optional, Any, Dict, List, Union
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorClientSession
from bson import ObjectId
from app.config import settings

logger = logging.getLogger(__name__)

class MongoDBEngine:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    @classmethod
    async def connect(cls):
        if cls.client is None:
            logger.info(f"Connecting to MongoDB cluster at {settings.MONGODB_URL}")
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                maxPoolSize=50,
                minPoolSize=10,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
                uuidRepresentation="standard"
            )
            cls.db = cls.client[settings.MONGODB_DB_NAME]
            try:
                await cls.client.admin.command('ping')
                logger.info(f"Successfully connected to MongoDB database: {settings.MONGODB_DB_NAME}")
                await cls.create_indexes()
            except Exception as e:
                logger.warning(
                    f"MongoDB cluster offline or unreachable during startup ({settings.MONGODB_URL}): {e}. "
                    "Operating in resilient fallback/retry mode until database is reachable."
                )

    @classmethod
    async def disconnect(cls):
        if cls.client:
            logger.info("Closing MongoDB connection pool")
            cls.client.close()
            cls.client = None
            cls.db = None

    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        if cls.db is None:
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                maxPoolSize=50,
                minPoolSize=10,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
                uuidRepresentation="standard"
            )
            cls.db = cls.client[settings.MONGODB_DB_NAME]
        return cls.db

    @classmethod
    async def start_session(cls) -> AsyncIOMotorClientSession:
        """Start an async client session for multi-document ACID transactions."""
        if cls.client is None:
            cls.get_db()
        return await cls.client.start_session()

    @classmethod
    async def create_indexes(cls):
        """Create required indexes across collections to guarantee fast query performance and uniqueness."""
        if cls.db is None:
            return
        try:
            logger.info("Verifying and indexing MongoDB collections...")
            # Users and profiles
            await cls.db["users"].create_index("email", unique=True)
            await cls.db["users"].create_index("role")
            await cls.db["profiles"].create_index("user_id", unique=True)
            # Auth sessions
            await cls.db["sessions"].create_index("user_id")
            await cls.db["sessions"].create_index("refresh_token", unique=True, sparse=True)
            # Domain collections
            await cls.db["translations"].create_index([("user_id", 1), ("created_at", -1)])
            await cls.db["history"].create_index([("user_id", 1), ("timestamp", -1)])
            await cls.db["feedback"].create_index([("rating", 1), ("created_at", -1)])
            await cls.db["audit_trails"].create_index([("user_id", 1), ("action", 1), ("timestamp", -1)])
            await cls.db["datasets"].create_index("is_verified")
            await cls.db["ai_models"].create_index("version", unique=True)
        except Exception as e:
            logger.warning(f"Could not verify MongoDB collection indexes (database may be offline during startup): {e}")


class BaseMongoRepository:
    """
    Base Repository implementing soft deletion, versioning, audit fields, ACID transaction sessions,
    and recursive ObjectId-to-string conversion for full Pydantic V2 compatibility.
    """
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        return MongoDBEngine.get_db()[self.collection_name]

    @classmethod
    def _convert_id(cls, data: Any) -> Any:
        """Recursively convert all ObjectId occurrences (`_id` or nested fields) into strings."""
        if data is None:
            return None
        if isinstance(data, list):
            return [cls._convert_id(item) for item in data]
        if isinstance(data, dict):
            converted = {}
            for k, v in data.items():
                if k == "_id":
                    converted["id"] = str(v)
                elif isinstance(v, ObjectId):
                    converted[k] = str(v)
                elif isinstance(v, (dict, list)):
                    converted[k] = cls._convert_id(v)
                else:
                    converted[k] = v
            return converted
        if isinstance(data, ObjectId):
            return str(data)
        return data

    async def get_by_id(self, doc_id: str, session: Optional[AsyncIOMotorClientSession] = None) -> Optional[Dict[str, Any]]:
        if not ObjectId.is_valid(doc_id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(doc_id), "is_deleted": False}, session=session)
        return self._convert_id(doc)

    async def find_one(
        self,
        filter_query: Dict[str, Any],
        include_deleted: bool = False,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        if not include_deleted and "is_deleted" not in filter_query:
            filter_query["is_deleted"] = False
        doc = await self.collection.find_one(filter_query, session=session)
        return self._convert_id(doc)

    async def find_many(
        self,
        filter_query: Optional[Dict[str, Any]] = None,
        skip: int = 0,
        limit: int = 100,
        sort: Optional[List[tuple]] = None,
        include_deleted: bool = False,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> List[Dict[str, Any]]:
        if filter_query is None:
            filter_query = {}
        if not include_deleted and "is_deleted" not in filter_query:
            filter_query["is_deleted"] = False

        cursor = self.collection.find(filter_query, session=session).skip(skip).limit(limit)
        if sort:
            cursor = cursor.sort(sort)
        else:
            cursor = cursor.sort("created_at", -1)

        docs = []
        async for doc in cursor:
            docs.append(self._convert_id(doc))
        return docs

    async def create(
        self,
        data: Dict[str, Any],
        created_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        data = dict(data)
        data.update({
            "created_at": now,
            "updated_at": now,
            "is_deleted": False,
            "deleted_at": None,
            "version": 1,
            "created_by": created_by
        })
        if "id" in data and not data["id"]:
            data.pop("id", None)
        if "_id" in data and isinstance(data["_id"], str) and ObjectId.is_valid(data["_id"]):
            data["_id"] = ObjectId(data["_id"])

        result = await self.collection.insert_one(data, session=session)
        doc = await self.collection.find_one({"_id": result.inserted_id}, session=session)
        return self._convert_id(doc)

    async def update(
        self,
        doc_id: str,
        update_data: Dict[str, Any],
        updated_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> Optional[Dict[str, Any]]:
        if not ObjectId.is_valid(doc_id):
            return None
        update_data = dict(update_data)
        update_data["updated_at"] = datetime.now(timezone.utc)
        if updated_by:
            update_data["updated_by"] = updated_by

        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(doc_id), "is_deleted": False},
            {"$set": update_data, "$inc": {"version": 1}},
            return_document=True,
            session=session
        )
        return self._convert_id(result)

    async def soft_delete(
        self,
        doc_id: str,
        deleted_by: Optional[str] = None,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> bool:
        if not ObjectId.is_valid(doc_id):
            return False
        now = datetime.now(timezone.utc)
        result = await self.collection.update_one(
            {"_id": ObjectId(doc_id), "is_deleted": False},
            {"$set": {"is_deleted": True, "deleted_at": now, "deleted_by": deleted_by}, "$inc": {"version": 1}},
            session=session
        )
        return result.modified_count > 0

    async def hard_delete(
        self,
        doc_id: str,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> bool:
        if not ObjectId.is_valid(doc_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(doc_id)}, session=session)
        return result.deleted_count > 0

    async def count(
        self,
        filter_query: Optional[Dict[str, Any]] = None,
        include_deleted: bool = False,
        session: Optional[AsyncIOMotorClientSession] = None
    ) -> int:
        if filter_query is None:
            filter_query = {}
        if not include_deleted and "is_deleted" not in filter_query:
            filter_query["is_deleted"] = False
        return await self.collection.count_documents(filter_query, session=session)


async def get_db() -> AsyncIOMotorDatabase:
    return MongoDBEngine.get_db()
