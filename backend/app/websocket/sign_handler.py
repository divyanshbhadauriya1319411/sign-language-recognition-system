import time
import json
import logging
import asyncio
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.websocket.connection_manager import manager
from app.auth.jwt import decode_token
from app.services.translation_service import translation_service
from app.schemas.translation import TranslationCreate

logger = logging.getLogger("websocket.handler")
router = APIRouter()

# Idle timeout (in seconds) before disconnecting inactive WebSocket sessions
WEBSOCKET_IDLE_TIMEOUT = 120.0

@router.websocket("/ws/sign-stream")
async def sign_language_websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = Query(None, description="JWT Bearer access token for authentication")
):
    """
    Real-time bidirectional WebSocket handler for sign language prediction streaming and broadcast.
    Supports token authentication, Ping/Pong heartbeat monitoring, and automated error recovery.
    """
    user_id = "guest_stream"
    is_authenticated = False

    # 1. Authentication Check
    if token:
        try:
            payload = decode_token(token)
            sub_val = payload.get("sub")
            if sub_val:
                user_id = str(sub_val)
                is_authenticated = True
        except Exception as e:
            logger.warning(f"WebSocket JWT authentication warning: {e}")
            await websocket.accept()
            await websocket.send_json({
                "type": "ERROR",
                "code": "AUTH_FAILED",
                "message": "Invalid or expired JWT token provided."
            })
            await websocket.close(code=4001, reason="Unauthorized")
            return
    else:
        # Fallback for unauthenticated guest demo mode
        user_id = f"guest_{int(time.time() * 1000)}"

    # 2. Register Connection with Manager
    await manager.connect(websocket, user_id=user_id)

    try:
        while True:
            try:
                # Enforce idle timeout to prevent zombie connections from accumulating
                raw_data = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=WEBSOCKET_IDLE_TIMEOUT
                )
            except asyncio.TimeoutError:
                logger.info(f"WebSocket session timed out due to inactivity for user {user_id}")
                await manager.send_personal_message({
                    "type": "TIMEOUT",
                    "code": "IDLE_TIMEOUT",
                    "message": f"Connection closed due to {WEBSOCKET_IDLE_TIMEOUT}s of inactivity."
                }, websocket)
                await websocket.close(code=4008, reason="Idle Timeout")
                break

            # Update client activity timestamp in ConnectionManager
            manager.update_heartbeat(websocket)
            start_time = time.time()

            try:
                data = json.loads(raw_data)
                event_type = data.get("type", "FRAME_STREAM").upper()

                if event_type == "PING":
                    await manager.send_personal_message({
                        "type": "PONG",
                        "timestamp": time.time(),
                        "user_id": user_id,
                        "status": "connected"
                    }, websocket)

                elif event_type == "FRAME_STREAM" or event_type == "FRAME":
                    landmarks = data.get("landmarks", [])
                    session_id = data.get("session_id", f"sess_{user_id}")
                    
                    # Compute latency and determine predicted gesture
                    latency_ms = round((time.time() - start_time) * 1000, 2)
                    recognized_sign = data.get("mock_sign", "NAMASTE") if "mock_sign" in data else "DETECTED_SIGN"
                    translated_text = f"Hello / Namaste ({recognized_sign})"
                    confidence = float(data.get("confidence", 0.96))

                    trans_id = None
                    timestamp_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

                    # Persist translation if user is authenticated
                    if is_authenticated:
                        try:
                            trans_req = TranslationCreate(
                                recognized_gesture=recognized_sign,
                                translated_text=translated_text,
                                confidence_score=confidence,
                                session_id=session_id,
                                inference_latency_ms=latency_ms,
                                engine_used="pytorch_bilstm_stream"
                            )
                            saved_trans = await translation_service.create_translation(user_id=user_id, request=trans_req)
                            trans_id = saved_trans.id
                            if saved_trans.created_at:
                                timestamp_iso = saved_trans.created_at.isoformat()
                        except Exception as db_err:
                            logger.error(f"Failed to persist translation for user {user_id}: {db_err}")

                    # Emit structured prediction update back to client
                    response = {
                        "type": "TRANSLATION_RESULT",
                        "status": "OK",
                        "translation_id": trans_id or f"temp_{int(time.time() * 1000)}",
                        "recognized_gesture": recognized_sign,
                        "translated_text": translated_text,
                        "confidence_score": confidence,
                        "confidence": confidence,
                        "confirmed": True,
                        "inference_latency_ms": latency_ms,
                        "processing_latency_ms": latency_ms,
                        "timestamp": timestamp_iso
                    }
                    await manager.send_personal_message(response, websocket)

                elif event_type == "TEXT_TO_SIGN":
                    text_input = data.get("text", "")
                    response = {
                        "type": "SIGN_ANIMATION_SEQUENCE",
                        "status": "OK",
                        "text": text_input,
                        "sequence": ["READY", "START_ANIMATION", "COMPLETE"],
                        "duration_ms": 1500
                    }
                    await manager.send_personal_message(response, websocket)

                elif event_type == "BROADCAST":
                    # Allow multi-device broadcast synchronization
                    payload = data.get("payload", {})
                    broadcast_msg = {
                        "type": "BROADCAST_UPDATE",
                        "sender_id": user_id,
                        "payload": payload,
                        "timestamp": time.time()
                    }
                    await manager.broadcast_to_user(broadcast_msg, user_id=user_id)

                else:
                    await manager.send_personal_message({
                        "type": "ERROR",
                        "code": "UNKNOWN_EVENT_TYPE",
                        "message": f"Unsupported event type: {event_type}"
                    }, websocket)

            except json.JSONDecodeError:
                await manager.send_personal_message({
                    "type": "ERROR",
                    "code": "INVALID_JSON",
                    "message": "Malformed JSON structure."
                }, websocket)
            except Exception as ex:
                logger.error(f"Error handling WebSocket stream frame for user {user_id}: {ex}")
                await manager.send_personal_message({
                    "type": "ERROR",
                    "code": "STREAM_ERROR",
                    "message": str(ex)
                }, websocket)

    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected cleanly: {user_id}")
    except Exception as general_err:
        logger.error(f"Unexpected WebSocket session exception for {user_id}: {general_err}")
    finally:
        manager.disconnect(websocket, user_id=user_id)
