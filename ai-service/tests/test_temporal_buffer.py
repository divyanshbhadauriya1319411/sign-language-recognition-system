import pytest
import numpy as np
from app.pipeline.temporal_buffer import TemporalBufferManager

def test_buffer_manager_initialization(buffer_manager):
    assert isinstance(buffer_manager, TemporalBufferManager)
    assert buffer_manager.sequence_length == 30

def test_add_frame_and_get_buffer_size(buffer_manager, mock_feature_vector):
    session_id = "session_test_1"
    assert buffer_manager.get_buffer_size(session_id) == 0
    
    tensor = buffer_manager.add_frame(session_id, mock_feature_vector)
    assert buffer_manager.get_buffer_size(session_id) == 1
    assert isinstance(tensor, np.ndarray)

def test_buffer_sliding_window_limit(buffer_manager, mock_feature_vector):
    session_id = "session_test_window"
    # Add 35 frames when max sequence_length is 30
    for _ in range(35):
        tensor = buffer_manager.add_frame(session_id, mock_feature_vector)
        
    assert buffer_manager.get_buffer_size(session_id) == 30
    assert tensor.shape[0] == 30

def test_clear_session(buffer_manager, mock_feature_vector):
    session_id = "session_test_clear"
    buffer_manager.add_frame(session_id, mock_feature_vector)
    assert buffer_manager.get_buffer_size(session_id) == 1
    
    buffer_manager.clear_session(session_id)
    assert buffer_manager.get_buffer_size(session_id) == 0
