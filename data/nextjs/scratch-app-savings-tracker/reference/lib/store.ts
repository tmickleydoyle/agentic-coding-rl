import { Goal, Contribution } from "./types";

let goals: Goal[] = [
  { id: "g1", name: "Emergency Fund", target: 5000, deadline: "2024-12-31" },
  { id: "g2", name: "Vacation", target: 2000, deadline: "2024-06-30" },
];

let contributions: Contribution[] = [
  { id: "c1", goalId: "g1", amount: 500, date: "2024-01-10" },
  { id: "c2", goalId: "g1", amount: 750, date: "2024-02-01" },
  { id: "c3", goalId: "g2", amount: 300, date: "2024-01-15" },
];

export function getGoals(): Goal[] { return goals; }
export function getContributions(): Contribution[] { return contributions; }

export function addGoal(goal: Goal): void { goals.push(goal); }
export function deleteGoal(id: string): void {
  goals = goals.filter((g) => g.id !== id);
  contributions = contributions.filter((c) => c.goalId !== id);
}
export function addContribution(c: Contribution): void { contributions.push(c); }

export function __reset(): void {
  goals = [
    { id: "g1", name: "Emergency Fund", target: 5000, deadline: "2024-12-31" },
    { id: "g2", name: "Vacation", target: 2000, deadline: "2024-06-30" },
  ];
  contributions = [
    { id: "c1", goalId: "g1", amount: 500, date: "2024-01-10" },
    { id: "c2", goalId: "g1", amount: 750, date: "2024-02-01" },
    { id: "c3", goalId: "g2", amount: 300, date: "2024-01-15" },
  ];
}
