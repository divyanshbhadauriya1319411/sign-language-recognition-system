import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check_endpoint(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") in ["UP", "ok", "healthy"] or "status" in data

@pytest.mark.asyncio
async def test_protected_translations_endpoint_requires_auth(async_client: AsyncClient):
    response = await async_client.get("/api/v1/translations/")
    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_protected_feedback_submission_requires_auth(async_client: AsyncClient):
    payload = {
        "translation_id": "60d5ecb8b5c9c62b3c7c4b11",
        "rating": 5,
        "comment": "Accurate prediction"
    }
    response = await async_client.post("/api/v1/feedback/", json=payload)
    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_protected_analytics_endpoint_requires_auth(async_client: AsyncClient):
    response = await async_client.get("/api/v1/admin/stats")
    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_protected_settings_update_requires_auth(async_client: AsyncClient):
    payload = {
        "user_id": "60d5ecb8b5c9c62b3c7c4b11",
        "accessibility_profile": {
            "high_contrast": True,
            "reduced_motion": False,
            "tts_speed": 1.25,
            "voice_gender": "female"
        }
    }
    response = await async_client.put("/api/v1/users/me/profile", json=payload)
    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_admin_dataset_upload_requires_admin_auth(async_client: AsyncClient):
    response = await async_client.get("/api/v1/admin/datasets")
    assert response.status_code in [401, 403]
