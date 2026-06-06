import type { Expense, BudgetConfig } from "./types";

export const budget: BudgetConfig = { totalBudget: 3000, tripName: "Japan Adventure", currency: "USD" };

export function getExpenses(): Expense[] {
  return [];
}

export function addExpense(_data: Omit<Expense, "id">): Expense {
  return { id: "", date: "", description: "", category: "Food", amount: 0, currency: "USD", originalAmount: 0 };
}

export function __reset(): void {}
