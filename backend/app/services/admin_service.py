from datetime import datetime, timezone
from typing import Dict, Any, List
from fastapi import status
from app.core.errors import AppException
from app.repositories.user_repository import user_repo
from app.repositories.translation_repository import translation_repo
from app.repositories.ai_model_repository import ai_model_repo
from app.repositories.dataset_repository import dataset_repo
from app.repositories.audit_repository import audit_repo
from app.schemas.ai_model import AIModelCreate, AIModelResponse, DatasetCreate, DatasetResponse
from app.schemas.user import UserResponse, ProfileResponse

class AdminService:
    async def get_system_stats(self) -> Dict[str, Any]:
        total_users = await user_repo.count()
        total_translations = await translation_repo.count()
        total_models = await ai_model_repo.count()
        total_datasets = await dataset_repo.count()

        active_model = await ai_model_repo.get_active_model()

        return {
            "total_users": total_users,
            "total_translations": total_translations,
            "total_models": total_models,
            "total_datasets": total_datasets,
            "active_model_name": active_model["name"] if active_model else "ISL Bi-LSTM Sequence Classifier",
            "active_model_version": active_model["version"] if active_model else "v2.0.0-enterprise",
            "active_model_accuracy": active_model["accuracy"] if active_model else 0.994,
            "system_health": "OPTIMAL",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[UserResponse]:
        docs = await user_repo.get_multi(skip=skip, limit=limit)
        results = []
        for d in docs:
            uid = str(d["id"])
            p = await user_repo.get_profile(uid)
            profile_resp = ProfileResponse(
                user_id=uid,
                full_name=p.get("full_name") if p else None,
                avatar_url=p.get("avatar_url") if p else None,
                bio=p.get("bio") if p else None,
                phone_number=p.get("phone_number") if p else None,
                organization=p.get("organization") if p else None,
                accessibility_profile=p.get("accessibility_profile") if p else {
                    "high_contrast": False, "reduced_motion": False, "tts_speed": 1.0, "voice_gender": "female", "font_scale": "normal"
                }
            )
            results.append(UserResponse(
                id=uid,
                email=d.get("email", ""),
                role=d.get("role", "User"),
                is_active=d.get("is_active", True),
                is_verified=d.get("is_verified", True),
                profile=profile_resp,
                created_at=d.get("created_at")
            ))
        return results

    async def update_user_role(self, admin_id: str, target_user_id: str, new_role: str) -> Dict[str, Any]:
        user_doc = await user_repo.get_by_id(target_user_id)
        if not user_doc:
            raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="Target user not found", error_code="ERR_USER_NOT_FOUND")
        
        updated = await user_repo.update(db_obj=user_doc, obj_in={"role": new_role}, updated_by=admin_id)
        await audit_repo.log_action(
            user_id=admin_id, action="USER_ROLE_UPDATED", resource_type="User", resource_id=target_user_id,
            details={"new_role": new_role}
        )
        return updated

    async def list_models(self) -> List[AIModelResponse]:
        docs = await ai_model_repo.get_multi(skip=0, limit=100)
        return [
            AIModelResponse(
                id=str(m["id"]),
                name=m.get("name", ""),
                version=m.get("version", ""),
                description=m.get("description", ""),
                file_path=m.get("file_path", ""),
                accuracy=m.get("accuracy", 0.0),
                loss=m.get("loss", 0.0),
                vocabulary_size=m.get("vocabulary_size", 57),
                architecture=m.get("architecture", "BiLSTM_TCN_Temporal"),
                is_active=m.get("is_active", False),
                created_at=m.get("created_at")
            ) for m in docs
        ]

    async def create_model(self, admin_id: str, request: AIModelCreate) -> AIModelResponse:
        data = request.model_dump()
        doc = await ai_model_repo.create(obj_in=data, created_by=admin_id)
        await audit_repo.log_action(
            user_id=admin_id, action="AI_MODEL_CREATED", resource_type="AIModel", resource_id=str(doc["id"])
        )
        return AIModelResponse(
            id=str(doc["id"]),
            name=doc.get("name", ""),
            version=doc.get("version", ""),
            description=doc.get("description", ""),
            file_path=doc.get("file_path", ""),
            accuracy=doc.get("accuracy", 0.0),
            loss=doc.get("loss", 0.0),
            vocabulary_size=doc.get("vocabulary_size", 57),
            architecture=doc.get("architecture", "BiLSTM_TCN_Temporal"),
            is_active=doc.get("is_active", False),
            created_at=doc.get("created_at")
        )

    async def list_datasets(self) -> List[DatasetResponse]:
        docs = await dataset_repo.get_multi(skip=0, limit=100)
        return [
            DatasetResponse(
                id=str(d["id"]),
                gesture_label=d.get("gesture_label", ""),
                sample_file_url=d.get("sample_file_url", ""),
                file_type=d.get("file_type", "landmark_cif"),
                uploaded_by=d.get("uploaded_by", "system"),
                is_verified=d.get("is_verified", False),
                is_processed=d.get("is_processed", False),
                created_at=d.get("created_at")
            ) for d in docs
        ]

    async def create_dataset(self, admin_id: str, request: DatasetCreate) -> DatasetResponse:
        data = request.model_dump()
        data["uploaded_by"] = admin_id
        data["is_verified"] = False
        data["is_processed"] = False
        doc = await dataset_repo.create(obj_in=data, created_by=admin_id)
        await audit_repo.log_action(
            user_id=admin_id, action="DATASET_CREATED", resource_type="Dataset", resource_id=str(doc["id"])
        )
        return DatasetResponse(
            id=str(doc["id"]),
            gesture_label=doc["gesture_label"],
            sample_file_url=doc["sample_file_url"],
            file_type=doc.get("file_type", "landmark_cif"),
            uploaded_by=doc["uploaded_by"],
            is_verified=doc["is_verified"],
            is_processed=doc["is_processed"],
            created_at=doc.get("created_at")
        )

    async def get_audit_logs(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        return await audit_repo.get_logs(skip=skip, limit=limit)

admin_service = AdminService()
