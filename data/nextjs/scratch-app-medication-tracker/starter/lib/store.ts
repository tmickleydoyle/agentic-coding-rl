import type { Medication, DoseLog, Frequency } from "./types";

export function getMedications(): Medication[] { return []; }
export function getDoseLogs(): DoseLog[] { return []; }
export function addMedication(_data: { name: string; dosage: string; frequency: Frequency; instructions: string }): Medication { throw new Error("Not implemented"); }
export function toggleMedication(_id: string): Medication | null { return null; }
export function deleteMedication(_id: string): boolean { return false; }
export function logDose(_data: { medicationId: string; note: string }): DoseLog | null { return null; }
export function __reset(): void {}
