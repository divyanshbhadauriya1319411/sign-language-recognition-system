from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from app.auth.rbac import get_current_active_user
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services import feedback_service

router = APIRouter()

@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    request: FeedbackCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Submit translation accuracy feedback or bug report."""
    return await feedback_service.create_feedback(user_id=str(current_user["id"]), request=request)

@router.get("/my-submissions", response_model=List[FeedbackResponse], status_code=status.HTTP_200_OK)
async def list_my_feedback(
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """List feedback submitted across the platform."""
    return await feedback_service.list_feedback(skip=skip, limit=limit)
