import { describe, expect, it } from "vitest";
import { exportExperimentsCsv } from "./export";
describe("CSV export",()=>{
  it("includes header and one row per epoch",()=>{
    const csv=exportExperimentsCsv([{id:1,dataset:"linear",epochs:2,rate:0.02,width:4,history:[{epoch:1,train:0.3,validation:null},{epoch:2,train:0.1,validation:0.2}]}]);
    expect(csv.trim().split("\n")).toHaveLength(3);
    expect(csv).toContain('"linear"');expect(csv).toContain('"0.2"');
  });
});
