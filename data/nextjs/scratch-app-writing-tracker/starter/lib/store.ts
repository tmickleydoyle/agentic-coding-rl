import { Project, Entry, Goal } from "./types";

export function __reset() {}

export function getProjects(): Project[] { return []; }
export function addProject(_data: Omit<Project, "id">): Project {
  return { id: "", name: "", dailyGoal: 0, color: "" };
}
export function updateProject(_id: string, _data: Partial<Omit<Project, "id">>): Project | null { return null; }
export function deleteProject(_id: string): { error?: string } { return {}; }

export function getEntries(): Entry[] { return []; }
export function addEntry(_data: Omit<Entry, "id" | "createdAt">): Entry | { error: string } {
  return { error: "not implemented" };
}
export function deleteEntry(_id: string): boolean { return false; }

export function getGoals(): Goal[] { return []; }
export function addGoal(_data: Omit<Goal, "id">): Goal {
  return { id: "", projectId: "", type: "daily", target: 0, startDate: "", completed: false };
}
export function updateGoal(_id: string, _data: Partial<Omit<Goal, "id">>): Goal | null { return null; }
export function deleteGoal(_id: string): boolean { return false; }
