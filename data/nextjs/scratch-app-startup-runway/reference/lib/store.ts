import { Expense, Settings } from "./types";

const SEED_EXPENSES: Expense[] = [
  { id: "1", name: "Engineering Salaries", category: "Engineering", amount: 45000 },
  { id: "2", name: "Office Rent", category: "Operations", amount: 8000 },
  { id: "3", name: "Google Ads", category: "Marketing", amount: 5000 },
  { id: "4", name: "Sales Tools", category: "Sales", amount: 2000 },
];

const SEED_SETTINGS: Settings = {
  cashBalance: 500000,
  targetRunway: 18,
};

let expenses: Expense[] = SEED_EXPENSES.map((e) => ({ ...e }));
let settings: Settings = { ...SEED_SETTINGS };
let nextId = 5;

export function getExpenses(): Expense[] {
  return expenses.map((e) => ({ ...e }));
}

export function addExpense(data: Omit<Expense, "id">): Expense {
  const expense: Expense = { ...data, id: String(nextId++) };
  expenses.push(expense);
  return { ...expense };
}

export function updateExpense(id: string, data: Partial<Omit<Expense, "id">>): Expense | null {
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  expenses[idx] = { ...expenses[idx], ...data };
  return { ...expenses[idx] };
}

export function deleteExpense(id: string): boolean {
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  expenses.splice(idx, 1);
  return true;
}

export function getSettings(): Settings {
  return { ...settings };
}

export function updateSettings(data: Partial<Settings>): Settings {
  settings = { ...settings, ...data };
  return { ...settings };
}

export function getMonthlyBurn(): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getRunwayMonths(): number {
  const burn = getMonthlyBurn();
  if (burn === 0) return Infinity;
  return Math.floor(settings.cashBalance / burn);
}

export function __reset(): void {
  expenses = SEED_EXPENSES.map((e) => ({ ...e }));
  settings = { ...SEED_SETTINGS };
  nextId = 5;
}
