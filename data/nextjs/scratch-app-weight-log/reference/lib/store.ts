import type { WeightEntry, WeightUnit } from "./types";

let entries: WeightEntry[] = [
  { id: "1", date: "2024-01-01", weight: 80.5, unit: "kg", note: "Start of year", createdAt: 1704067200000 },
  { id: "2", date: "2024-01-08", weight: 80.1, unit: "kg", note: "Down a bit", createdAt: 1704672000000 },
  { id: "3", date: "2024-01-15", weight: 79.8, unit: "kg", note: "Steady progress", createdAt: 1705276800000 },
];
let nextId = 4;

export function getEntries(): WeightEntry[] {
  return [...entries];
}

export function addEntry(data: { date: string; weight: number; unit: WeightUnit; note: string }): WeightEntry {
  const entry: WeightEntry = { id: String(nextId++), ...data, createdAt: Date.now() };
  entries.push(entry);
  return entry;
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entries.splice(idx, 1);
  return true;
}

export function getStats(): { min: number; max: number; avg: number; change: number } {
  if (entries.length === 0) return { min: 0, max: 0, avg: 0, change: 0 };
  const sorted = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  const weights = sorted.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10;
  const change = Math.round((sorted[sorted.length - 1].weight - sorted[0].weight) * 10) / 10;
  return { min, max, avg, change };
}

export function __reset(): void {
  entries = [
    { id: "1", date: "2024-01-01", weight: 80.5, unit: "kg", note: "Start of year", createdAt: 1704067200000 },
    { id: "2", date: "2024-01-08", weight: 80.1, unit: "kg", note: "Down a bit", createdAt: 1704672000000 },
    { id: "3", date: "2024-01-15", weight: 79.8, unit: "kg", note: "Steady progress", createdAt: 1705276800000 },
  ];
  nextId = 4;
}
