export type PredictionPoint = { x: number; actual: number; predicted: number; partition: "train" | "validation" };
export function predictionMse(points: PredictionPoint[]): number | null {
  if (!points.length) return null;
  return points.reduce((sum, point) => sum + (point.predicted - point.actual) ** 2, 0) / points.length;
}
