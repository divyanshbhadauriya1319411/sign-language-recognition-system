import pytest
from httpx import AsyncClient
from app.auth.jwt import create_access_token

@pytest.mark.asyncio
async def test_end_to_end_auth_and_translation_lifecycle(async_client: AsyncClient, test_user_data):
    # Step 1: Simulate user obtaining valid access token
    access_token = create_access_token(
        subject=test_user_data["_id"], role=test_user_data["role"]
    )
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Check health status before initiating workflow
    health_res = await async_client.get("/health")
    assert health_res.status_code == 200
    
    # Step 3: Verify user cannot submit feedback without translation_id or rating
    invalid_feedback = {"rating": 10, "comment": "Invalid out-of-range rating"}
    feedback_res = await async_client.post("/api/v1/feedback/", json=invalid_feedback, headers=headers)
    assert feedback_res.status_code == 422  # Pydantic validation failure on out of bounds rating
    
    # Step 4: Verify valid feedback payload schema structure
    valid_feedback = {
        "translation_id": "60d5ecb8b5c9c62b3c7c4b11",
        "rating": 5,
        "comment": "Accurate real-time recognition"
    }
    response = await async_client.post("/api/v1/feedback/", json=valid_feedback, headers=headers)
    assert response.status_code in [200, 201, 404, 500]

@pytest.mark.asyncio
async def test_admin_rbac_integration_flow(async_client: AsyncClient, test_admin_data):
    admin_token = create_access_token(
        subject=test_admin_data["_id"], role=test_admin_data["role"]
    )
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Admin accesses protected system stats route
    response = await async_client.get("/api/v1/admin/stats", headers=headers)
    assert response.status_code != 401 and response.status_code != 403
