import { Metric, Goal, HistoryEntry } from "./types";

const SEED_METRICS: Metric[] = [
  { id: "1", name: "MRR", category: "Revenue", unit: "currency", currentValue: 45000, targetValue: 60000 },
  { id: "2", name: "Churn Rate", category: "Revenue", unit: "percent", currentValue: 3.2, targetValue: 2.0 },
  { id: "3", name: "DAU", category: "Engagement", unit: "number", currentValue: 1200, targetValue: 2000 },
  { id: "4", name: "NPS", category: "Engagement", unit: "number", currentValue: 42, targetValue: 50 },
];

const SEED_GOALS: Goal[] = [
  { id: "1", metricId: "1", quarter: "Q2", year: 2024, targetValue: 55000 },
  { id: "2", metricId: "3", quarter: "Q2", year: 2024, targetValue: 1500 },
];

let metrics: Metric[] = SEED_METRICS.map((m) => ({ ...m }));
let goals: Goal[] = SEED_GOALS.map((g) => ({ ...g }));
let history: HistoryEntry[] = [];
let nextMetricId = 5;
let nextGoalId = 3;
let nextHistoryId = 1;

export function getMetrics(): Metric[] {
  return metrics.map((m) => ({ ...m }));
}

export function addMetric(data: Omit<Metric, "id">): Metric {
  const m: Metric = { ...data, id: String(nextMetricId++) };
  metrics.push(m);
  return { ...m };
}

export function updateMetric(id: string, data: Partial<Omit<Metric, "id">>): Metric | null {
  const idx = metrics.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  metrics[idx] = { ...metrics[idx], ...data };
  return { ...metrics[idx] };
}

export function deleteMetric(id: string): boolean {
  const idx = metrics.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  metrics.splice(idx, 1);
  return true;
}

export function getGoals(): Goal[] {
  return goals.map((g) => ({ ...g }));
}

export function addGoal(data: Omit<Goal, "id">): Goal {
  const g: Goal = { ...data, id: String(nextGoalId++) };
  goals.push(g);
  return { ...g };
}

export function getHistory(): HistoryEntry[] {
  return history.map((h) => ({ ...h }));
}

export function addHistory(data: Omit<HistoryEntry, "id">): HistoryEntry {
  const h: HistoryEntry = { ...data, id: String(nextHistoryId++) };
  history.push(h);
  return { ...h };
}

export function __reset(): void {
  metrics = SEED_METRICS.map((m) => ({ ...m }));
  goals = SEED_GOALS.map((g) => ({ ...g }));
  history = [];
  nextMetricId = 5;
  nextGoalId = 3;
  nextHistoryId = 1;
}
