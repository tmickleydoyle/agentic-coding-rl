import { WaterEntry } from "./types";

const SEED: WaterEntry[] = [
  { id: "w1", date: "2024-05-20", cups: 2, note: "Morning", time: "08:00" },
  { id: "w2", date: "2024-05-20", cups: 1, note: "Before lunch", time: "11:30" },
  { id: "w3", date: "2024-05-20", cups: 2, note: "After workout", time: "15:00" },
  { id: "w4", date: "2024-05-20", cups: 1, note: "Evening", time: "19:00" },
];

let entries: WaterEntry[] = SEED.map((e) => ({ ...e }));
let goal = 8;
let nextId = 5;

export function getEntries(): WaterEntry[] { return entries; }

export function addEntry(data: Omit<WaterEntry, "id">): WaterEntry {
  const entry: WaterEntry = { ...data, id: `w${nextId++}` };
  entries = [...entries, entry];
  return entry;
}

export function deleteEntry(id: string): void {
  entries = entries.filter((e) => e.id !== id);
}

export function getTodayTotal(): number {
  return entries.filter((e) => e.date === "2024-05-20").reduce((s, e) => s + e.cups, 0);
}

export function getDailyGoal(): number { return goal; }

export function setDailyGoal(cups: number): void { goal = cups; }

export function __reset(): void {
  entries = SEED.map((e) => ({ ...e }));
  goal = 8;
  nextId = 5;
}
