import json
import logging
import asyncio
from typing import Dict, List, Set, Any
from fastapi import WebSocket

logger = logging.getLogger("websocket.manager")

class ConnectionManager:
    """
    Enterprise Connection Manager for real-time sign language streaming and multi-user broadcast.
    Provides connection tracking, dead-connection pruning, safe transmission, and Pub/Sub coordination.
    """
    def __init__(self):
        # Maps user_id -> List[WebSocket]
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Tracks connection metadata and timestamps
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept WebSocket handshake and register active connection."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        if websocket not in self.active_connections[user_id]:
            self.active_connections[user_id].append(websocket)
            
        self.connection_metadata[websocket] = {
            "user_id": user_id,
            "connected_at": asyncio.get_event_loop().time(),
            "last_heartbeat": asyncio.get_event_loop().time(),
            "is_alive": True
        }
        logger.info(f"WebSocket connected for user {user_id}. Active sessions for user: {len(self.active_connections[user_id])}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Safely deregister and clean up WebSocket connection."""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                
        if websocket in self.connection_metadata:
            del self.connection_metadata[websocket]
            
        logger.info(f"WebSocket disconnected for user {user_id}")

    def update_heartbeat(self, websocket: WebSocket):
        """Record latest client activity timestamp for health check auditing."""
        if websocket in self.connection_metadata:
            self.connection_metadata[websocket]["last_heartbeat"] = asyncio.get_event_loop().time()
            self.connection_metadata[websocket]["is_alive"] = True

    async def send_personal_message(self, message: dict, websocket: WebSocket) -> bool:
        """
        Safely transmit JSON payload to a specific WebSocket instance.
        Automatically handles disconnect recovery if transmission fails.
        """
        try:
            await websocket.send_json(message)
            return True
        except Exception as e:
            logger.warning(f"Failed to send personal message over WebSocket: {e}")
            meta = self.connection_metadata.get(websocket, {})
            user_id = meta.get("user_id", "unknown")
            self.disconnect(websocket, user_id=user_id)
            return False

    async def broadcast_to_user(self, message: dict, user_id: str) -> int:
        """
        Broadcast payload across all active devices/tabs registered to a user.
        Prunes dead sockets cleanly during transmission.
        Returns number of successful deliveries.
        """
        if user_id not in self.active_connections:
            return 0

        connections = list(self.active_connections[user_id])
        success_count = 0
        dead_sockets: List[WebSocket] = []

        for connection in connections:
            try:
                await connection.send_json(message)
                success_count += 1
            except Exception as e:
                logger.debug(f"Removing dead socket during user broadcast ({user_id}): {e}")
                dead_sockets.append(connection)

        for dead in dead_sockets:
            self.disconnect(dead, user_id=user_id)

        return success_count

    async def broadcast_all(self, message: dict) -> int:
        """
        Broadcast payload to all active connections across all users.
        Prunes dead connections and recovers from transmission interruptions.
        Returns total successful deliveries across the cluster.
        """
        success_count = 0
        dead_sockets: List[WebSocket] = []

        for user_id, connections in list(self.active_connections.items()):
            for connection in list(connections):
                try:
                    await connection.send_json(message)
                    success_count += 1
                except Exception as e:
                    logger.debug(f"Removing dead socket during broadcast_all ({user_id}): {e}")
                    dead_sockets.append(connection)

        for dead in dead_sockets:
            meta = self.connection_metadata.get(dead, {})
            user_id = meta.get("user_id", "unknown")
            self.disconnect(dead, user_id=user_id)

        return success_count

    def get_total_connections(self) -> int:
        """Return total active WebSocket connections currently managed."""
        return sum(len(conns) for conns in self.active_connections.values())

manager = ConnectionManager()
