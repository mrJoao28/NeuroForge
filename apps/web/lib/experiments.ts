import type { DatasetId } from "./datasets";
export type Point = { epoch: number; train: number; validation: number | null };
export type Experiment = { id: number; dataset: DatasetId; epochs: number; rate: number; width: number; history: Point[] };
export function finalLoss(experiment: Experiment): number {
  const loss = experiment.history.at(-1)?.train;
  if (loss === undefined || !Number.isFinite(loss)) throw new Error("Invalid experiment history");
  return loss;
}
export function rankExperiments(experiments: Experiment[]): Experiment[] {
  return [...experiments].sort((a, b) => finalLoss(a) - finalLoss(b));
}
export function appendExperiment(experiments: Experiment[], next: Experiment, max = 8): Experiment[] {
  return [...experiments, next].slice(-max);
}
