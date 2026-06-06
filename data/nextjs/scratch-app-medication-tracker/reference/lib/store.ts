import type { Medication, DoseLog, Frequency } from "./types";

let medications: Medication[] = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "daily", instructions: "Take in the morning", active: true, createdAt: 1704067200000 },
  { id: "2", name: "Metformin", dosage: "500mg", frequency: "twice-daily", instructions: "Take with meals", active: true, createdAt: 1704153600000 },
];
let doseLogs: DoseLog[] = [
  { id: "1", medicationId: "1", medicationName: "Lisinopril", takenAt: 1704844800000, note: "Morning dose" },
  { id: "2", medicationId: "2", medicationName: "Metformin", takenAt: 1704870000000, note: "With breakfast" },
];
let nextMedId = 3;
let nextLogId = 3;

export function getMedications(): Medication[] { return [...medications]; }
export function getDoseLogs(): DoseLog[] { return [...doseLogs]; }

export function addMedication(data: { name: string; dosage: string; frequency: Frequency; instructions: string }): Medication {
  const med: Medication = { id: String(nextMedId++), ...data, active: true, createdAt: Date.now() };
  medications.push(med);
  return med;
}

export function toggleMedication(id: string): Medication | null {
  const med = medications.find((m) => m.id === id);
  if (!med) return null;
  med.active = !med.active;
  return med;
}

export function deleteMedication(id: string): boolean {
  const idx = medications.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  medications.splice(idx, 1);
  return true;
}

export function logDose(data: { medicationId: string; note: string }): DoseLog | null {
  const med = medications.find((m) => m.id === data.medicationId);
  if (!med) return null;
  const log: DoseLog = { id: String(nextLogId++), medicationId: data.medicationId, medicationName: med.name, takenAt: Date.now(), note: data.note };
  doseLogs.push(log);
  return log;
}

export function __reset(): void {
  medications = [
    { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "daily", instructions: "Take in the morning", active: true, createdAt: 1704067200000 },
    { id: "2", name: "Metformin", dosage: "500mg", frequency: "twice-daily", instructions: "Take with meals", active: true, createdAt: 1704153600000 },
  ];
  doseLogs = [
    { id: "1", medicationId: "1", medicationName: "Lisinopril", takenAt: 1704844800000, note: "Morning dose" },
    { id: "2", medicationId: "2", medicationName: "Metformin", takenAt: 1704870000000, note: "With breakfast" },
  ];
  nextMedId = 3;
  nextLogId = 3;
}
