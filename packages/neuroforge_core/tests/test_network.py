import numpy as np
import pytest
from neuroforge_core import MLP

def test_reproducible_initialization():
    a, b = MLP([2, 4, 1], seed=7), MLP([2, 4, 1], seed=7)
    assert all(np.array_equal(x, y) for x, y in zip(a.weights, b.weights))

def test_forward_shape():
    assert MLP([2, 4, 1]).forward(np.zeros((3, 2))).shape == (3, 1)

def test_learning_linear_mapping():
    x = np.array([[0.], [1.], [2.], [3.]])
    y = 2 * x + 1
    model = MLP([1, 1], seed=1)
    initial = np.mean((model.forward(x) - y) ** 2)
    for _ in range(1500):
        model.train_step(x, y, lr=0.02)
    assert np.mean((model.forward(x) - y) ** 2) < initial * 0.01

def test_bad_shapes():
    model = MLP([2, 1])
    with pytest.raises(ValueError):
        model.forward(np.zeros((1, 3)))
    with pytest.raises(ValueError):
        model.train_step(np.zeros((1, 2)), np.zeros((1, 2)))
