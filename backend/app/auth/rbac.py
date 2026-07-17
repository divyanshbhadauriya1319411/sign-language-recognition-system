from typing import List, Optional, Dict, Any, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt import decode_token
from app.repositories.user_repository import user_repo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_optional_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            return None
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = await user_repo.get_by_id(user_id)
        if user and not user.get("is_deleted", False):
            profile = await user_repo.get_profile(user_id)
            user["profile"] = profile or {
                "user_id": user_id,
                "full_name": None,
                "accessibility_profile": {
                    "high_contrast": False,
                    "reduced_motion": False,
                    "tts_speed": 1.0,
                    "voice_gender": "female"
                }
            }
            return user
        return None
    except Exception:
        return None

async def get_current_user(user: Optional[Dict[str, Any]] = Depends(get_current_optional_user)) -> Dict[str, Any]:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive or suspended user account")
    return current_user

async def get_current_admin_user(current_user: Dict[str, Any] = Depends(get_current_active_user)) -> Dict[str, Any]:
    user_role = current_user.get("role", "User")
    if user_role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required for this operation"
        )
    return current_user

def require_role(allowed_roles: List[str]) -> Callable:
    """Dependency verifying the authenticated user's role exists in allowed_roles."""
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_active_user)) -> Dict[str, Any]:
        user_role = current_user.get("role", "User")
        # Check case-insensitive role match
        allowed_lower = [r.lower() for r in allowed_roles]
        if user_role.lower() not in allowed_lower and "admin" not in allowed_lower:
            # Admins bypass role checks or if role specifically matches
            if user_role.lower() != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Required role permission({allowed_roles}) denied for current role({user_role})"
                )
        return current_user
    return role_checker

# Pre-defined role dependencies
require_admin = Depends(require_role(["Admin"]))
require_user = Depends(require_role(["User", "Admin"]))
