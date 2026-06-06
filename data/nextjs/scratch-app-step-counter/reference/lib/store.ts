import type { StepEntry, StepGoal } from "./types";

let goal: StepGoal = { dailyTarget: 10000 };

let entries: StepEntry[] = [
  { id: "1", date: "2024-01-10", steps: 8500, distanceKm: 6.8, caloriesBurned: 340, notes: "Morning walk", goalMet: false, createdAt: 1704844800000 },
  { id: "2", date: "2024-01-11", steps: 12000, distanceKm: 9.6, caloriesBurned: 480, notes: "Ran to work", goalMet: true, createdAt: 1704931200000 },
  { id: "3", date: "2024-01-12", steps: 10200, distanceKm: 8.16, caloriesBurned: 408, notes: "Evening jog", goalMet: true, createdAt: 1705017600000 },
];
let nextId = 4;

export function getEntries(): StepEntry[] { return [...entries]; }
export function getGoal(): StepGoal { return { ...goal }; }

export function addEntry(data: { date: string; steps: number; notes: string }): StepEntry {
  const distanceKm = Math.round(data.steps * 0.0008 * 100) / 100;
  const caloriesBurned = Math.round(data.steps * 0.04);
  const goalMet = data.steps >= goal.dailyTarget;
  const entry: StepEntry = { id: String(nextId++), ...data, distanceKm, caloriesBurned, goalMet, createdAt: Date.now() };
  entries.push(entry);
  return entry;
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entries.splice(idx, 1);
  return true;
}

export function updateGoal(dailyTarget: number): StepGoal {
  goal = { dailyTarget };
  return { ...goal };
}

export function getStats(): { totalSteps: number; avgSteps: number; goalMetDays: number; bestDay: StepEntry | null } {
  if (entries.length === 0) return { totalSteps: 0, avgSteps: 0, goalMetDays: 0, bestDay: null };
  const totalSteps = entries.reduce((a, e) => a + e.steps, 0);
  const avgSteps = Math.round(totalSteps / entries.length);
  const goalMetDays = entries.filter((e) => e.goalMet).length;
  const bestDay = entries.reduce((a, b) => (a.steps >= b.steps ? a : b));
  return { totalSteps, avgSteps, goalMetDays, bestDay };
}

export function __reset(): void {
  goal = { dailyTarget: 10000 };
  entries = [
    { id: "1", date: "2024-01-10", steps: 8500, distanceKm: 6.8, caloriesBurned: 340, notes: "Morning walk", goalMet: false, createdAt: 1704844800000 },
    { id: "2", date: "2024-01-11", steps: 12000, distanceKm: 9.6, caloriesBurned: 480, notes: "Ran to work", goalMet: true, createdAt: 1704931200000 },
    { id: "3", date: "2024-01-12", steps: 10200, distanceKm: 8.16, caloriesBurned: 408, notes: "Evening jog", goalMet: true, createdAt: 1705017600000 },
  ];
  nextId = 4;
}
