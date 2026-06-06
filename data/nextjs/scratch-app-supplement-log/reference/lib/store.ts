import { Supplement, DoseLog } from "./types";

const SEED_SUPPLEMENTS: Supplement[] = [
  { id: "s1", name: "Vitamin D", dosage: "1000 IU", frequency: "daily", notes: "Take with food" },
  { id: "s2", name: "Fish Oil", dosage: "1000mg", frequency: "daily", notes: "Omega-3s" },
  { id: "s3", name: "Magnesium", dosage: "400mg", frequency: "daily", notes: "Before bed" },
  { id: "s4", name: "Vitamin C", dosage: "500mg", frequency: "twice-daily", notes: "" },
];

const SEED_LOGS: DoseLog[] = [
  { id: "dl1", supplementId: "s1", date: "2024-06-01", time: "08:00", taken: true },
  { id: "dl2", supplementId: "s2", date: "2024-06-01", time: "08:30", taken: true },
];

let supplements: Supplement[] = SEED_SUPPLEMENTS.map((s) => ({ ...s }));
let doseLogs: DoseLog[] = SEED_LOGS.map((l) => ({ ...l }));
let nextSuppId = 5;
let nextLogId = 3;

export function getSupplements(): Supplement[] { return supplements; }

export function addSupplement(data: Omit<Supplement, "id">): Supplement {
  const s: Supplement = { ...data, id: `s${nextSuppId++}` };
  supplements = [...supplements, s];
  return s;
}

export function deleteSupplement(id: string): void {
  supplements = supplements.filter((s) => s.id !== id);
}

export function getDoseLogs(): DoseLog[] { return doseLogs; }

export function logDose(supplementId: string, date: string, time: string): DoseLog {
  const log: DoseLog = { id: `dl${nextLogId++}`, supplementId, date, time, taken: true };
  doseLogs = [...doseLogs, log];
  return log;
}

export function getTodayLogs(): DoseLog[] {
  return doseLogs.filter((l) => l.date === "2024-06-01");
}

export function __reset(): void {
  supplements = SEED_SUPPLEMENTS.map((s) => ({ ...s }));
  doseLogs = SEED_LOGS.map((l) => ({ ...l }));
  nextSuppId = 5;
  nextLogId = 3;
}
