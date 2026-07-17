from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import status
from app.core.errors import AppException
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    create_verification_token,
    create_reset_token,
    decode_token
)
from app.auth.security import verify_password, get_password_hash
from app.repositories.user_repository import user_repo
from app.repositories.audit_repository import audit_repo
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse, ProfileResponse
from app.schemas.auth import TokenValidationResponse, MessageResponse
from app.config import settings

class AuthService:
    async def register(self, request: UserCreate) -> TokenResponse:
        existing = await user_repo.get_by_email(email=request.email)
        if existing and not existing.get("is_deleted", False):
            raise AppException(status_code=status.HTTP_400_BAD_REQUEST, message="User with this email already exists.", error_code="ERR_AUTH_DUPLICATE")
        
        # If first user, make Admin
        total_users = await user_repo.count()
        role = "Admin" if total_users == 0 else (request.role or "User")

        hashed_pwd = get_password_hash(request.password)
        new_user_data = {
            "email": request.email.lower(),
            "hashed_password": hashed_pwd,
            "role": role,
            "is_active": True,
            "is_verified": False if total_users > 0 else True
        }
        user_doc = await user_repo.create(obj_in=new_user_data)
        user_id = str(user_doc["id"])

        profile_data = {
            "full_name": request.full_name,
            "accessibility_profile": {
                "high_contrast": False,
                "reduced_motion": False,
                "tts_speed": 1.0,
                "voice_gender": "female",
                "font_scale": "normal"
            }
        }
        profile_doc = await user_repo.create_profile(user_id=user_id, profile_data=profile_data)

        # Generate verification token if not automatically verified
        if not user_doc.get("is_verified", True):
            verification_token = create_verification_token(subject=user_id)
            # In production, dispatch verification email here

        await audit_repo.log_action(
            user_id=user_id, action="USER_REGISTERED", resource_type="User", resource_id=user_id
        )

        return await self._issue_tokens(user_doc, profile_doc)

    async def login(self, request: UserLogin, ip_address: Optional[str] = None) -> TokenResponse:
        user_doc = await user_repo.get_by_email(email=request.email)
        if not user_doc or not verify_password(request.password, user_doc.get("hashed_password", "")):
            raise AppException(status_code=status.HTTP_401_UNAUTHORIZED, message="Invalid email or password.", error_code="ERR_AUTH_CREDENTIALS")
        
        if not user_doc.get("is_active", True):
            raise AppException(status_code=status.HTTP_403_FORBIDDEN, message="User account has been deactivated.", error_code="ERR_AUTH_INACTIVE")

        user_id = str(user_doc["id"])
        profile_doc = await user_repo.get_profile(user_id=user_id)

        await audit_repo.log_action(
            user_id=user_id, action="USER_LOGIN", resource_type="User", resource_id=user_id, ip_address=ip_address
        )

        return await self._issue_tokens(user_doc, profile_doc)

    async def refresh_tokens(self, refresh_token_str: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token_str)
            if payload.get("type") != "refresh":
                raise ValueError("Provided token is not a refresh token")
            user_id = payload.get("sub")
        except Exception as e:
            raise AppException(status_code=status.HTTP_401_UNAUTHORIZED, message=f"Invalid refresh token: {str(e)}", error_code="ERR_AUTH_REFRESH_INVALID")

        from app.database import get_db
        db = await get_db()
        session_doc = await db["sessions"].find_one({"refresh_token": refresh_token_str, "is_deleted": False})
        if not session_doc or session_doc.get("is_revoked", False) or session_doc.get("expires_at") < datetime.now(timezone.utc):
            raise AppException(status_code=status.HTTP_401_UNAUTHORIZED, message="Expired or revoked refresh token.", error_code="ERR_AUTH_REFRESH_EXPIRED")

        user_doc = await user_repo.get_by_id(user_id)
        if not user_doc or not user_doc.get("is_active", True):
            raise AppException(status_code=status.HTTP_401_UNAUTHORIZED, message="User inactive or not found.", error_code="ERR_AUTH_INACTIVE")

        # Revoke old refresh token (rotation)
        await db["sessions"].update_one({"_id": session_doc["_id"]}, {"$set": {"is_revoked": True}})

        profile_doc = await user_repo.get_profile(user_id=user_id)
        return await self._issue_tokens(user_doc, profile_doc)

    async def logout(self, user_id: str) -> None:
        from app.database import get_db
        db = await get_db()
        await db["sessions"].update_many({"user_id": user_id, "is_revoked": False}, {"$set": {"is_revoked": True}})
        await audit_repo.log_action(user_id=user_id, action="USER_LOGOUT", resource_type="User", resource_id=user_id)

    async def forgot_password(self, email: str, ip_address: Optional[str] = None) -> MessageResponse:
        user_doc = await user_repo.get_by_email(email=email)
        if user_doc and not user_doc.get("is_deleted", False):
            user_id = str(user_doc["id"])
            reset_token = create_reset_token(subject=user_id)
            # Store reset token reference or let stateless JWT expiry handle it
            await audit_repo.log_action(user_id=user_id, action="PASSWORD_RESET_REQUESTED", resource_type="User", resource_id=user_id, ip_address=ip_address)
        return MessageResponse(message="If your email is registered, you will receive password reset instructions shortly.", success=True)

    async def reset_password(self, token: str, new_password: str, ip_address: Optional[str] = None) -> MessageResponse:
        try:
            payload = decode_token(token)
            if payload.get("type") != "reset":
                raise ValueError("Provided token is not a password reset token")
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Invalid token subject")
        except Exception as e:
            raise AppException(status_code=status.HTTP_400_BAD_REQUEST, message=f"Invalid or expired password reset token: {str(e)}", error_code="ERR_AUTH_RESET_INVALID")

        user_doc = await user_repo.get_by_id(user_id)
        if not user_doc or not user_doc.get("is_active", True):
            raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="User not found or inactive.", error_code="ERR_USER_NOT_FOUND")

        hashed_pwd = get_password_hash(new_password)
        await user_repo.update(doc_id=user_id, update_data={"hashed_password": hashed_pwd})

        # Revoke all active sessions
        from app.database import get_db
        db = await get_db()
        await db["sessions"].update_many({"user_id": user_id, "is_revoked": False}, {"$set": {"is_revoked": True}})

        await audit_repo.log_action(user_id=user_id, action="PASSWORD_RESET_COMPLETED", resource_type="User", resource_id=user_id, ip_address=ip_address)
        return MessageResponse(message="Your password has been successfully reset. Please log in with your new password.", success=True)

    async def verify_email(self, token: str, ip_address: Optional[str] = None) -> MessageResponse:
        try:
            payload = decode_token(token)
            if payload.get("type") != "verify":
                raise ValueError("Provided token is not an email verification token")
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Invalid token subject")
        except Exception as e:
            raise AppException(status_code=status.HTTP_400_BAD_REQUEST, message=f"Invalid or expired verification token: {str(e)}", error_code="ERR_AUTH_VERIFY_INVALID")

        user_doc = await user_repo.get_by_id(user_id)
        if not user_doc:
            raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="User not found.", error_code="ERR_USER_NOT_FOUND")

        if not user_doc.get("is_verified", False):
            await user_repo.update(doc_id=user_id, update_data={"is_verified": True})
            await audit_repo.log_action(user_id=user_id, action="EMAIL_VERIFIED", resource_type="User", resource_id=user_id, ip_address=ip_address)

        return MessageResponse(message="Your email address has been successfully verified.", success=True)

    async def resend_verification(self, email: str, ip_address: Optional[str] = None) -> MessageResponse:
        user_doc = await user_repo.get_by_email(email=email)
        if user_doc and not user_doc.get("is_verified", False) and not user_doc.get("is_deleted", False):
            user_id = str(user_doc["id"])
            verification_token = create_verification_token(subject=user_id)
            await audit_repo.log_action(user_id=user_id, action="VERIFICATION_EMAIL_RESENT", resource_type="User", resource_id=user_id, ip_address=ip_address)
        return MessageResponse(message="If your email is registered and unverified, a verification link has been sent.", success=True)

    async def validate_token(self, token_str: str) -> TokenValidationResponse:
        try:
            payload = decode_token(token_str)
            user_id = payload.get("sub")
            role = payload.get("role")
            token_type = payload.get("type")
            exp_timestamp = payload.get("exp")
            expires_at = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc) if exp_timestamp else None

            user_doc = await user_repo.get_by_id(user_id) if user_id else None
            if not user_doc or not user_doc.get("is_active", True):
                return TokenValidationResponse(valid=False)

            return TokenValidationResponse(
                valid=True,
                user_id=user_id,
                role=role or user_doc.get("role"),
                expires_at=expires_at,
                token_type=token_type
            )
        except Exception:
            return TokenValidationResponse(valid=False)

    async def get_current_user_profile(self, user_doc: Dict[str, Any]) -> UserResponse:
        user_id = str(user_doc["id"])
        profile_doc = await user_repo.get_profile(user_id=user_id)
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

    async def _issue_tokens(self, user_doc: Dict[str, Any], profile_doc: Optional[Dict[str, Any]] = None) -> TokenResponse:
        user_id = str(user_doc["id"])
        role = user_doc.get("role", "User")
        access_token = create_access_token(subject=user_id, role=role)
        refresh_token_str = create_refresh_token(subject=user_id)

        from app.database import get_db
        db = await get_db()
        session_entry = {
            "user_id": user_id,
            "refresh_token": refresh_token_str,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "is_revoked": False,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "is_deleted": False,
            "version": 1
        }
        await db["sessions"].insert_one(session_entry)

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

        user_resp = UserResponse(
            id=user_id,
            email=user_doc.get("email", ""),
            role=role,
            is_active=user_doc.get("is_active", True),
            is_verified=user_doc.get("is_verified", True),
            profile=profile_resp,
            created_at=user_doc.get("created_at")
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_resp
        )

auth_service = AuthService()
