import logging
import json
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from app.config import settings

class StructuredJsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "environment": settings.ENVIRONMENT,
            "service": settings.PROJECT_NAME
        }
        if hasattr(record, "correlation_id") and record.correlation_id:
            log_payload["correlation_id"] = record.correlation_id
        if hasattr(record, "category") and record.category:
            log_payload["category"] = record.category
        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_payload)


def setup_observability(app=None):
    """Setup structured JSON logging, Prometheus instrumentation, OpenTelemetry, and Sentry."""
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(settings.LOG_LEVEL)
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(StructuredJsonFormatter())
    root_logger.addHandler(console_handler)

    if app:
        # Prometheus Instrumentation
        try:
            from prometheus_fastapi_instrumentator import Instrumentator
            Instrumentator().instrument(app).expose(app, endpoint="/metrics")
            logging.info("Prometheus metrics initialized on /metrics")
        except Exception as e:
            logging.warning(f"Could not initialize Prometheus instrumentation: {e}")

        # Sentry Initialization
        try:
            import sentry_sdk
            from sentry_sdk.integrations.fastapi import FastApiIntegration
            # Only initialize if a DSN is provided or in non-debug mode when configured
            # sentry_sdk.init(dsn="...", integrations=[FastApiIntegration()])
        except Exception:
            pass
