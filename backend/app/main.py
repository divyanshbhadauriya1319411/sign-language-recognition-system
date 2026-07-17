from contextlib import asynccontextmanager
from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter

from app.config import settings
from app.api.v1.router import api_router
from app.websocket import websocket_router
from app.database import MongoDBEngine
from app.core.errors import (
    AppException,
    custom_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    general_exception_handler
)
from app.middleware import AuditCorrelationMiddleware, SecurityHeadersMiddleware
from app.utils.logging_stack import setup_observability

tags_metadata = [
    {
        "name": "Authentication",
        "description": "Enterprise JWT Authentication, Token Rotation, Password Reset, and Email Verification endpoints.",
    },
    {
        "name": "Users & Profiles",
        "description": "Operations for managing current user profile, accessibility preferences, and privacy controls.",
    },
    {
        "name": "Translation Sessions & History",
        "description": "Endpoints for recording real-time ISL recognition results, managing translation history, and exporting data.",
    },
    {
        "name": "Feedback System",
        "description": "User feedback submission and notification management.",
    },
    {
        "name": "Admin Portal & System Governance",
        "description": "Role governance, system analytics, AI model registry, dataset management, and security audit logs.",
    },
    {
        "name": "System Health",
        "description": "Health check and diagnostic endpoints.",
    },
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_observability()
    # Initialize MongoDB connection pool & collection indexes
    await MongoDBEngine.connect()
    await MongoDBEngine.create_indexes()

    # Initialize rate limiter with Redis
    try:
        redis_connection = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        await FastAPILimiter.init(redis_connection)
    except Exception as e:
        pass

    yield

    await MongoDBEngine.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Startup-Grade AI-Powered Sign Language Recognition & Translation Platform API with Real-Time Inference & Accessibility Controls",
    version="2.0.0-enterprise",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Setup Observability (Prometheus Metrics & Sentry)
setup_observability(app)

# Register Middlewares
app.add_middleware(AuditCorrelationMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Exception Handlers
app.add_exception_handler(AppException, custom_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(websocket_router, prefix="/api/v1")

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System Health"])
async def health_check():
    db_status = "MONGODB_CONNECTED" if MongoDBEngine.client is not None else "MONGODB_DISCONNECTED"
    return {
        "status": "UP",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "version": "v2.0.0-enterprise"
    }
