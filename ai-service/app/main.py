from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import api_router
from app.pipeline.classifier import isl_classifier

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure vocabulary and model weights are loaded/generated on startup
    isl_classifier.load_resources()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Dedicated Real-Time AI & Speech Synthesis Microservice for SignBridge ISL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/ai/v1")

@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
@app.get("/ai/v1/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def ai_health_check():
    return {
        "status": "UP",
        "service": settings.PROJECT_NAME,
        "device": str(isl_classifier.device),
        "vocabulary_size": len(isl_classifier.vocabulary),
        "model_loaded": isl_classifier.model is not None
    }
