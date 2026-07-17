from app.services.auth_service import AuthService, auth_service
from app.services.user_service import UserService, user_service
from app.services.translation_service import TranslationService, translation_service
from app.services.admin_service import AdminService, admin_service
from app.services.feedback_service import FeedbackService, feedback_service

__all__ = [
    "AuthService", "auth_service",
    "UserService", "user_service",
    "TranslationService", "translation_service",
    "AdminService", "admin_service",
    "FeedbackService", "feedback_service"
]
