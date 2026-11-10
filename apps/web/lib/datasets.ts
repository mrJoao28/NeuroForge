/** Deterministic datasets for hands-on regression experiments. */
export type DatasetId = "linear" | "quadratic" | "sine";
export type Dataset = { id: DatasetId; name: string; description: string; x: number[][]; y: number[][] };
export const datasetOptions: { id: DatasetId; name: string; description: string }[] = [
  { id: "linear", name: "Linear", description: "y = 2x + 1" },
  { id: "quadratic", name: "Quadratic", description: "y = x²" },
  { id: "sine", name: "Sine wave", description: "y = sin(2πx)" },
];
export function createDataset(id: DatasetId, count = 40): Dataset {
  if (!Number.isInteger(count) || count < 2 || count > 500) throw new RangeError("count must be 2–500");
  const option = datasetOptions.find(item => item.id === id);
  if (!option) throw new Error("Unknown dataset");
  const x = Array.from({ length: count }, (_, i) => [i / (count - 1)]);
  const y = x.map(([value]) => [id === "linear" ? 2 * value + 1 : id === "quadratic" ? value * value : Math.sin(2 * Math.PI * value)]);
  return { ...option, x, y };
}
