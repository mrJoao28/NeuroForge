"""Minimal, reproducible NumPy neural network for educational experiments."""
from __future__ import annotations
import numpy as np

class MLP:
    def __init__(self, sizes: list[int], seed: int = 42):
        if len(sizes) < 2 or any(s <= 0 for s in sizes):
            raise ValueError("sizes must contain at least two positive dimensions")
        rng = np.random.default_rng(seed)
        self.weights = [rng.normal(0, np.sqrt(2 / a), (a, b)) for a, b in zip(sizes[:-1], sizes[1:])]
        self.biases = [np.zeros((1, b)) for b in sizes[1:]]

    def forward(self, x: np.ndarray) -> np.ndarray:
        out = np.asarray(x, dtype=float)
        if out.ndim != 2 or out.shape[1] != self.weights[0].shape[0]:
            raise ValueError("input must be a 2D batch with matching features")
        for i, (w, b) in enumerate(zip(self.weights, self.biases)):
            out = out @ w + b
            if i < len(self.weights) - 1:
                out = np.maximum(out, 0)
        return out

    def train_step(self, x: np.ndarray, y: np.ndarray, lr: float = 0.01) -> float:
        if not np.isfinite(lr) or lr <= 0:
            raise ValueError("lr must be positive and finite")
        activations = [np.asarray(x, dtype=float)]
        if activations[0].ndim != 2 or activations[0].shape[1] != self.weights[0].shape[0]:
            raise ValueError("invalid input shape")
        for i, (w, b) in enumerate(zip(self.weights, self.biases)):
            z = activations[-1] @ w + b
            activations.append(np.maximum(z, 0) if i < len(self.weights) - 1 else z)
        target = np.asarray(y, dtype=float)
        if target.shape != activations[-1].shape or len(target) == 0:
            raise ValueError("target shape must match nonempty output batch")
        delta = 2 * (activations[-1] - target) / target.size
        loss = float(np.mean((activations[-1] - target) ** 2))
        gradients_w = [None] * len(self.weights)
        gradients_b = [None] * len(self.biases)
        for i in reversed(range(len(self.weights))):
            gradients_w[i] = activations[i].T @ delta
            gradients_b[i] = delta.sum(axis=0, keepdims=True)
            if i > 0:
                delta = (delta @ self.weights[i].T) * (activations[i] > 0)
        for i in range(len(self.weights)):
            self.weights[i] -= lr * gradients_w[i]
            self.biases[i] -= lr * gradients_b[i]
        return loss
