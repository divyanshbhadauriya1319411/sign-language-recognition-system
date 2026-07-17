import pytest
from unittest.mock import AsyncMock, MagicMock
from app.websocket.connection_manager import ConnectionManager

@pytest.mark.asyncio
async def test_connection_manager_connect_and_disconnect():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    user_id = "user_123"
    
    await manager.connect(mock_ws, user_id)
    assert user_id in manager.active_connections
    assert mock_ws in manager.active_connections[user_id]
    
    manager.disconnect(mock_ws, user_id)
    assert user_id not in manager.active_connections or mock_ws not in manager.active_connections[user_id]

@pytest.mark.asyncio
async def test_connection_manager_heartbeat_auditing():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    user_id = "user_abc"
    
    await manager.connect(mock_ws, user_id)
    assert mock_ws in manager.connection_metadata
    
    # Audit update heartbeat
    manager.update_heartbeat(mock_ws)
    assert manager.connection_metadata[mock_ws]["is_alive"] is True
    assert manager.connection_metadata[mock_ws]["last_heartbeat"] > 0

@pytest.mark.asyncio
async def test_connection_manager_personal_message_send():
    manager = ConnectionManager()
    mock_ws = AsyncMock()
    user_id = "user_send_test"
    
    await manager.connect(mock_ws, user_id)
    payload = {"type": "PREDICTION", "gesture": "HELLO", "confidence": 0.95}
    await manager.send_personal_message(payload, mock_ws)
    
    mock_ws.send_json.assert_called_once_with(payload)

@pytest.mark.asyncio
async def test_connection_manager_broadcast_to_user():
    manager = ConnectionManager()
    mock_ws1 = AsyncMock()
    mock_ws2 = AsyncMock()
    user_id = "multi_device_user"
    
    await manager.connect(mock_ws1, user_id)
    await manager.connect(mock_ws2, user_id)
    
    payload = {"type": "NOTIFICATION", "message": "Translation saved"}
    await manager.broadcast_to_user(payload, user_id)
    
    mock_ws1.send_json.assert_called_once_with(payload)
    mock_ws2.send_json.assert_called_once_with(payload)

@pytest.mark.asyncio
async def test_connection_manager_prunes_dead_sockets_on_failure():
    manager = ConnectionManager()
    mock_ws_alive = AsyncMock()
    mock_ws_dead = AsyncMock()
    mock_ws_dead.send_json.side_effect = Exception("Socket closed remotely")
    
    user_id = "faulty_user"
    await manager.connect(mock_ws_alive, user_id)
    await manager.connect(mock_ws_dead, user_id)
    
    payload = {"type": "TEST_BROADCAST"}
    await manager.broadcast_to_user(payload, user_id)
    
    # Check alive socket received payload, dead socket was pruned
    mock_ws_alive.send_json.assert_called_once_with(payload)
    assert mock_ws_dead not in manager.active_connections.get(user_id, [])
    assert mock_ws_dead not in manager.connection_metadata
