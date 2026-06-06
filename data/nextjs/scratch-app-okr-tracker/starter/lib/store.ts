import { Objective, OkrStatus, KeyResult } from "./types";

export function getObjectives(): Objective[] { return []; }
export function getObjectiveById(_id: string): Objective | undefined { return undefined; }
export function addObjective(_data: Omit<Objective, "id" | "createdAt">): Objective {
  return { id: "", title: "", description: "", quarter: "", status: "on_track", keyResults: [], createdAt: "" };
}
export function updateObjective(_id: string, _data: Partial<Omit<Objective, "id" | "createdAt">>): Objective | undefined { return undefined; }
export function deleteObjective(_id: string): boolean { return false; }
export function addKeyResult(_objectiveId: string, _kr: Omit<KeyResult, "id">): Objective | undefined { return undefined; }
export function updateKeyResult(_objectiveId: string, _krId: string, _data: Partial<Omit<KeyResult, "id">>): Objective | undefined { return undefined; }
export function getByStatus(_status: OkrStatus): Objective[] { return []; }
export function getProgressSummary(): { total: number; avgProgress: number; byStatus: Record<OkrStatus, number> } {
  return { total: 0, avgProgress: 0, byStatus: { on_track: 0, at_risk: 0, behind: 0, completed: 0 } };
}
export function __reset(): void {}
