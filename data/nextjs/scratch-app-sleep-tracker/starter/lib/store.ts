import type { SleepEntry, SleepQuality } from "./types";

export function getEntries(): SleepEntry[] { return []; }
export function addEntry(_data: { date: string; bedtime: string; wakeTime: string; quality: SleepQuality; notes: string }): SleepEntry { throw new Error("Not implemented"); }
export function deleteEntry(_id: string): boolean { return false; }
export function getInsights(): { avgDuration: number; avgQuality: number; bestNight: SleepEntry | null; worstNight: SleepEntry | null } { return { avgDuration: 0, avgQuality: 0, bestNight: null, worstNight: null }; }
export function __reset(): void {}
