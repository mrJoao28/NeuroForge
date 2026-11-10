import { describe, expect, it } from "vitest";
import { appendExperiment, rankExperiments, type Experiment } from "./experiments";
const make = (id: number, loss: number): Experiment => ({ id, dataset: "linear", epochs: 1, rate: 0.01, width: 4, history: [{ epoch: 1, train: loss, validation: null }] });
describe("experiment comparison", () => {
  it("ranks by final training loss without mutating input", () => {
    const original = [make(1, 0.4), make(2, 0.1)];
    expect(rankExperiments(original).map(e => e.id)).toEqual([2, 1]);
    expect(original[0].id).toBe(1);
  });
  it("keeps the latest eight runs", () => {
    const runs = Array.from({ length: 8 }, (_, i) => make(i, i));
    expect(appendExperiment(runs, make(8, 8)).map(e => e.id)).toEqual([1,2,3,4,5,6,7,8]);
  });
});
