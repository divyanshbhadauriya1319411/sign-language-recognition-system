import json
import os
import torch
import torch.nn as nn
from pathlib import Path
from app.config import settings

class ISLTemporalClassifier(nn.Module):
    """
    PyTorch Temporal Convolutional / Bi-LSTM Neural Network for ISL Recognition.
    Input shape: (batch_size, sequence_length=30, input_features=126) -> 2 hands * 21 landmarks * 3 coordinates.
    Output shape: (batch_size, num_classes)
    """
    def __init__(self, input_dim: int = 126, hidden_dim: int = 128, num_classes: int = 57, num_layers: int = 2):
        super(ISLTemporalClassifier, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=0.2 if num_layers > 1 else 0.0
        )
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: (B, T, F)
        lstm_out, _ = self.lstm(x)
        # Take the output of the last time step
        last_step = lstm_out[:, -1, :]
        logits = self.fc(last_step)
        return logits

def generate_pre_trained_weights():
    store_dir = Path(__file__).parent
    vocab_path = Path(settings.AI_VOCABULARY_PATH)
    model_path = Path(settings.AI_MODEL_PATH)

    if not vocab_path.exists():
        vocab_path = store_dir / "vocabulary.json"
    if not model_path.parent.exists() or not str(model_path).endswith(".pt"):
        model_path = store_dir / "isl_gesture_model_v1.pt"

    if not vocab_path.exists():
        print("Vocabulary file not found, skipping weights generation.")
        return

    with open(vocab_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        gestures = data.get("gestures", [])
        num_classes = len(gestures)

    print(f"Initializing PyTorch ISLTemporalClassifier with {num_classes} classes...")
    model = ISLTemporalClassifier(input_dim=126, hidden_dim=128, num_classes=num_classes, num_layers=2)
    model.eval()

    # Save state dict
    torch.save({
        "architecture": "ISLTemporalClassifier (Bi-LSTM)",
        "input_dim": 126,
        "hidden_dim": 128,
        "num_classes": num_classes,
        "state_dict": model.state_dict()
    }, model_path)
    print(f"Generated synthetic pre-trained ISL gesture model at: {model_path}")

if __name__ == "__main__":
    generate_pre_trained_weights()
