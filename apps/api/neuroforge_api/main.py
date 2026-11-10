"""NeuroForge training API. Stateless; no user data persisted."""
from __future__ import annotations
from math import isfinite
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, model_validator
import numpy as np
from neuroforge_core import MLP
from neuroforge_core.experiments import train_experiment

app = FastAPI(title="NeuroForge API", version="0.1.0")

class TrainRequest(BaseModel):
    x: list[list[float]] = Field(min_length=2, max_length=500)
    y: list[list[float]] = Field(min_length=2, max_length=500)
    hidden_width: int = Field(default=8, ge=1, le=128)
    epochs: int = Field(default=100, ge=1, le=1000)
    learning_rate: float = Field(default=0.01, gt=0, le=0.5)
    seed: int = Field(default=42, ge=0, le=2**32 - 1)

    @model_validator(mode="after")
    def validate_samples(self):
        if len(self.x) != len(self.y) or len({len(row) for row in self.x}) != 1 or len({len(row) for row in self.y}) != 1:
            raise ValueError("samples must have consistent matching shapes")
        if not self.x[0] or not self.y[0]:
            raise ValueError("features and targets cannot be empty")
        if len(self.x[0]) > 64 or len(self.y[0]) > 16:
            raise ValueError("feature or target dimension too large")
        if not all(isfinite(value) for row in self.x + self.y for value in row):
            raise ValueError("all values must be finite")
        return self

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/v1/train")
def train(request: TrainRequest):
    x = np.asarray(request.x, dtype=float)
    y = np.asarray(request.y, dtype=float)
    model = MLP([x.shape[1], request.hidden_width, y.shape[1]], seed=request.seed)
    try:
        history = train_experiment(model, x, y, epochs=request.epochs,
                                   learning_rate=request.learning_rate, seed=request.seed)
    except (ValueError, FloatingPointError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return {"kind": "real-training", "model": {"input": x.shape[1], "hidden": request.hidden_width,
            "output": y.shape[1]}, "history": [{"epoch": item.epoch, "train": item.train_mse,
            "validation": item.validation_mse} for item in history]}
