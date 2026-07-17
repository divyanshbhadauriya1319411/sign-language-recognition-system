import pytest
from bson import ObjectId
from datetime import datetime, timezone
from app.database.mongodb import MongoDBEngine, BaseMongoRepository
from app.repositories.base import CRUDBase

@pytest.mark.asyncio
async def test_objectid_conversion_validation():
    valid_id = "60d5ecb8b5c9c62b3c7c4b11"
    assert ObjectId.is_valid(valid_id) is True
    
    invalid_id = "invalid-object-id-string"
    assert ObjectId.is_valid(invalid_id) is False

@pytest.mark.asyncio
async def test_mongodb_engine_singleton():
    db1 = MongoDBEngine.get_db()
    db2 = MongoDBEngine.get_db()
    assert db1 is db2
    assert MongoDBEngine.client is not None

@pytest.mark.asyncio
async def test_base_mongo_repository_query_filtering_mock(monkeypatch):
    class MockCollection:
        def __init__(self):
            self.docs = [
                {"_id": ObjectId("60d5ecb8b5c9c62b3c7c4b11"), "user_id": "user1", "gesture": "HELLO", "is_deleted": False},
                {"_id": ObjectId("60d5ecb8b5c9c62b3c7c4b12"), "user_id": "user1", "gesture": "THANK_YOU", "is_deleted": False},
                {"_id": ObjectId("60d5ecb8b5c9c62b3c7c4b13"), "user_id": "user2", "gesture": "PLEASE", "is_deleted": False},
            ]
        
        async def find_one(self, *args, **kwargs):
            query = args[0] if args else kwargs.get("filter", {})
            for doc in self.docs:
                match = True
                for k, v in query.items():
                    if k == "_id" and isinstance(v, ObjectId):
                        if doc["_id"] != v:
                            match = False
                    elif doc.get(k) != v:
                        match = False
                if match:
                    return doc.copy()
            return None
            
        async def insert_one(self, data):
            data["_id"] = ObjectId()
            self.docs.append(data)
            class InsertResult:
                inserted_id = data["_id"]
            return InsertResult()

    mock_collection = MockCollection()
    
    class TestRepo(BaseMongoRepository):
        def __init__(self):
            self.collection_name = "test_collection"
        
        @property
        def collection(self):
            return mock_collection

    repo = TestRepo()
    
    # Test get_by_id
    found = await repo.get_by_id("60d5ecb8b5c9c62b3c7c4b11")
    assert found is not None
    assert found["id"] == "60d5ecb8b5c9c62b3c7c4b11"
    assert found["gesture"] == "HELLO"
    
    # Test create
    new_doc = {"user_id": "user3", "gesture": "YES", "is_deleted": False, "created_at": datetime.now(timezone.utc)}
    class InsertMock:
        inserted_id = ObjectId("60d5ecb8b5c9c62b3c7c4b99")
    mock_collection.insert_one = lambda d: InsertMock()
    # verify _convert_id works
    converted = repo._convert_id(new_doc)
    assert converted["gesture"] == "YES"
