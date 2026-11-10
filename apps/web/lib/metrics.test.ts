import { describe, expect, it } from "vitest";
import { predictionMse } from "./metrics";
describe("prediction metrics",()=>{
  it("returns null for empty data",()=>expect(predictionMse([])).toBeNull());
  it("calculates mean squared error",()=>expect(predictionMse([{x:0,actual:1,predicted:2,partition:"train"},{x:1,actual:2,predicted:4,partition:"validation"}])).toBe(2.5));
});
