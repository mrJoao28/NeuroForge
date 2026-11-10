import type { Experiment } from "./experiments";
const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"','""')}"`;
export function exportExperimentsCsv(runs: Experiment[]): string {
  const header = "run,dataset,epochs,learning_rate,hidden_neurons,epoch,train_mse,validation_mse";
  const rows = runs.flatMap(run => run.history.map(point => [run.id,run.dataset,run.epochs,run.rate,run.width,point.epoch,point.train,point.validation ?? ""].map(escapeCsv).join(",")));
  return [header,...rows].join("\n")+"\n";
}
export function downloadText(filename:string, content:string, type:string) {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const link=document.createElement("a");link.href=url;link.download=filename;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
