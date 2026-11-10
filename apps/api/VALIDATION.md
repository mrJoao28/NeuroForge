# Holdout validation and predictions

The `POST /v1/train` endpoint accepts `validation_fraction` between 0 and 0.5 (default 0.2). Samples are shuffled deterministically with the experiment seed and split into disjoint training and validation subsets. A fraction of 0 disables validation and returns `null` validation metrics.

The response includes `history[].train` and `history[].validation`, plus `predictions` for single-feature, single-output regression datasets. Predictions are calculated after training for visualization and **are not a separate test-set evaluation**. Validation results can guide model selection, but an untouched test set is required for unbiased final evaluation.

Note: the workbench comparison history currently ranks by training MSE; interpret comparisons cautiously, particularly across different datasets.
