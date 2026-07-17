import threading
from collections import deque
from typing import Dict, List, Optional
import numpy as np
from app.config import settings

class TemporalBufferManager:
    """
    Manages high-speed thread-safe circular sliding window buffers for consecutive frames.
    For each active WebSocket session, maintains up to sequence_length (T=30) normalized landmark vectors (126 features).
    """
    def __init__(self, sequence_length: int = settings.TEMPORAL_BUFFER_SIZE):
        self.sequence_length = sequence_length
        self.buffers: Dict[str, deque] = {}
        self.lock = threading.Lock()

    def add_frame(self, session_id: str, feature_vector: List[float]) -> np.ndarray:
        """Appends a 126-dim normalized vector into session buffer and returns padded/full (T, 126) tensor ready for model inference."""
        with self.lock:
            if session_id not in self.buffers:
                self.buffers[session_id] = deque(maxlen=self.sequence_length)
            
            self.buffers[session_id].append(feature_vector)
            current_len = len(self.buffers[session_id])

            # Build numpy tensor of shape (sequence_length, 126)
            tensor_np = np.zeros((self.sequence_length, len(feature_vector)), dtype=np.float32)
            
            # If buffer is not full yet, left-pad by repeating the earliest frame or zeros
            buffer_list = list(self.buffers[session_id])
            if current_len < self.sequence_length:
                pad_size = self.sequence_length - current_len
                # Left pad with zeros
                tensor_np[pad_size:] = np.array(buffer_list, dtype=np.float32)
            else:
                tensor_np[:] = np.array(buffer_list, dtype=np.float32)

            return tensor_np

    def clear_session(self, session_id: str) -> None:
        """Clears sequence history when a translation session ends or disconnects."""
        with self.lock:
            if session_id in self.buffers:
                del self.buffers[session_id]

    def get_buffer_size(self, session_id: str) -> int:
        with self.lock:
            return len(self.buffers.get(session_id, []))

buffer_manager = TemporalBufferManager()
