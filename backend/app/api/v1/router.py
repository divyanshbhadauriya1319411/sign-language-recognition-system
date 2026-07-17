from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, translations, feedback, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Profiles"])
api_router.include_router(translations.router, prefix="/translations", tags=["Translation Sessions & History"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback System"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Portal & System Governance"])
