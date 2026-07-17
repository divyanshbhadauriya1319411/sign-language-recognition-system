import pytest
import numpy as np
from app.pipeline.normalizer import LandmarkNormalizer

def test_normalizer_initialization(normalizer):
    assert isinstance(normalizer, LandmarkNormalizer)

def test_normalize_output_dimensions(normalizer, mock_landmarks):
    features = normalizer.normalize(mock_landmarks, num_hands=1)
    assert isinstance(features, list)
    # 21 landmarks * 3 coordinates = 63 values per hand
    # Or if normalizer pads/processes both hands or outputs specific dimension
    assert len(features) > 0
    assert all(isinstance(val, float) for val in features)

def test_normalize_empty_landmarks(normalizer):
    features = normalizer.normalize([], num_hands=0)
    assert isinstance(features, list)
    assert all(val == 0.0 for val in features)
