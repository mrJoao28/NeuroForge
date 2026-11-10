"""Deterministic, disjoint train/validation splitting."""
from __future__ import annotations
import numpy as np

def split_dataset(x: np.ndarray, y: np.ndarray, validation_fraction: float, seed: int):
    if len(x) != len(y) or len(x) < 2:
        raise ValueError("at least two matching samples required")
    if not 0 <= validation_fraction <= 0.5:
        raise ValueError("validation fraction must be between 0 and 0.5")
    if validation_fraction == 0:
        return (x, y), None
    count = max(1, int(round(len(x) * validation_fraction)))
    count = min(count, len(x) - 1)
    indices = np.random.default_rng(seed).permutation(len(x))
    validation_indices, train_indices = indices[:count], indices[count:]
    return (x[train_indices], y[train_indices]), (x[validation_indices], y[validation_indices])
