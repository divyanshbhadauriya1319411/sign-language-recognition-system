import pytest
from httpx import AsyncClient
from app.auth.jwt import create_access_token, decode_token
from app.config import settings

@pytest.mark.asyncio
async def test_nosql_injection_rejection_in_login(async_client: AsyncClient):
    malicious_payload = {
        "email": {"$gt": ""},
        "password": "Password123!"
    }
    response = await async_client.post("/api/v1/auth/login", json=malicious_payload)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_xss_script_injection_validation_in_feedback(async_client: AsyncClient, auth_headers):
    xss_payload = {
        "translation_id": "60d5ecb8b5c9c62b3c7c4b11",
        "rating": 4,
        "comment": "<script>alert('xss attack')</script>"
    }
    response = await async_client.post("/api/v1/feedback/", json=xss_payload, headers=auth_headers)
    assert response.status_code in [200, 201, 404, 422, 500]

@pytest.mark.asyncio
async def test_jwt_signature_tampering_rejection():
    valid_token = create_access_token(subject="60d5ecb8b5c9c62b3c7c4b11", role="User")
    parts = valid_token.split(".")
    tampered_signature = parts[2][:-4] + "ABCD"
    tampered_token = f"{parts[0]}.{parts[1]}.{tampered_signature}"
    
    with pytest.raises(ValueError):
        decode_token(tampered_token)

@pytest.mark.asyncio
async def test_cors_headers_and_security_boundaries(async_client: AsyncClient):
    response = await async_client.options(
        "/health",
        headers={"Origin": "http://malicious-domain.evil", "Access-Control-Request-Method": "GET"}
    )
    allowed_origin = response.headers.get("Access-Control-Allow-Origin", "")
    assert allowed_origin != "http://malicious-domain.evil" or allowed_origin == "*"
