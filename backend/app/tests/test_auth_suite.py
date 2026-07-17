import pytest
from datetime import timedelta
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.auth.security import (
    verify_password,
    get_password_hash,
)
from app.auth.rbac import require_role
from app.config import settings

@pytest.mark.asyncio
async def test_password_hashing():
    raw_password = "SuperSecretEnterprisePassword123!"
    hashed = get_password_hash(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

@pytest.mark.asyncio
async def test_access_token_generation_and_decoding():
    user_id = "60d5ecb8b5c9c62b3c7c4b11"
    role = "User"
    token = create_access_token(subject=user_id, role=role)
    
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["role"] == role
    assert "exp" in payload

@pytest.mark.asyncio
async def test_refresh_token_generation_and_decoding():
    user_id = "60d5ecb8b5c9c62b3c7c4b11"
    token = create_refresh_token(subject=user_id)
    
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload.get("type") == "refresh"

@pytest.mark.asyncio
async def test_expired_token_rejection():
    expired_token = create_access_token(
        subject="60d5ecb8b5c9c62b3c7c4b11", role="User",
        expires_delta=timedelta(seconds=-10)
    )
    with pytest.raises(ValueError):
        decode_token(expired_token)

@pytest.mark.asyncio
async def test_require_role_dependency_creation():
    checker_admin = require_role(["Admin"])
    checker_user = require_role(["User", "Admin"])
    assert callable(checker_admin)
    assert callable(checker_user)

@pytest.mark.asyncio
async def test_auth_endpoints_unauthorized_access(async_client):
    response = await async_client.get("/api/v1/auth/me")
    assert response.status_code in [401, 403]
