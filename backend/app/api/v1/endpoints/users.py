from fastapi import APIRouter, Depends, status
from typing import Dict, Any
from app.auth.rbac import get_current_active_user
from app.schemas.user import UserResponse, ProfileUpdate, ProfileResponse
from app.services import user_service

router = APIRouter()

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Retrieve current authenticated user profile and settings."""
    return await user_service.get_my_profile(user_id=str(current_user["id"]))

@router.put("/me/profile", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
async def update_my_profile(
    profile_in: ProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Update profile details, language, accessibility preferences, and privacy controls."""
    return await user_service.update_my_profile(user_id=str(current_user["id"]), profile_in=profile_in)
