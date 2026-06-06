import type { StepEntry, StepGoal } from "./types";

export function getEntries(): StepEntry[] { return []; }
export function getGoal(): StepGoal { return { dailyTarget: 10000 }; }
export function addEntry(_data: { date: string; steps: number; notes: string }): StepEntry { throw new Error("Not implemented"); }
export function deleteEntry(_id: string): boolean { return false; }
export function updateGoal(_dailyTarget: number): StepGoal { throw new Error("Not implemented"); }
export function getStats(): { totalSteps: number; avgSteps: number; goalMetDays: number; bestDay: StepEntry | null } { return { totalSteps: 0, avgSteps: 0, goalMetDays: 0, bestDay: null }; }
export function __reset(): void {}
