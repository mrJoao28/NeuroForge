import type { Experiment } from "./experiments";
const KEY="neuroforge:experiments:v1";
export function saveExperiments(storage: Pick<Storage,"setItem">, runs:Experiment[]) {
  storage.setItem(KEY,JSON.stringify(runs.slice(-8)));
}
export function loadExperiments(storage: Pick<Storage,"getItem">):Experiment[] {
  try {
    const parsed:unknown=JSON.parse(storage.getItem(KEY)??"[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((run):run is Experiment=>Boolean(run && typeof run==="object" &&
      Number.isSafeInteger(run.id) && ["linear","quadratic","sine"].includes(run.dataset) &&
      Number.isFinite(run.epochs) && Number.isFinite(run.rate) && Number.isFinite(run.width) &&
      Array.isArray(run.history) && run.history.length>0 && run.history.length<=1000 &&
      run.history.every((point:unknown)=>Boolean(point && typeof point==="object" &&
      "epoch" in point && "train" in point && Number.isFinite(point.epoch) && Number.isFinite(point.train))))).slice(-8);
  } catch { return []; }
}
export function clearExperiments(storage:Pick<Storage,"removeItem">){storage.removeItem(KEY);}
