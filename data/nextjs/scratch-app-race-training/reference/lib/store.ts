import { Run, PaceGoals } from "./types";

const SEED_RUNS: Run[] = [
  { id: "r1", type: "easy", distance: 8, date: "2024-07-01", completed: false },
  { id: "r2", type: "tempo", distance: 6, date: "2024-07-03", completed: false },
  { id: "r3", type: "long", distance: 20, date: "2024-07-07", completed: false },
];

let runs: Run[] = SEED_RUNS.map((r) => ({ ...r }));
let counter = 4;

export function __reset() {
  runs = SEED_RUNS.map((r) => ({ ...r }));
  counter = 4;
}

export function getRuns(): Run[] {
  return runs;
}

export function addRun(type: Run["type"], distance: number, date: string): Run | null {
  if (distance <= 0 || !date.trim()) return null;
  const r: Run = { id: `r${counter++}`, type, distance, date, completed: false };
  runs.push(r);
  return r;
}

export function deleteRun(id: string): void {
  runs = runs.filter((r) => r.id !== id);
}

export function toggleRun(id: string): void {
  const r = runs.find((x) => x.id === id);
  if (r) r.completed = !r.completed;
}
