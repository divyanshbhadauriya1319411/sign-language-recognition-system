import pytest
import numpy as np
from app.pipeline.classifier import ISLClassifier

def test_classifier_initialization(classifier):
    assert isinstance(classifier, ISLClassifier)

def test_classify_sequence_output_structure(classifier):
    session_id = "classifier_session_1"
    # Create mock temporal tensor matching 126 feature dimensions (2 hands * 21 points * 3 coordinates)
    mock_tensor = np.random.rand(30, 126).astype(np.float32)
    
    result = classifier.classify_sequence(session_id, mock_tensor)
    assert isinstance(result, dict)
    assert "gesture" in result
    assert "confidence" in result
    assert "confirmed" in result
    assert isinstance(result["confidence"], float)

def test_reset_stability(classifier):
    session_id = "classifier_session_reset"
    mock_tensor = np.random.rand(30, 126).astype(np.float32)
    classifier.classify_sequence(session_id, mock_tensor)
    
    # Should run without raising errors and clear session tracking
    classifier.reset_stability(session_id)
