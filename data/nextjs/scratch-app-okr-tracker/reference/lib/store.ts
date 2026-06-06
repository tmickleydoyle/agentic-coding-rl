import { Objective, OkrStatus, KeyResult } from "./types";

let objectives: Objective[] = [];
let nextId = 1;
let nextKrId = 100;

export function getObjectives(): Objective[] { return objectives; }

export function getObjectiveById(id: string): Objective | undefined {
  return objectives.find((o) => o.id === id);
}

export function addObjective(data: Omit<Objective, "id" | "createdAt">): Objective {
  const o: Objective = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  objectives.push(o);
  return o;
}

export function updateObjective(id: string, data: Partial<Omit<Objective, "id" | "createdAt">>): Objective | undefined {
  const idx = objectives.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  objectives[idx] = { ...objectives[idx], ...data };
  return objectives[idx];
}

export function deleteObjective(id: string): boolean {
  const idx = objectives.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  objectives.splice(idx, 1);
  return true;
}

export function addKeyResult(objectiveId: string, kr: Omit<KeyResult, "id">): Objective | undefined {
  const idx = objectives.findIndex((o) => o.id === objectiveId);
  if (idx === -1) return undefined;
  const newKr: KeyResult = { ...kr, id: String(nextKrId++) };
  objectives[idx].keyResults.push(newKr);
  return objectives[idx];
}

export function updateKeyResult(objectiveId: string, krId: string, data: Partial<Omit<KeyResult, "id">>): Objective | undefined {
  const idx = objectives.findIndex((o) => o.id === objectiveId);
  if (idx === -1) return undefined;
  const krIdx = objectives[idx].keyResults.findIndex((k) => k.id === krId);
  if (krIdx === -1) return undefined;
  objectives[idx].keyResults[krIdx] = { ...objectives[idx].keyResults[krIdx], ...data };
  return objectives[idx];
}

export function getByStatus(status: OkrStatus): Objective[] {
  return objectives.filter((o) => o.status === status);
}

export function getProgressSummary(): { total: number; avgProgress: number; byStatus: Record<OkrStatus, number> } {
  const byStatus: Record<OkrStatus, number> = { on_track: 0, at_risk: 0, behind: 0, completed: 0 };
  let totalProgress = 0;
  let krCount = 0;
  objectives.forEach((o) => {
    byStatus[o.status]++;
    o.keyResults.forEach((kr) => {
      totalProgress += kr.target > 0 ? Math.min(100, (kr.current / kr.target) * 100) : 0;
      krCount++;
    });
  });
  return { total: objectives.length, avgProgress: krCount > 0 ? Math.round(totalProgress / krCount) : 0, byStatus };
}

export function __reset(): void {
  objectives = [];
  nextId = 1;
  nextKrId = 100;
}
