import numpy as np
from typing import List, Dict, Union

class LandmarkNormalizer:
    def normalize(self, raw_landmarks: Union[List[Dict[str, float]], List[List[float]]], num_hands: int = 1) -> List[float]:
        """
        Normalizes spatial coordinates:
        1. Separates up to 2 hands (21 landmarks each). If only 1 hand is detected, pads the second hand with zeros.
        2. Translates wrist coordinate (landmark 0) to origin (0, 0, 0) for position invariance.
        3. Scales by maximum Euclidean distance from wrist across all landmarks for scale invariance.
        4. Flattens into a fixed 126-dimensional feature vector (2 hands * 21 landmarks * 3 coordinates).
        """
        # Ensure standard 126 output length (2 hands * 21 points * 3 coordinates)
        normalized_vector = np.zeros(126, dtype=np.float32)

        if not raw_landmarks or len(raw_landmarks) < 21:
            return normalized_vector.tolist()

        # Helper to process single hand slice (21 points)
        def process_hand(points: List[Union[Dict[str, float], List[float]]]) -> np.ndarray:
            coords = np.zeros((21, 3), dtype=np.float32)
            for idx, pt in enumerate(points[:21]):
                if isinstance(pt, dict):
                    coords[idx] = [pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)]
                elif isinstance(pt, (list, tuple)) and len(pt) >= 3:
                    coords[idx] = [pt[0], pt[1], pt[2]]
            
            # Step 1: Translate wrist (index 0) to (0, 0, 0)
            wrist = coords[0].copy()
            coords = coords - wrist

            # Step 2: Scale by max distance from origin
            distances = np.linalg.norm(coords, axis=1)
            max_dist = np.max(distances)
            if max_dist > 1e-6:
                coords = coords / max_dist
            
            return coords.flatten()

        # Process first hand
        hand1_vector = process_hand(raw_landmarks[:21])
        normalized_vector[:63] = hand1_vector

        # Process second hand if present
        if len(raw_landmarks) >= 42:
            hand2_vector = process_hand(raw_landmarks[21:42])
            normalized_vector[63:] = hand2_vector

        return normalized_vector.tolist()

landmark_normalizer = LandmarkNormalizer()
