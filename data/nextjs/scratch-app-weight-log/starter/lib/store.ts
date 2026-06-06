import type { WeightEntry, WeightUnit } from "./types";

export function getEntries(): WeightEntry[] { return []; }
export function addEntry(_data: { date: string; weight: number; unit: WeightUnit; note: string }): WeightEntry { throw new Error("Not implemented"); }
export function deleteEntry(_id: string): boolean { return false; }
export function getStats(): { min: number; max: number; avg: number; change: number } { return { min: 0, max: 0, avg: 0, change: 0 }; }
export function __reset(): void {}
