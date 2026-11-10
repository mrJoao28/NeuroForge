"""Compare experiment histories and select a best model by validation error."""
from __future__ import annotations
from dataclasses import asdict, dataclass
import json
from pathlib import Path
from collections.abc import Mapping, Sequence
from .experiments import EpochMetrics

@dataclass(frozen=True)
class ExperimentSummary:
    name: str
    epochs: int
    final_train_mse: float
    final_validation_mse: float | None
    best_validation_mse: float | None
    best_epoch: int | None


def summarize(name: str, history: Sequence[EpochMetrics]) -> ExperimentSummary:
    if not name.strip() or not history:
        raise ValueError("name and nonempty history are required")
    if any(item.epoch != i + 1 for i, item in enumerate(history)):
        raise ValueError("epochs must be consecutive starting at 1")
    best = min((item for item in history if item.validation_mse is not None),
               key=lambda item: item.validation_mse, default=None)
    last = history[-1]
    return ExperimentSummary(name, len(history), last.train_mse, last.validation_mse,
                             best.validation_mse if best else None,
                             best.epoch if best else None)


def compare(histories: Mapping[str, Sequence[EpochMetrics]]) -> list[ExperimentSummary]:
    if not histories:
        raise ValueError("at least one experiment is required")
    summaries = [summarize(name, history) for name, history in histories.items()]
    return sorted(summaries, key=lambda item: (
        item.best_validation_mse is None,
        item.best_validation_mse if item.best_validation_mse is not None else item.final_train_mse,
        item.name,
    ))


def export_comparison(summaries: Sequence[ExperimentSummary], path: str | Path) -> None:
    Path(path).write_text(json.dumps([asdict(item) for item in summaries], indent=2) + "\n", encoding="utf-8")
