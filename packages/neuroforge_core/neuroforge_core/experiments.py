"""Reproducible training experiments and metric history."""
from __future__ import annotations
from dataclasses import asdict, dataclass
import json
from pathlib import Path
import numpy as np
from .network import MLP

@dataclass(frozen=True)
class EpochMetrics:
    epoch: int
    train_mse: float
    validation_mse: float | None


def mse(model: MLP, x: np.ndarray, y: np.ndarray) -> float:
    prediction = model.forward(x)
    target = np.asarray(y, dtype=float)
    if prediction.shape != target.shape or not target.size:
        raise ValueError("target must match nonempty predictions")
    return float(np.mean((prediction - target) ** 2))


def train_experiment(model: MLP, x: np.ndarray, y: np.ndarray, *, epochs: int = 100,
                     learning_rate: float = 0.01, validation: tuple[np.ndarray, np.ndarray] | None = None,
                     shuffle: bool = True, seed: int = 42) -> list[EpochMetrics]:
    if epochs < 1:
        raise ValueError("epochs must be >= 1")
    features = np.asarray(x, dtype=float)
    targets = np.asarray(y, dtype=float)
    if features.ndim != 2 or targets.ndim != 2 or len(features) == 0 or len(features) != len(targets):
        raise ValueError("features and targets must be nonempty matching 2D batches")
    mse(model, features, targets)
    if validation is not None:
        mse(model, *validation)
    rng = np.random.default_rng(seed)
    history = []
    for epoch in range(1, epochs + 1):
        order = rng.permutation(len(features)) if shuffle else np.arange(len(features))
        model.train_step(features[order], targets[order], lr=learning_rate)
        history.append(EpochMetrics(epoch, mse(model, features, targets),
                                    mse(model, *validation) if validation is not None else None))
    return history


def export_history(history: list[EpochMetrics], path: str | Path) -> None:
    """Write portable JSON with no NumPy-specific values."""
    Path(path).write_text(json.dumps([asdict(item) for item in history], indent=2) + "\n", encoding="utf-8")
