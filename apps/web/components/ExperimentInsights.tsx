import { bestRun } from "../lib/comparison";
import type { Experiment } from "../lib/experiments";
export function ExperimentInsights({runs}:{runs:Experiment[]}) {
  const best=bestRun(runs);
  if (!best) return <p className="muted">No experiments available for insights.</p>;
  const first=best.history[0]?.train ?? 0;
  const last=best.history.at(-1)?.train ?? 0;
  const improvement=first>0?(100*(first-last)/first):0;
  return <div className="insights"><div><span className="muted">Best run</span><strong>#{best.id}</strong></div><div><span className="muted">Final MSE</span><strong>{last.toFixed(6)}</strong></div><div><span className="muted">Loss reduction</span><strong>{improvement.toFixed(1)}%</strong></div></div>;
}
