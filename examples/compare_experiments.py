"""Compare training configurations without external services."""
import numpy as np
from neuroforge_core import MLP
from neuroforge_core.experiments import train_experiment
from neuroforge_core.comparison import compare, export_comparison

x = np.linspace(0, 1, 20).reshape(-1, 1)
y = 2 * x + 1
histories = {}
for width in (4, 8, 16):
    model = MLP([1, width, 1], seed=42)
    histories[f"width-{width}"] = train_experiment(
        model, x, y, epochs=200, learning_rate=0.05, validation=(x, y))
ranking = compare(histories)
for result in ranking:
    print(f"{result.name}: best validation MSE={result.best_validation_mse:.6f}")
export_comparison(ranking, "comparison.json")
