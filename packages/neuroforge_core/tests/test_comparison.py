import json
import pytest
from neuroforge_core.comparison import compare, summarize, export_comparison
from neuroforge_core.experiments import EpochMetrics


def test_ranking_by_best_validation_mse(tmp_path):
    slow = [EpochMetrics(1, 1.0, 0.8), EpochMetrics(2, 0.5, 0.4)]
    fast = [EpochMetrics(1, 0.7, 0.3), EpochMetrics(2, 0.2, 0.35)]
    ranking = compare({"slow": slow, "fast": fast})
    assert [item.name for item in ranking] == ["fast", "slow"]
    assert ranking[0].best_epoch == 1
    target = tmp_path / "comparison.json"
    export_comparison(ranking, target)
    assert json.loads(target.read_text())[0]["name"] == "fast"


def test_training_only_is_supported():
    result = summarize("train-only", [EpochMetrics(1, 0.2, None)])
    assert result.best_epoch is None
    assert result.best_validation_mse is None


def test_invalid_histories():
    with pytest.raises(ValueError):
        compare({})
    with pytest.raises(ValueError):
        summarize("bad", [EpochMetrics(2, 0.1, None)])
