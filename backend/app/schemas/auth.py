from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.user import UserCreate as RegisterRequest, UserLogin as LoginRequest, TokenResponse as Token

class RefreshRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class TokenValidationRequest(BaseModel):
    token: Optional[str] = None

class TokenValidationResponse(BaseModel):
    valid: bool
    user_id: Optional[str] = None
    role: Optional[str] = None
    expires_at: Optional[datetime] = None
    token_type: Optional[str] = None

class MessageResponse(BaseModel):
    message: str
    success: bool = True

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "RefreshRequest",
    "Token",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "VerifyEmailRequest",
    "ResendVerificationRequest",
    "TokenValidationRequest",
    "TokenValidationResponse",
    "MessageResponse"
]
