import type { Goal, Difficulty } from "./types";

let goals: Goal[] = [
  { id: "1", title: "Climb Kilimanjaro", description: "Summit Africa's highest peak", category: "Adventure", targetDate: "2025-12-01", difficulty: "extreme", completed: false, completedAt: null, addedAt: "2024-01-01" },
  { id: "2", title: "Learn Spanish", description: "Reach B2 level", category: "Education", targetDate: "2024-12-31", difficulty: "medium", completed: true, completedAt: "2024-06-15", addedAt: "2024-01-05" },
];
let nextId = 3;

export function getGoals(): Goal[] { return goals; }
export function addGoal(data: Omit<Goal, "id" | "addedAt" | "completed" | "completedAt">): Goal {
  const goal: Goal = { id: String(nextId++), ...data, completed: false, completedAt: null, addedAt: new Date().toISOString().slice(0, 10) };
  goals.push(goal);
  return goal;
}
export function updateGoal(id: string, patch: Partial<Pick<Goal, "completed">>): Goal | null {
  const goal = goals.find((g) => g.id === id);
  if (!goal) return null;
  if (patch.completed !== undefined) {
    goal.completed = patch.completed;
    goal.completedAt = patch.completed ? new Date().toISOString().slice(0, 10) : null;
  }
  return goal;
}
export function removeGoal(id: string): boolean {
  const before = goals.length;
  goals = goals.filter((g) => g.id !== id);
  return goals.length < before;
}
export function __reset(): void {
  goals = [
    { id: "1", title: "Climb Kilimanjaro", description: "Summit Africa's highest peak", category: "Adventure", targetDate: "2025-12-01", difficulty: "extreme", completed: false, completedAt: null, addedAt: "2024-01-01" },
    { id: "2", title: "Learn Spanish", description: "Reach B2 level", category: "Education", targetDate: "2024-12-31", difficulty: "medium", completed: true, completedAt: "2024-06-15", addedAt: "2024-01-05" },
  ];
  nextId = 3;
}
