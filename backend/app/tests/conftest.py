import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone, timedelta
from app.main import app
from app.auth.jwt import create_access_token, create_refresh_token
from app.auth.security import get_password_hash
from app.repositories.user_repository import user_repo
from app.repositories.feedback_repository import feedback_repo
from app.repositories.audit_repository import audit_repo
from app.services import admin_service

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

@pytest.fixture
def test_user_data():
    return {
        "_id": "60d5ecb8b5c9c62b3c7c4b11",
        "id": "60d5ecb8b5c9c62b3c7c4b11",
        "email": "testuser@signbridge.enterprise",
        "full_name": "Test User",
        "hashed_password": get_password_hash("SecretPassword123!"),
        "role": "User",
        "is_active": True,
        "is_verified": True,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc)
    }

@pytest.fixture
def test_admin_data():
    return {
        "_id": "60d5ecb8b5c9c62b3c7c4b99",
        "id": "60d5ecb8b5c9c62b3c7c4b99",
        "email": "admin@signbridge.enterprise",
        "full_name": "Enterprise Admin",
        "hashed_password": get_password_hash("AdminPassword123!"),
        "role": "Admin",
        "is_active": True,
        "is_verified": True,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc)
    }

@pytest.fixture(autouse=True)
def mock_repositories_and_services_for_tests(monkeypatch, test_user_data, test_admin_data):
    # Mock user_repo.get_by_id
    async def mock_get_by_id(doc_id, *args, **kwargs):
        doc_id_str = str(doc_id)
        if doc_id_str == "60d5ecb8b5c9c62b3c7c4b11":
            return test_user_data.copy()
        if doc_id_str == "60d5ecb8b5c9c62b3c7c4b99":
            return test_admin_data.copy()
        return None

    # Mock user_repo.get_profile
    async def mock_get_profile(user_id, *args, **kwargs):
        user_id_str = str(user_id)
        if user_id_str in ["60d5ecb8b5c9c62b3c7c4b11", "60d5ecb8b5c9c62b3c7c4b99"]:
            return {
                "user_id": user_id_str,
                "full_name": "Test User Profile",
                "accessibility_profile": {
                    "high_contrast": False,
                    "reduced_motion": False,
                    "tts_speed": 1.0,
                    "voice_gender": "female"
                }
            }
        return None

    # Mock feedback_repo.create to avoid DB insertion during unit tests
    async def mock_feedback_create(*args, **kwargs):
        data = kwargs.get("obj_in") or (args[0] if args else {})
        if hasattr(data, "model_dump"):
            data_dict = data.model_dump()
        elif isinstance(data, dict):
            data_dict = data.copy()
        else:
            data_dict = {}
        data_dict["id"] = "60d5ecb8b5c9c62b3c7c4fff"
        data_dict["created_at"] = datetime.now(timezone.utc)
        return data_dict

    # Mock audit_repo.log_action to avoid hitting motor inside services
    async def mock_log_action(*args, **kwargs):
        return True

    # Mock admin_service.get_system_stats to return mock stats
    async def mock_get_system_stats(*args, **kwargs):
        return {
            "total_users": 10,
            "active_sessions": 5,
            "total_translations": 150,
            "system_health": "OPTIMAL"
        }

    monkeypatch.setattr(user_repo, "get_by_id", mock_get_by_id)
    monkeypatch.setattr(user_repo, "get_profile", mock_get_profile)
    monkeypatch.setattr(feedback_repo, "create", mock_feedback_create)
    monkeypatch.setattr(audit_repo, "log_action", mock_log_action)
    monkeypatch.setattr(admin_service, "get_system_stats", mock_get_system_stats)


@pytest.fixture
def valid_access_token(test_user_data):
    return create_access_token(
        subject=test_user_data["_id"], role=test_user_data["role"]
    )

@pytest.fixture
def admin_access_token(test_admin_data):
    return create_access_token(
        subject=test_admin_data["_id"], role=test_admin_data["role"]
    )

@pytest.fixture
def expired_access_token(test_user_data):
    return create_access_token(
        subject=test_user_data["_id"], role=test_user_data["role"],
        expires_delta=timedelta(minutes=-30)
    )

@pytest.fixture
def auth_headers(valid_access_token):
    return {"Authorization": f"Bearer {valid_access_token}"}

@pytest.fixture
def admin_headers(admin_access_token):
    return {"Authorization": f"Bearer {admin_access_token}"}
