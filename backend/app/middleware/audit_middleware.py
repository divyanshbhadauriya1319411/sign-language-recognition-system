import time
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from app.repositories.audit_repository import audit_repo

logger = logging.getLogger("api.audit")

class AuditCorrelationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id

        start_time = time.time()
        response = None
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            response.headers["X-Correlation-ID"] = correlation_id
        except Exception as exc:
            logger.error(f"Unhandled exception during request processing [{correlation_id}]: {exc}", exc_info=True)
            raise exc
        finally:
            latency_ms = round((time.time() - start_time) * 1000, 2)
            log_data = {
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": status_code,
                "latency_ms": latency_ms,
                "client_ip": request.client.host if request.client else None
            }
            if status_code >= 400:
                logger.warning(f"API Error [{status_code}]: {request.method} {request.url.path} ({latency_ms}ms)", extra={"metadata": log_data, "correlation_id": correlation_id})
            else:
                logger.info(f"API Request: {request.method} {request.url.path} [{status_code}] ({latency_ms}ms)", extra={"metadata": log_data, "correlation_id": correlation_id})

        return response
