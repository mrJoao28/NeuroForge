import { describe, expect, it } from "vitest";
import { createDataset } from "./datasets";
describe("dataset presets", () => {
  it("creates matching nonempty samples", () => {
    for (const id of ["linear", "quadratic", "sine"] as const) {
      const dataset = createDataset(id);
      expect(dataset.x).toHaveLength(40);
      expect(dataset.y).toHaveLength(40);
      expect(dataset.x[0]).toEqual([0]);
      expect(dataset.x.at(-1)).toEqual([1]);
    }
  });
  it("computes correct values", () => {
    expect(createDataset("linear", 2).y).toEqual([[1], [3]]);
    expect(createDataset("quadratic", 2).y).toEqual([[0], [1]]);
    expect(createDataset("sine", 2).y[0][0]).toBeCloseTo(0);
  });
  it("rejects invalid sizes", () => expect(() => createDataset("linear", 501)).toThrow());
});
