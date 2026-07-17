import logging
from datetime import datetime, timezone
from fastapi import Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger(__name__)

class AppException(Exception):
    def __init__(self, status_code: int, message: str, details: dict = None, error_code: str = "ERR_GENERAL"):
        self.status_code = status_code
        self.message = message
        self.details = details or {}
        self.error_code = error_code
        super().__init__(self.message)

async def custom_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    correlation_id = getattr(request.state, "correlation_id", "N/A")
    logger.error(
        f"AppException [{exc.status_code}] ({exc.error_code}) at {request.url.path}: {exc.message}",
        extra={"correlation_id": correlation_id, "metadata": exc.details}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "message": exc.message,
            "details": exc.details,
            "correlation_id": correlation_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    correlation_id = getattr(request.state, "correlation_id", "N/A")
    errors = exc.errors()
    formatted_errors = [{"field": str(err.get("loc", [])), "message": err.get("msg")} for err in errors]
    logger.warning(
        f"Validation Error at {request.url.path}: {formatted_errors}",
        extra={"correlation_id": correlation_id}
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "error_code": "ERR_VALIDATION",
            "status_code": 422,
            "message": "Input validation failed before business logic execution",
            "details": {"errors": formatted_errors},
            "correlation_id": correlation_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    correlation_id = getattr(request.state, "correlation_id", "N/A")
    logger.warning(
        f"HTTPException [{exc.status_code}] at {request.url.path}: {exc.detail}",
        extra={"correlation_id": correlation_id}
    )
    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content={
            "error": True,
            "error_code": f"ERR_HTTP_{exc.status_code}",
            "status_code": exc.status_code,
            "message": str(exc.detail),
            "details": {},
            "correlation_id": correlation_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    correlation_id = getattr(request.state, "correlation_id", "N/A")
    logger.exception(
        f"Unhandled Server Exception (500) at {request.url.path}: {str(exc)}",
        extra={"correlation_id": correlation_id}
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "error_code": "ERR_INTERNAL_SERVER",
            "status_code": 500,
            "message": "An internal server error occurred while processing the request.",
            "details": {},
            "correlation_id": correlation_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

__all__ = [
    "AppException",
    "custom_exception_handler",
    "validation_exception_handler",
    "http_exception_handler",
    "general_exception_handler"
]
