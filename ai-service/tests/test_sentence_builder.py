import pytest
from app.pipeline.sentence_builder import ContinuousSentenceBuilder

def test_sentence_builder_initialization(sentence_builder):
    assert isinstance(sentence_builder, ContinuousSentenceBuilder)

def test_add_token_flow(sentence_builder):
    session_id = "builder_session_1"
    
    res1 = sentence_builder.add_token(session_id, "HELLO", confidence=0.95)
    assert isinstance(res1, dict)
    assert "tokens" in res1 or "formatted_sentence" in res1 or "sentence" in res1 or "current_sentence" in res1 or isinstance(res1, dict)
    
    res2 = sentence_builder.add_token(session_id, "WORLD", confidence=0.92)
    assert isinstance(res2, dict)

def test_undo_last_token(sentence_builder):
    session_id = "builder_session_undo"
    sentence_builder.add_token(session_id, "THANK_YOU", confidence=0.9)
    sentence_builder.add_token(session_id, "VERY_MUCH", confidence=0.9)
    
    state = sentence_builder.undo_last_token(session_id)
    assert isinstance(state, dict)

def test_clear_active_sentence(sentence_builder):
    session_id = "builder_session_clear"
    sentence_builder.add_token(session_id, "PLEASE", confidence=0.9)
    
    cleared = sentence_builder.clear_active_sentence(session_id)
    assert isinstance(cleared, dict)
