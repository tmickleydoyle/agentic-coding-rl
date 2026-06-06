import { FinancialGoal } from "./types";

let goals: FinancialGoal[] = [
  { id: "fg1", title: "Buy a Car", targetAmount: 20000, savedAmount: 8000, category: "purchase", status: "active" },
  { id: "fg2", title: "Emergency Fund", targetAmount: 10000, savedAmount: 10000, category: "savings", status: "completed" },
  { id: "fg3", title: "Down Payment", targetAmount: 50000, savedAmount: 15000, category: "purchase", status: "active" },
  { id: "fg4", title: "Vacation", targetAmount: 3000, savedAmount: 2700, category: "lifestyle", status: "active" },
];

export function getGoals(): FinancialGoal[] { return goals; }
export function addGoal(g: FinancialGoal): void { goals.push(g); }
export function deleteGoal(id: string): void { goals = goals.filter((g) => g.id !== id); }
export function updateSaved(id: string, amount: number): void {
  goals = goals.map((g) => g.id === id ? { ...g, savedAmount: amount, status: amount >= g.targetAmount ? "completed" : g.status } : g);
}

export function __reset(): void {
  goals = [
    { id: "fg1", title: "Buy a Car", targetAmount: 20000, savedAmount: 8000, category: "purchase", status: "active" },
    { id: "fg2", title: "Emergency Fund", targetAmount: 10000, savedAmount: 10000, category: "savings", status: "completed" },
    { id: "fg3", title: "Down Payment", targetAmount: 50000, savedAmount: 15000, category: "purchase", status: "active" },
    { id: "fg4", title: "Vacation", targetAmount: 3000, savedAmount: 2700, category: "lifestyle", status: "active" },
  ];
}
