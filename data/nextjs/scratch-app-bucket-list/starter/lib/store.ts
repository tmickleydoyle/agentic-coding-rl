import type { Goal } from "./types";
export function getGoals(): Goal[] { return []; }
export function addGoal(_data: Omit<Goal, "id" | "addedAt" | "completed" | "completedAt">): Goal { throw new Error("Not implemented"); }
export function updateGoal(_id: string, _patch: Partial<Pick<Goal, "completed">>): Goal | null { return null; }
export function removeGoal(_id: string): boolean { return false; }
export function __reset(): void {}
