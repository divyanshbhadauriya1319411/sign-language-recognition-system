import pytest
import pytest_asyncio
import numpy as np
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.pipeline.preprocessor import HandPreprocessor
from app.pipeline.normalizer import LandmarkNormalizer
from app.pipeline.temporal_buffer import TemporalBufferManager
from app.pipeline.classifier import ISLClassifier
from app.pipeline.sentence_builder import ContinuousSentenceBuilder

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

@pytest.fixture
def mock_landmarks():
    # 21 hand landmarks, each with x, y, z coordinates
    return [{"x": float(i) * 0.05, "y": float(i) * 0.04, "z": float(i) * 0.01} for i in range(21)]

@pytest.fixture
def mock_feature_vector(mock_landmarks):
    normalizer = LandmarkNormalizer()
    return normalizer.normalize(mock_landmarks, num_hands=1)

@pytest.fixture
def preprocessor():
    return HandPreprocessor()

@pytest.fixture
def normalizer():
    return LandmarkNormalizer()

@pytest.fixture
def buffer_manager():
    return TemporalBufferManager(sequence_length=30)

@pytest.fixture
def classifier():
    clf = ISLClassifier()
    return clf

@pytest.fixture
def sentence_builder():
    return ContinuousSentenceBuilder()
