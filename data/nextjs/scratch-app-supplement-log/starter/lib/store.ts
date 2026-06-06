import { Supplement, DoseLog } from "./types";

export function getSupplements(): Supplement[] { return []; }
export function addSupplement(_data: Omit<Supplement, "id">): Supplement { return { id: "", name: "", dosage: "", frequency: "daily", notes: "" }; }
export function deleteSupplement(_id: string): void {}
export function getDoseLogs(): DoseLog[] { return []; }
export function logDose(_supplementId: string, _date: string, _time: string): DoseLog { return { id: "", supplementId: "", date: "", time: "", taken: false }; }
export function getTodayLogs(): DoseLog[] { return []; }
export function __reset(): void {}
