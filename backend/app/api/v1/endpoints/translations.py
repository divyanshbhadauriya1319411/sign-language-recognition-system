from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from fastapi.responses import PlainTextResponse
from app.auth.rbac import get_current_active_user
from app.schemas.translation import (
    TranslationCreate, TranslationResponse, HistoryCreate, HistoryResponse
)
from app.services import translation_service

router = APIRouter()

@router.post("/", response_model=TranslationResponse, status_code=status.HTTP_201_CREATED)
async def create_translation(
    request: TranslationCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Record a new recognized sign language translation."""
    return await translation_service.create_translation(user_id=str(current_user["id"]), request=request)

@router.get("/", response_model=List[TranslationResponse], status_code=status.HTTP_200_OK)
async def list_my_translations(
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Retrieve paginated translation records for current user."""
    return await translation_service.get_user_translations(user_id=str(current_user["id"]), skip=skip, limit=limit)

@router.post("/history", response_model=HistoryResponse, status_code=status.HTTP_201_CREATED)
async def add_history_entry(
    request: HistoryCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Add a custom history entry or summary note."""
    return await translation_service.add_history_entry(user_id=str(current_user["id"]), request=request)

@router.get("/history", response_model=List[HistoryResponse], status_code=status.HTTP_200_OK)
async def list_my_history(
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Retrieve translation history records."""
    return await translation_service.get_user_history(user_id=str(current_user["id"]), skip=skip, limit=limit)

@router.get("/export/csv", response_class=PlainTextResponse, status_code=status.HTTP_200_OK)
async def export_history_csv(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Export translation history as downloadable CSV file."""
    csv_content = await translation_service.export_history_csv(user_id=str(current_user["id"]))
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="translations_history_{current_user["id"]}.csv"'}
    )
