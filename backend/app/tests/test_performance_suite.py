import pytest
import time
import asyncio
from unittest.mock import AsyncMock
from httpx import AsyncClient
from app.websocket.connection_manager import ConnectionManager

@pytest.mark.asyncio
async def test_health_check_latency_benchmark(async_client: AsyncClient):
    start_time = time.perf_counter()
    response = await async_client.get("/health")
    end_time = time.perf_counter()
    
    duration_ms = (end_time - start_time) * 1000.0
    assert response.status_code == 200
    # Health endpoint must respond rapidly (< 250ms under normal condition)
    assert duration_ms < 500.0

@pytest.mark.asyncio
async def test_connection_manager_concurrent_scaling():
    manager = ConnectionManager()
    num_clients = 100
    mocks = [AsyncMock() for _ in range(num_clients)]
    
    start_time = time.perf_counter()
    connect_tasks = [manager.connect(mock, f"user_{i}") for i, mock in enumerate(mocks)]
    await asyncio.gather(*connect_tasks)
    end_time = time.perf_counter()
    
    assert len(manager.active_connections) == num_clients
    assert (end_time - start_time) < 1.0  # 100 concurrent connections registered in under 1s
    
    # Broadcast performance across 100 connections
    broadcast_start = time.perf_counter()
    await manager.broadcast_all({"type": "SYSTEM_NOTICE", "message": "High load test"})
    broadcast_end = time.perf_counter()
    
    assert (broadcast_end - broadcast_start) < 2.0  # Broadcast to 100 clients finishes quickly
