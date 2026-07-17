import json
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np
import torch
import torch.nn.functional as F
from app.config import settings
from app.models_store.generator import ISLTemporalClassifier, generate_pre_trained_weights

class ISLClassifier:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model: Optional[torch.nn.Module] = None
        self.vocabulary: List[Dict[str, Any]] = []
        self.id_to_gesture: Dict[int, str] = {}
        # Stability tracking per session: {session_id: {"last_gesture": str, "count": int}}
        self.stability_tracker: Dict[str, Dict[str, Any]] = {}
        self.load_resources()

    def load_resources(self):
        vocab_path = Path(settings.AI_VOCABULARY_PATH)
        model_path = Path(settings.AI_MODEL_PATH)

        if not vocab_path.exists() or not model_path.exists():
            store_dir = Path(__file__).parent.parent / "models_store"
            if not vocab_path.exists():
                vocab_path = store_dir / "vocabulary.json"
            if not model_path.exists():
                model_path = store_dir / "isl_gesture_model_v1.pt"

        # Ensure vocabulary is loaded
        if vocab_path.exists():
            with open(vocab_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.vocabulary = data.get("gestures", [])
                self.id_to_gesture = {int(g["id"]): g["label"] for g in self.vocabulary}
        
        # Ensure model weights exist
        if not model_path.exists():
            generate_pre_trained_weights()

        if model_path.exists():
            checkpoint = torch.load(model_path, map_location=self.device)
            num_classes = checkpoint.get("num_classes", len(self.vocabulary) or 57)
            self.model = ISLTemporalClassifier(input_dim=126, hidden_dim=128, num_classes=num_classes, num_layers=2)
            self.model.load_state_dict(checkpoint["state_dict"])
            self.model.to(self.device)
            self.model.eval()

    def classify_sequence(self, session_id: str, temporal_tensor_np: np.ndarray) -> Dict[str, Any]:
        """
        Evaluates (30, 126) tensor through PyTorch Bi-LSTM / TCN.
        Returns predicted gesture, confidence score, and checks stability criteria.
        """
        if self.model is None or not self.vocabulary:
            self.load_resources()
            if self.model is None:
                return {"gesture": "Initializing Model...", "confidence": 0.0, "confirmed": False}

        # Convert numpy to tensor (1, T, F)
        input_tensor = torch.tensor(temporal_tensor_np, dtype=torch.float32, device=self.device).unsqueeze(0)
        
        with torch.no_grad():
            logits = self.model(input_tensor)
            probs = F.softmax(logits, dim=1).squeeze(0)
            max_prob, max_idx = torch.max(probs, dim=0)

        confidence = float(max_prob.item())
        pred_id = int(max_idx.item())
        predicted_label = self.id_to_gesture.get(pred_id, "Unknown Gesture")

        # Check against confidence threshold
        confirmed = False
        if confidence >= settings.CONFIDENCE_THRESHOLD:
            # Check consecutive frames debouncing
            tracker = self.stability_tracker.get(session_id, {"last_gesture": "", "count": 0})
            if tracker["last_gesture"] == predicted_label:
                tracker["count"] += 1
            else:
                tracker["last_gesture"] = predicted_label
                tracker["count"] = 1
            
            self.stability_tracker[session_id] = tracker
            if tracker["count"] >= settings.CONSECUTIVE_CONFIRM_FRAMES:
                confirmed = True
        else:
            self.stability_tracker[session_id] = {"last_gesture": predicted_label, "count": 0}

        # Get top-3 predictions for diagnostic overlay
        top3_probs, top3_indices = torch.topk(probs, min(3, len(self.vocabulary)))
        top3_list = [
            {"gesture": self.id_to_gesture.get(int(top3_indices[i].item()), "Unknown"), "confidence": round(float(top3_probs[i].item()), 4)}
            for i in range(len(top3_indices))
        ]

        return {
            "gesture": predicted_label if confidence >= 0.4 else "No Sign Detected",
            "confidence": round(confidence, 4),
            "confirmed": confirmed,
            "top_predictions": top3_list
        }

    def reset_stability(self, session_id: str):
        if session_id in self.stability_tracker:
            del self.stability_tracker[session_id]

isl_classifier = ISLClassifier()
