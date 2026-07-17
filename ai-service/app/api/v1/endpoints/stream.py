import time
import json
import logging
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.pipeline.preprocessor import hand_preprocessor
from app.pipeline.normalizer import landmark_normalizer
from app.pipeline.temporal_buffer import buffer_manager
from app.pipeline.classifier import isl_classifier
from app.pipeline.sentence_builder import sentence_builder
from app.tts.engine import tts_engine

logger = logging.getLogger("ai.stream")
router = APIRouter()

# Idle timeout (in seconds) before disconnecting inactive AI WebSocket sessions
STREAM_IDLE_TIMEOUT = 120.0

@router.websocket("/{session_id}")
async def websocket_ai_stream(websocket: WebSocket, session_id: str):
    """
    Bidirectional real-time AI WebSocket pipeline:
    Receives JSON messages containing either:
      - `{"type": "frame", "frame_base64": "data:image/jpeg;base64,..."}`
      - `{"type": "landmarks", "landmarks": [...]}`
      - `{"type": "command", "action": "UNDO_LAST_TOKEN" | "CLEAR_ACTIVE_SENTENCE"}`
      - `{"type": "ping"}` / `{"type": "PING"}`
    Processes through MediaPipe + spatial normalization + sliding window buffer + PyTorch TCN + Sentence Builder.
    Emits live prediction JSON with confidence, confirmed status, landmarks overlay data, sentence buffer state, audio, and latency metrics.
    Includes inner error recovery and idle timeout management.
    """
    await websocket.accept()
    buffer_manager.clear_session(session_id)
    isl_classifier.reset_stability(session_id)
    sentence_builder.clear_active_sentence(session_id)
    logger.info(f"AI Stream WebSocket connected for session: {session_id}")

    try:
        while True:
            try:
                message_str = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=STREAM_IDLE_TIMEOUT
                )
            except asyncio.TimeoutError:
                logger.info(f"AI Stream session timed out due to {STREAM_IDLE_TIMEOUT}s of inactivity for session {session_id}")
                try:
                    await websocket.send_json({
                        "type": "TIMEOUT",
                        "status": "ERROR",
                        "code": "IDLE_TIMEOUT",
                        "message": f"Stream closed due to {STREAM_IDLE_TIMEOUT}s of inactivity."
                    })
                    await websocket.close(code=4008, reason="Idle Timeout")
                except Exception:
                    pass
                break

            start_time = time.time()
            try:
                try:
                    data = json.loads(message_str)
                except Exception:
                    await websocket.send_json({
                        "type": "ERROR",
                        "status": "ERROR",
                        "code": "INVALID_JSON",
                        "message": "Malformed JSON structure."
                    })
                    continue

                msg_type = data.get("type", "frame").lower()

                # Handle PING/PONG heartbeats
                if msg_type == "ping":
                    await websocket.send_json({
                        "type": "PONG",
                        "status": "OK",
                        "timestamp": time.time(),
                        "session_id": session_id
                    })
                    continue

                # Handle interactive sentence editing commands
                if msg_type == "command":
                    action = data.get("action", "").upper()
                    if action == "UNDO_LAST_TOKEN":
                        state = sentence_builder.undo_last_token(session_id)
                    elif action == "CLEAR_ACTIVE_SENTENCE":
                        state = sentence_builder.clear_active_sentence(session_id)
                    else:
                        state = sentence_builder.get_sentence_state(session_id)
                    
                    latency_ms = round((time.time() - start_time) * 1000, 2)
                    await websocket.send_json({
                        "type": "COMMAND_RESULT",
                        "status": "OK",
                        "gesture": "Editing Command Executed",
                        "confidence": 1.0,
                        "confirmed": False,
                        "sentence_tokens": state["tokens"],
                        "formatted_sentence": state["formatted_sentence"],
                        "is_sentence_final": state["is_sentence_final"],
                        "latency_ms": latency_ms,
                        "processing_latency_ms": latency_ms
                    })
                    continue

                raw_landmarks = []
                detection_confidence = 1.0
                hand_detected = False
                num_hands = 0
                handedness = []

                if msg_type == "frame":
                    frame_bgr = hand_preprocessor.decode_frame(data.get("frame_base64", ""))
                    if frame_bgr is not None:
                        proc_res = hand_preprocessor.process_frame(frame_bgr)
                        hand_detected = proc_res["hand_detected"]
                        raw_landmarks = proc_res["raw_landmarks"]
                        detection_confidence = proc_res["detection_confidence"]
                        num_hands = proc_res["num_hands"]
                        handedness = proc_res["handedness"]
                elif msg_type == "landmarks":
                    raw_landmarks = data.get("landmarks", [])
                    hand_detected = len(raw_landmarks) > 0
                    num_hands = 2 if len(raw_landmarks) >= 42 else 1

                if not hand_detected:
                    # Check if pause threshold has elapsed for finalizing active sentence
                    state = sentence_builder.check_pause_boundary(session_id)
                    tts_audio = ""
                    if state["is_sentence_final"] and state["formatted_sentence"]:
                        if data.get("enable_tts", True):
                            voice_gender = data.get("voice_gender", "female")
                            tts_speed = float(data.get("tts_speed", 1.0))
                            tts_audio = await tts_engine.synthesize(state["formatted_sentence"], voice_gender=voice_gender, speed=tts_speed)

                    latency_ms = round((time.time() - start_time) * 1000, 2)
                    await websocket.send_json({
                        "type": "PREDICTION",
                        "status": "HANDS_NOT_DETECTED",
                        "gesture": "Searching for hands...",
                        "confidence": 0.0,
                        "confirmed": False,
                        "raw_landmarks": [],
                        "num_hands": 0,
                        "handedness": [],
                        "sentence_tokens": state["tokens"],
                        "formatted_sentence": state["formatted_sentence"],
                        "is_sentence_final": state["is_sentence_final"],
                        "tts_audio_base64": tts_audio,
                        "latency_ms": latency_ms,
                        "processing_latency_ms": latency_ms
                    })
                    continue

                # Normalize landmarks (126 vector)
                norm_vector = landmark_normalizer.normalize(raw_landmarks, num_hands=num_hands)
                
                # Add to temporal sliding buffer (T=30)
                temporal_tensor = buffer_manager.add_frame(session_id, norm_vector)
                
                # Run PyTorch classifier
                classification = isl_classifier.classify_sequence(session_id, temporal_tensor)

                # Pass prediction to Continuous Sentence Builder
                if classification["confirmed"]:
                    state = sentence_builder.add_token(session_id, classification["gesture"], classification["confidence"])
                else:
                    state = sentence_builder.check_pause_boundary(session_id)

                # Check if this frame finalized or confirmed a sign/sentence for TTS
                tts_audio = ""
                if state["is_sentence_final"] and state["formatted_sentence"]:
                    if data.get("enable_tts", True):
                        voice_gender = data.get("voice_gender", "female")
                        tts_speed = float(data.get("tts_speed", 1.0))
                        tts_audio = await tts_engine.synthesize(state["formatted_sentence"], voice_gender=voice_gender, speed=tts_speed)
                elif classification["confirmed"] and data.get("tts_on_word", False):
                    voice_gender = data.get("voice_gender", "female")
                    tts_speed = float(data.get("tts_speed", 1.0))
                    tts_audio = await tts_engine.synthesize(classification["gesture"], voice_gender=voice_gender, speed=tts_speed)

                latency_ms = round((time.time() - start_time) * 1000, 2)
                # Emit rich response back to client canvas/UI
                await websocket.send_json({
                    "type": "PREDICTION",
                    "status": "OK",
                    "gesture": classification["gesture"],
                    "confidence": classification["confidence"],
                    "confirmed": classification["confirmed"],
                    "top_predictions": classification.get("top_predictions", []),
                    "raw_landmarks": raw_landmarks,
                    "num_hands": num_hands,
                    "handedness": handedness,
                    "sentence_tokens": state["tokens"],
                    "formatted_sentence": state["formatted_sentence"],
                    "is_sentence_final": state["is_sentence_final"],
                    "tts_audio_base64": tts_audio,
                    "latency_ms": latency_ms,
                    "processing_latency_ms": latency_ms
                })

            except Exception as inner_err:
                logger.error(f"Error processing frame for session {session_id}: {inner_err}")
                latency_ms = round((time.time() - start_time) * 1000, 2)
                await websocket.send_json({
                    "type": "ERROR",
                    "status": "ERROR",
                    "code": "INFERENCE_ERROR",
                    "message": f"Inference processing failed: {str(inner_err)}",
                    "latency_ms": latency_ms,
                    "processing_latency_ms": latency_ms
                })

    except WebSocketDisconnect:
        logger.info(f"AI Stream WebSocket disconnected cleanly for session: {session_id}")
        buffer_manager.clear_session(session_id)
        isl_classifier.reset_stability(session_id)
        sentence_builder.clear_session(session_id)
    except Exception as exc:
        logger.error(f"Unexpected AI Stream WebSocket exception for {session_id}: {exc}")
        buffer_manager.clear_session(session_id)
        isl_classifier.reset_stability(session_id)
        sentence_builder.clear_session(session_id)
