from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class RoleModel(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., description="Role name: Guest | User | Admin")
    description: str = ""
    permissions: List[str] = []
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class PermissionModel(BaseModel):
    id: Optional[str] = None
    code: str = Field(..., description="Permission code e.g., translation:create, admin:access")
    description: str = ""
    module: str = "core"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class ProfileModel(BaseModel):
    user_id: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    organization: Optional[str] = None
    accessibility_profile: Dict[str, Any] = {
        "high_contrast": False,
        "reduced_motion": False,
        "tts_speed": 1.0,
        "voice_gender": "female",
        "font_scale": "normal"
    }
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1

class UserModel(BaseModel):
    id: Optional[str] = None
    email: str
    hashed_password: str
    role: str = "User"  # Guest | User | Admin
    is_active: bool = True
    is_verified: bool = False
    oauth_provider: Optional[str] = None  # google | microsoft | github
    oauth_id: Optional[str] = None
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_by: Optional[str] = None
    version: int = 1

class SessionModel(BaseModel):
    id: Optional[str] = None
    user_id: str
    refresh_token: str
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    expires_at: datetime
    is_revoked: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_deleted: bool = False
    version: int = 1
