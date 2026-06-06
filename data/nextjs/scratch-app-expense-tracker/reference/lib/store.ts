import type { Expense, Category } from './types';

const seedCategories: Category[] = [
  { id: 'c1', name: 'Food', color: '#f59e0b' },
  { id: 'c2', name: 'Transport', color: '#3b82f6' },
  { id: 'c3', name: 'Entertainment', color: '#8b5cf6' },
];

const seedExpenses: Expense[] = [
  { id: 'e1', description: 'Groceries', amount: 45.50, category: 'Food', date: '2026-06-01' },
  { id: 'e2', description: 'Bus pass', amount: 30.00, category: 'Transport', date: '2026-06-02' },
  { id: 'e3', description: 'Movie', amount: 12.00, category: 'Entertainment', date: '2026-06-03' },
  { id: 'e4', description: 'Lunch', amount: 15.75, category: 'Food', date: '2026-06-04' },
];

let expenses: Expense[] = seedExpenses.map(e => ({ ...e }));
let categories: Category[] = seedCategories.map(c => ({ ...c }));
let nextExpenseId = 5;
let nextCategoryId = 4;

export function __reset() {
  expenses = seedExpenses.map(e => ({ ...e }));
  categories = seedCategories.map(c => ({ ...c }));
  nextExpenseId = 5;
  nextCategoryId = 4;
}

export function getExpenses(): Expense[] {
  return expenses.slice();
}

export function getCategories(): Category[] {
  return categories.slice();
}

export function addExpense(data: Omit<Expense, 'id'>): Expense {
  const expense: Expense = { id: `e${nextExpenseId++}`, ...data };
  expenses.push(expense);
  return expense;
}

export function deleteExpense(id: string): boolean {
  const idx = expenses.findIndex(e => e.id === id);
  if (idx === -1) return false;
  expenses.splice(idx, 1);
  return true;
}

export function addCategory(data: Omit<Category, 'id'>): Category | null {
  const exists = categories.some(c => c.name.toLowerCase() === data.name.toLowerCase());
  if (exists) return null;
  const category: Category = { id: `c${nextCategoryId++}`, ...data };
  categories.push(category);
  return category;
}
