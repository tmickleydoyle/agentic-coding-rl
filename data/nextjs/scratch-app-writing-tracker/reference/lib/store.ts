import { Project, Entry, Goal } from "./types";

const seedProjects: Project[] = [
  { id: "p1", name: "Novel Draft", dailyGoal: 500, color: "blue" },
  { id: "p2", name: "Blog Posts", dailyGoal: 300, color: "green" },
  { id: "p3", name: "Short Stories", dailyGoal: 200, color: "red" },
];

const today = new Date().toISOString().split("T")[0];

const seedEntries: Entry[] = [
  { id: "e1", projectId: "p1", date: today, wordCount: 450, notes: "Good session", createdAt: Date.now() - 3000 },
  { id: "e2", projectId: "p2", date: today, wordCount: 320, notes: "Blog draft", createdAt: Date.now() - 2000 },
  { id: "e3", projectId: "p3", date: today, wordCount: 180, notes: "Short story idea", createdAt: Date.now() - 1000 },
];

const seedGoals: Goal[] = [
  { id: "g1", projectId: "p1", type: "daily", target: 500, startDate: today, completed: false },
  { id: "g2", projectId: "p2", type: "weekly", target: 2000, startDate: today, completed: false },
];

let projects: Project[] = seedProjects.map((p) => ({ ...p }));
let entries: Entry[] = seedEntries.map((e) => ({ ...e }));
let goals: Goal[] = seedGoals.map((g) => ({ ...g }));

export function __reset() {
  projects = seedProjects.map((p) => ({ ...p }));
  entries = seedEntries.map((e) => ({ ...e }));
  goals = seedGoals.map((g) => ({ ...g }));
}

export function getProjects(): Project[] {
  return projects.map((p) => ({ ...p }));
}

export function addProject(data: Omit<Project, "id">): Project {
  const project: Project = { id: `p${Date.now()}`, ...data };
  projects.push(project);
  return { ...project };
}

export function updateProject(id: string, data: Partial<Omit<Project, "id">>): Project | null {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data };
  return { ...projects[idx] };
}

export function deleteProject(id: string): { error?: string } {
  const hasEntries = entries.some((e) => e.projectId === id);
  if (hasEntries) return { error: "Cannot delete project with entries" };
  projects = projects.filter((p) => p.id !== id);
  return {};
}

export function getEntries(): Entry[] {
  return entries.map((e) => ({ ...e }));
}

export function addEntry(data: Omit<Entry, "id" | "createdAt">): Entry | { error: string } {
  if (data.wordCount <= 0) return { error: "Word count must be positive" };
  const entry: Entry = { id: `e${Date.now()}`, createdAt: Date.now(), ...data };
  entries.push(entry);
  return { ...entry };
}

export function deleteEntry(id: string): boolean {
  const before = entries.length;
  entries = entries.filter((e) => e.id !== id);
  return entries.length < before;
}

export function getGoals(): Goal[] {
  return goals.map((g) => ({ ...g }));
}

export function addGoal(data: Omit<Goal, "id">): Goal {
  const goal: Goal = { id: `g${Date.now()}`, ...data };
  goals.push(goal);
  return { ...goal };
}

export function updateGoal(id: string, data: Partial<Omit<Goal, "id">>): Goal | null {
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  goals[idx] = { ...goals[idx], ...data };
  return { ...goals[idx] };
}

export function deleteGoal(id: string): boolean {
  const before = goals.length;
  goals = goals.filter((g) => g.id !== id);
  return goals.length < before;
}
