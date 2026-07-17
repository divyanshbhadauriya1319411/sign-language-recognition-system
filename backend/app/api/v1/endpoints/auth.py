from fastapi import APIRouter, Depends, Request, status
from typing import Dict, Any, Optional
from app.auth.rbac import get_current_active_user, get_current_optional_user
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.schemas.auth import (
    RefreshRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    TokenValidationRequest,
    TokenValidationResponse,
    MessageResponse
)
from app.services import auth_service

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserCreate):
    """Register a new user account with initial profile setup and token issuance."""
    return await auth_service.register(request=request)

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(request: UserLogin, http_req: Request):
    """Authenticate with credentials and issue JWT Access + Refresh tokens."""
    ip_addr = http_req.client.host if http_req.client else None
    return await auth_service.login(request=request, ip_address=ip_addr)

@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh_tokens(request: RefreshRequest):
    """Rotate access and refresh tokens using a valid unexpired refresh token."""
    return await auth_service.refresh_tokens(refresh_token_str=request.refresh_token)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Revoke active refresh tokens and end user session."""
    await auth_service.logout(user_id=str(current_user["id"]))
    return None

@router.post("/forgot-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def forgot_password(request: ForgotPasswordRequest, http_req: Request):
    """Request a password reset link for an existing user account."""
    ip_addr = http_req.client.host if http_req.client else None
    return await auth_service.forgot_password(email=request.email, ip_address=ip_addr)

@router.post("/reset-password", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def reset_password(request: ResetPasswordRequest, http_req: Request):
    """Reset account password using a valid reset token and revoke existing sessions."""
    ip_addr = http_req.client.host if http_req.client else None
    return await auth_service.reset_password(token=request.token, new_password=request.new_password, ip_address=ip_addr)

@router.post("/verify-email", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def verify_email(request: VerifyEmailRequest, http_req: Request):
    """Verify email address using a verification token."""
    ip_addr = http_req.client.host if http_req.client else None
    return await auth_service.verify_email(token=request.token, ip_address=ip_addr)

@router.post("/resend-verification", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def resend_verification(request: ResendVerificationRequest, http_req: Request):
    """Resend email verification token if account is currently unverified."""
    ip_addr = http_req.client.host if http_req.client else None
    return await auth_service.resend_verification(email=request.email, ip_address=ip_addr)

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
@router.get("/current-user", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """Retrieve full profile and permissions of the currently authenticated user."""
    return await auth_service.get_current_user_profile(user_doc=current_user)

@router.post("/validate-token", response_model=TokenValidationResponse, status_code=status.HTTP_200_OK)
async def validate_token(
    request: Optional[TokenValidationRequest] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_optional_user)
):
    """Validate token provided either in request body or Authorization header."""
    if request and request.token:
        return await auth_service.validate_token(token_str=request.token)
    if current_user:
        return TokenValidationResponse(
            valid=True,
            user_id=str(current_user["id"]),
            role=current_user.get("role", "User")
        )
    return TokenValidationResponse(valid=False)
