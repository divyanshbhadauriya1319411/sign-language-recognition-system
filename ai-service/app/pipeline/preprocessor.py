import base64
import io
import cv2
import numpy as np
from PIL import Image
from typing import Dict, Any, List, Optional
import mediapipe as mp
from app.config import settings

class HandPreprocessor:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=settings.MIN_HAND_DETECTION_CONFIDENCE,
            min_tracking_confidence=settings.MIN_HAND_TRACKING_CONFIDENCE
        )

    def decode_frame(self, base64_frame: str) -> Optional[np.ndarray]:
        """Decodes base64 JPEG/PNG string or data-uri into OpenCV BGR image tensor."""
        try:
            if "," in base64_frame:
                base64_frame = base64_frame.split(",")[1]
            image_data = base64.b64decode(base64_frame)
            image_pil = Image.open(io.BytesIO(image_data)).convert("RGB")
            # Convert RGB PIL to BGR OpenCV
            image_cv = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
            return image_cv
        except Exception:
            return None

    def process_frame(self, frame_bgr: np.ndarray) -> Dict[str, Any]:
        """Runs MediaPipe Hands model on BGR image tensor to extract 3D landmarks for left and right hands."""
        # Convert BGR to RGB for MediaPipe
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        results = self.hands.process(frame_rgb)

        raw_landmarks: List[Dict[str, float]] = []
        handedness_labels: List[str] = []
        hand_detected = False
        avg_confidence = 0.0

        if results.multi_hand_landmarks and results.multi_handedness:
            hand_detected = True
            conf_sum = 0.0
            
            for idx, hand_lms in enumerate(results.multi_hand_landmarks):
                hand_info = results.multi_handedness[idx].classification[0]
                handedness_labels.append(hand_info.label)  # "Left" or "Right"
                conf_sum += hand_info.score

                # Extract 21 landmarks per hand (x, y, z)
                for lm in hand_lms.landmark:
                    raw_landmarks.append({"x": lm.x, "y": lm.y, "z": lm.z, "visibility": getattr(lm, "visibility", 1.0)})

            avg_confidence = conf_sum / len(results.multi_handedness) if len(results.multi_handedness) > 0 else 0.0

        return {
            "hand_detected": hand_detected,
            "raw_landmarks": raw_landmarks,
            "handedness": handedness_labels,
            "num_hands": len(handedness_labels),
            "detection_confidence": round(avg_confidence, 4)
        }

hand_preprocessor = HandPreprocessor()
