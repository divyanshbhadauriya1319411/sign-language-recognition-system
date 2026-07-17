from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status, Query
from app.auth.rbac import require_admin
from app.schemas.user import UserResponse
from app.schemas.ai_model import AIModelCreate, AIModelResponse, DatasetCreate, DatasetResponse
from app.schemas.analytics import AuditTrailResponse
from app.services import admin_service

router = APIRouter()

@router.get("/stats", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def get_system_analytics(current_admin: Dict[str, Any] = require_admin):
    """Retrieve comprehensive system statistics."""
    return await admin_service.get_system_stats()

@router.get("/users", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: Dict[str, Any] = require_admin
):
    """List paginated system users for governance."""
    return await admin_service.list_users(skip=skip, limit=limit)

@router.put("/users/{user_id}/role", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def update_user_role(
    user_id: str,
    new_role: str = Query(..., description="Target role: Guest | User | Admin"),
    current_admin: Dict[str, Any] = require_admin
):
    """Update user role and access permissions."""
    return await admin_service.update_user_role(admin_id=str(current_admin["id"]), target_user_id=user_id, new_role=new_role)

@router.get("/models", response_model=List[AIModelResponse], status_code=status.HTTP_200_OK)
async def list_models(current_admin: Dict[str, Any] = require_admin):
    """List all registered AI models."""
    return await admin_service.list_models()

@router.post("/models", response_model=AIModelResponse, status_code=status.HTTP_201_CREATED)
async def register_model(
    request: AIModelCreate,
    current_admin: Dict[str, Any] = require_admin
):
    """Register a new AI model version."""
    return await admin_service.create_model(admin_id=str(current_admin["id"]), request=request)

@router.get("/datasets", response_model=List[DatasetResponse], status_code=status.HTTP_200_OK)
async def list_datasets(current_admin: Dict[str, Any] = require_admin):
    """List all training datasets."""
    return await admin_service.list_datasets()

@router.post("/datasets", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(
    request: DatasetCreate,
    current_admin: Dict[str, Any] = require_admin
):
    """Create a new dataset container."""
    return await admin_service.create_dataset(admin_id=str(current_admin["id"]), request=request)

@router.get("/logs", response_model=List[Dict[str, Any]], status_code=status.HTTP_200_OK)
async def list_audit_logs(
    skip: int = 0,
    limit: int = 100,
    current_admin: Dict[str, Any] = require_admin
):
    """View paginated system and security audit logs."""
    return await admin_service.get_audit_logs(skip=skip, limit=limit)
