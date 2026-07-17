from typing import Optional, Dict, Any
from fastapi import status
from app.core.errors import AppException
from app.repositories.user_repository import user_repo
from app.repositories.audit_repository import audit_repo
from app.schemas.user import ProfileUpdate, UserResponse, ProfileResponse

class UserService:
    async def get_my_profile(self, user_id: str) -> UserResponse:
        user_doc = await user_repo.get_by_id(user_id)
        if not user_doc:
            raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="User not found", error_code="ERR_USER_NOT_FOUND")
        profile_doc = await user_repo.get_profile(user_id)
        profile_resp = ProfileResponse(
            user_id=user_id,
            full_name=profile_doc.get("full_name") if profile_doc else None,
            avatar_url=profile_doc.get("avatar_url") if profile_doc else None,
            bio=profile_doc.get("bio") if profile_doc else None,
            phone_number=profile_doc.get("phone_number") if profile_doc else None,
            organization=profile_doc.get("organization") if profile_doc else None,
            accessibility_profile=profile_doc.get("accessibility_profile") if profile_doc else {
                "high_contrast": False, "reduced_motion": False, "tts_speed": 1.0, "voice_gender": "female", "font_scale": "normal"
            }
        )
        return UserResponse(
            id=user_id,
            email=user_doc.get("email", ""),
            role=user_doc.get("role", "User"),
            is_active=user_doc.get("is_active", True),
            is_verified=user_doc.get("is_verified", True),
            profile=profile_resp,
            created_at=user_doc.get("created_at")
        )

    async def update_my_profile(self, user_id: str, profile_in: ProfileUpdate) -> ProfileResponse:
        profile_doc = await user_repo.get_profile(user_id)
        update_data = profile_in.model_dump(exclude_unset=True)
        if not profile_doc:
            updated_doc = await user_repo.create_profile(user_id, update_data)
        else:
            updated_doc = await user_repo.update_profile(user_id, update_data)

        await audit_repo.log_action(
            user_id=user_id, action="PROFILE_UPDATED", resource_type="Profile", resource_id=str(updated_doc.get("id"))
        )

        return ProfileResponse(
            user_id=user_id,
            full_name=updated_doc.get("full_name"),
            avatar_url=updated_doc.get("avatar_url"),
            bio=updated_doc.get("bio"),
            phone_number=updated_doc.get("phone_number"),
            organization=updated_doc.get("organization"),
            accessibility_profile=updated_doc.get("accessibility_profile", {
                "high_contrast": False, "reduced_motion": False, "tts_speed": 1.0, "voice_gender": "female", "font_scale": "normal"
            })
        )

user_service = UserService()
