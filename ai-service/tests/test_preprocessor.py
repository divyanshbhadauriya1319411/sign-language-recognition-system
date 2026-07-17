import pytest
import numpy as np
import base64
import cv2
from app.pipeline.preprocessor import HandPreprocessor

def test_preprocessor_initialization(preprocessor):
    assert isinstance(preprocessor, HandPreprocessor)

def test_decode_frame_valid_base64(preprocessor):
    # Create a 10x10 black image
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, buffer = cv2.imencode('.jpg', img)
    b64_string = base64.b64encode(buffer).decode('utf-8')
    
    decoded = preprocessor.decode_frame(b64_string)
    assert decoded is not None
    assert isinstance(decoded, np.ndarray)
    assert decoded.shape == (10, 10, 3)

def test_decode_frame_with_data_header(preprocessor):
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, buffer = cv2.imencode('.jpg', img)
    b64_string = "data:image/jpeg;base64," + base64.b64encode(buffer).decode('utf-8')
    
    decoded = preprocessor.decode_frame(b64_string)
    assert decoded is not None
    assert isinstance(decoded, np.ndarray)
    assert decoded.shape == (10, 10, 3)

def test_decode_frame_invalid(preprocessor):
    invalid_b64 = "this-is-not-valid-base64-image-data-###"
    decoded = preprocessor.decode_frame(invalid_b64)
    assert decoded is None

def test_process_frame_structure(preprocessor):
    img = np.zeros((64, 64, 3), dtype=np.uint8)
    result = preprocessor.process_frame(img)
    assert isinstance(result, dict)
    assert "raw_landmarks" in result
    assert "hand_detected" in result
    assert "num_hands" in result

