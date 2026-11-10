import json
import numpy as np
import pytest
from neuroforge_core import MLP
from neuroforge_core.experiments import export_history, train_experiment


def test_training_reduces_error_and_exports(tmp_path):
    x = np.array([[0.], [1.], [2.], [3.]])
    y = 2 * x + 1
    history = train_experiment(MLP([1, 1], seed=2), x, y, epochs=500, learning_rate=0.02,
                               validation=(x, y))
    assert history[-1].train_mse < history[0].train_mse
    assert history[-1].validation_mse is not None
    path = tmp_path / "history.json"
    export_history(history, path)
    assert len(json.loads(path.read_text())) == 500


def test_reproducible_history():
    x = np.arange(4, dtype=float).reshape(-1, 1)
    y = x * 2
    a = train_experiment(MLP([1, 1], seed=4), x, y, epochs=5, seed=9)
    b = train_experiment(MLP([1, 1], seed=4), x, y, epochs=5, seed=9)
    assert a == b


def test_rejects_empty_data():
    with pytest.raises(ValueError):
        train_experiment(MLP([1, 1]), np.empty((0, 1)), np.empty((0, 1)))
