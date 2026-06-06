import { WaterEntry } from "./types";

export function getEntries(): WaterEntry[] { return []; }
export function addEntry(_data: Omit<WaterEntry, "id">): WaterEntry { return { id: "", date: "", cups: 0, note: "", time: "" }; }
export function deleteEntry(_id: string): void {}
export function getTodayTotal(): number { return 0; }
export function getDailyGoal(): number { return 8; }
export function setDailyGoal(_cups: number): void {}
export function __reset(): void {}
