import { Metric, Goal, HistoryEntry } from "./types";

export function getMetrics(): Metric[] { return []; }
export function addMetric(_data: Omit<Metric, "id">): Metric {
  return { id: "", name: "", category: "Growth", unit: "number", currentValue: 0, targetValue: 0 };
}
export function updateMetric(_id: string, _data: Partial<Omit<Metric, "id">>): Metric | null { return null; }
export function deleteMetric(_id: string): boolean { return false; }
export function getGoals(): Goal[] { return []; }
export function addGoal(_data: Omit<Goal, "id">): Goal {
  return { id: "", metricId: "", quarter: "Q1", year: 2024, targetValue: 0 };
}
export function getHistory(): HistoryEntry[] { return []; }
export function addHistory(_data: Omit<HistoryEntry, "id">): HistoryEntry {
  return { id: "", metricId: "", value: 0, date: "" };
}
export function __reset(): void {}
