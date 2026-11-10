import type { DatasetId } from "./datasets";
import type { Experiment } from "./experiments";
export function comparableRuns(runs: Experiment[], dataset: DatasetId): Experiment[] {
  return runs.filter(run => run.dataset === dataset);
}
export function comparisonSeries(runs: Experiment[]) {
  const epochs = Math.max(0, ...runs.map(run => run.history.length));
  return Array.from({ length: epochs }, (_, index) => {
    const point: Record<string, number | null> = { epoch: index + 1 };
    for (const run of runs) point[`run_${run.id}`] = run.history[index]?.train ?? null;
    return point;
  });
}
export function bestRun(runs: Experiment[]): Experiment | null {
  return runs.length ? [...runs].sort((a,b) => a.history.at(-1)!.train - b.history.at(-1)!.train)[0] : null;
}
