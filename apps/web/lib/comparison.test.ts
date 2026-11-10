import { describe, expect, it } from "vitest";
import { comparableRuns, comparisonSeries, bestRun } from "./comparison";
import type { Experiment } from "./experiments";
const run = (id:number, dataset:"linear"|"sine", values:number[]):Experiment => ({id,dataset,epochs:values.length,rate:0.01,width:4,history:values.map((train,i)=>({epoch:i+1,train,validation:null}))});
describe("multi-run comparison",()=>{
  const runs=[run(1,"linear",[3,2]),run(2,"linear",[1]),run(3,"sine",[0.1])];
  it("filters comparable datasets",()=>expect(comparableRuns(runs,"linear")).toHaveLength(2));
  it("aligns epoch values and fills missing points with null",()=>expect(comparisonSeries(runs.slice(0,2))).toEqual([{epoch:1,run_1:3,run_2:1},{epoch:2,run_1:2,run_2:null}]));
  it("finds best final loss",()=>expect(bestRun(runs)?.id).toBe(3));
  it("handles empty history collections",()=>expect(comparisonSeries([])).toEqual([]));
});
