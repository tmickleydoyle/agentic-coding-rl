import type { MoodLog, MoodLevel } from "./types";

export function getLogs(): MoodLog[] { return []; }
export function addLog(_data: { date: string; level: MoodLevel; note: string; activities: string[] }): MoodLog { throw new Error("Not implemented"); }
export function deleteLog(_id: string): boolean { return false; }
export function getAverageMood(): number { return 0; }
export function getMoodDistribution(): Record<MoodLevel, number> { return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; }
export function __reset(): void {}
