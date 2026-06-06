import { Expense, Settings } from "./types";

export function getExpenses(): Expense[] {
  return [];
}

export function addExpense(_data: Omit<Expense, "id">): Expense {
  return { id: "", name: "", category: "Engineering", amount: 0 };
}

export function updateExpense(_id: string, _data: Partial<Omit<Expense, "id">>): Expense | null {
  return null;
}

export function deleteExpense(_id: string): boolean {
  return false;
}

export function getSettings(): Settings {
  return { cashBalance: 0, targetRunway: 0 };
}

export function updateSettings(_data: Partial<Settings>): Settings {
  return { cashBalance: 0, targetRunway: 0 };
}

export function getMonthlyBurn(): number {
  return 0;
}

export function getRunwayMonths(): number {
  return 0;
}

export function __reset(): void {}
