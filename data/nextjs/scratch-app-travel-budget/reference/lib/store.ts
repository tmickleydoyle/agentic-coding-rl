import type { Expense, BudgetConfig } from "./types";

export const budget: BudgetConfig = { totalBudget: 3000, tripName: "Japan Adventure", currency: "USD" };

const seed: Expense[] = [
  { id: "1", date: "2024-03-15", description: "Hotel check-in", category: "Accommodation", amount: 120, currency: "JPY", originalAmount: 17640 },
  { id: "2", date: "2024-03-15", description: "Ramen lunch", category: "Food", amount: 12, currency: "JPY", originalAmount: 1764 },
  { id: "3", date: "2024-03-16", description: "Shinkansen", category: "Transport", amount: 80, currency: "JPY", originalAmount: 11760 },
  { id: "4", date: "2024-03-16", description: "Temple entry", category: "Activities", amount: 5, currency: "JPY", originalAmount: 735 },
  { id: "5", date: "2024-03-17", description: "Souvenir shopping", category: "Shopping", amount: 60, currency: "JPY", originalAmount: 8820 },
];

let expenses: Expense[] = seed.map((e) => ({ ...e }));
let nextId = 6;

export function getExpenses(): Expense[] {
  return expenses;
}

export function addExpense(data: Omit<Expense, "id">): Expense {
  const expense: Expense = { ...data, id: String(nextId++) };
  expenses.push(expense);
  return expense;
}

export function __reset(): void {
  expenses = seed.map((e) => ({ ...e }));
  nextId = 6;
}
