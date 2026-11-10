"""Run with: pip install -e './packages/neuroforge_core[test]' && python examples/train_linear.py"""
import numpy as np
from neuroforge_core import MLP
from neuroforge_core.experiments import export_history, train_experiment

x = np.arange(10, dtype=float).reshape(-1, 1) / 10
model = MLP([1, 8, 1], seed=42)
history = train_experiment(model, x, 2 * x + 1, epochs=500, learning_rate=0.05,
                           validation=(x, 2 * x + 1))
export_history(history, "training-history.json")
print(f"Final training MSE: {history[-1].train_mse:.6f}")
