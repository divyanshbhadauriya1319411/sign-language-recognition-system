import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_ai_health_check(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert "vocabulary_size" in data

@pytest.mark.asyncio
async def test_predict_frame_endpoint(async_client: AsyncClient, mock_landmarks):
    payload = {
        "session_id": "test_api_session",
        "landmarks": mock_landmarks,
        "num_hands": 1
    }
    response = await async_client.post("/ai/v1/predict/frame", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "gesture" in data
    assert "confidence" in data
    assert "confirmed" in data

@pytest.mark.asyncio
async def test_sentence_command_endpoint(async_client: AsyncClient):
    payload = {
        "session_id": "test_api_session",
        "action": "CHECK_PAUSE"
    }
    response = await async_client.post("/ai/v1/predict/sentence/command", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "sentence_tokens" in data

@pytest.mark.asyncio
async def test_get_active_model_info(async_client: AsyncClient):
    response = await async_client.get("/ai/v1/models/active")
    assert response.status_code == 200
    data = response.json()
    assert "architecture" in data
    assert "vocabulary" in data
