from app.repositories.base import CRUDBase
from app.repositories.user_repository import UserRepository, user_repo
from app.repositories.translation_repository import TranslationRepository, translation_repo
from app.repositories.feedback_repository import FeedbackRepository, feedback_repo
from app.repositories.ai_model_repository import AIModelRepository, ai_model_repo
from app.repositories.dataset_repository import DatasetRepository, dataset_repo
from app.repositories.audit_repository import AuditRepository, audit_repo

__all__ = [
    "CRUDBase",
    "UserRepository", "user_repo",
    "TranslationRepository", "translation_repo",
    "FeedbackRepository", "feedback_repo",
    "AIModelRepository", "ai_model_repo",
    "DatasetRepository", "dataset_repo",
    "AuditRepository", "audit_repo"
]
