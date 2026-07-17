import os
import shutil
import logging
from abc import ABC, abstractmethod
from typing import Optional, BinaryIO
from app.config import settings

logger = logging.getLogger(__name__)

class IStorageProvider(ABC):
    @abstractmethod
    async def upload_file(self, file_data: BinaryIO, destination_path: str, content_type: Optional[str] = None) -> str:
        """Upload file and return accessible URL path."""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        pass

    @abstractmethod
    async def get_file_url(self, file_path: str) -> str:
        """Get publicly accessible or presigned URL."""
        pass


class LocalStorageProvider(IStorageProvider):
    def __init__(self, base_path: str = settings.LOCAL_STORAGE_PATH):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

    async def upload_file(self, file_data: BinaryIO, destination_path: str, content_type: Optional[str] = None) -> str:
        full_path = os.path.join(self.base_path, destination_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file_data, buffer)
        logger.info(f"Local storage: Uploaded file to {full_path}")
        return f"/storage/{destination_path}"

    async def delete_file(self, file_path: str) -> bool:
        clean_path = file_path.replace("/storage/", "")
        full_path = os.path.join(self.base_path, clean_path)
        if os.path.exists(full_path):
            os.remove(full_path)
            logger.info(f"Local storage: Deleted file at {full_path}")
            return True
        return False

    async def get_file_url(self, file_path: str) -> str:
        if file_path.startswith("http") or file_path.startswith("/storage/"):
            return file_path
        return f"/storage/{file_path}"


class S3StorageProvider(IStorageProvider):
    def __init__(self):
        try:
            import boto3
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        except Exception as e:
            logger.error(f"S3 initialization error: {e}")
            self.s3_client = None

    async def upload_file(self, file_data: BinaryIO, destination_path: str, content_type: Optional[str] = None) -> str:
        if not self.s3_client:
            raise RuntimeError("S3 client not initialized")
        extra_args = {"ContentType": content_type} if content_type else {}
        self.s3_client.upload_fileobj(file_data, self.bucket_name, destination_path, ExtraArgs=extra_args)
        return f"https://{self.bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{destination_path}"

    async def delete_file(self, file_path: str) -> bool:
        if not self.s3_client:
            return False
        key = file_path.split(".amazonaws.com/")[-1]
        self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
        return True

    async def get_file_url(self, file_path: str) -> str:
        if not self.s3_client:
            return file_path
        key = file_path.split(".amazonaws.com/")[-1] if "amazonaws.com" in file_path else file_path
        return self.s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": key},
            ExpiresIn=3600
        )


class AzureBlobProvider(IStorageProvider):
    def __init__(self):
        try:
            from azure.storage.blob import BlobServiceClient
            self.blob_service = BlobServiceClient.from_connection_string(settings.AZURE_STORAGE_CONNECTION_STRING)
            self.container_name = settings.AZURE_CONTAINER_NAME
        except Exception as e:
            logger.error(f"Azure Blob initialization error: {e}")
            self.blob_service = None

    async def upload_file(self, file_data: BinaryIO, destination_path: str, content_type: Optional[str] = None) -> str:
        if not self.blob_service:
            raise RuntimeError("Azure blob service not initialized")
        blob_client = self.blob_service.get_blob_client(container=self.container_name, blob=destination_path)
        blob_client.upload_blob(file_data, overwrite=True)
        return blob_client.url

    async def delete_file(self, file_path: str) -> bool:
        if not self.blob_service:
            return False
        blob_name = file_path.split(f"{self.container_name}/")[-1]
        blob_client = self.blob_service.get_blob_client(container=self.container_name, blob=blob_name)
        blob_client.delete_blob()
        return True

    async def get_file_url(self, file_path: str) -> str:
        return file_path


class CloudinaryProvider(IStorageProvider):
    def __init__(self):
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET
            )
            self.uploader = cloudinary.uploader
        except Exception as e:
            logger.error(f"Cloudinary initialization error: {e}")
            self.uploader = None

    async def upload_file(self, file_data: BinaryIO, destination_path: str, content_type: Optional[str] = None) -> str:
        if not self.uploader:
            raise RuntimeError("Cloudinary uploader not initialized")
        res = self.uploader.upload(file_data, public_id=destination_path)
        return res.get("secure_url")

    async def delete_file(self, file_path: str) -> bool:
        if not self.uploader:
            return False
        self.uploader.destroy(file_path)
        return True

    async def get_file_url(self, file_path: str) -> str:
        return file_path


def get_storage_provider() -> IStorageProvider:
    provider_name = settings.STORAGE_PROVIDER.lower()
    if provider_name == "s3":
        return S3StorageProvider()
    elif provider_name == "azure":
        return AzureBlobProvider()
    elif provider_name == "cloudinary":
        return CloudinaryProvider()
    return LocalStorageProvider()
