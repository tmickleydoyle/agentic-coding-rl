import { Transaction, Category } from "./types";

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "1", description: "Customer Revenue", amount: 30000, type: "Income", category: "Revenue", date: "2024-01" },
  { id: "2", description: "Payroll", amount: 55000, type: "Expense", category: "Payroll", date: "2024-01" },
  { id: "3", description: "AWS", amount: 4000, type: "Expense", category: "Infrastructure", date: "2024-01" },
  { id: "4", description: "Google Ads", amount: 8000, type: "Expense", category: "Marketing", date: "2024-01" },
  { id: "5", description: "Office", amount: 3000, type: "Expense", category: "G&A", date: "2024-01" },
];

const SEED_CATEGORIES: Category[] = [
  { id: "1", name: "Payroll" },
  { id: "2", name: "Infrastructure" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "G&A" },
  { id: "5", name: "Revenue" },
];

let transactions: Transaction[] = SEED_TRANSACTIONS.map((t) => ({ ...t }));
let categories: Category[] = SEED_CATEGORIES.map((c) => ({ ...c }));
let startingCash = 400000;
let nextTxId = 6;
let nextCatId = 6;

export function getTransactions(): Transaction[] {
  return transactions.map((t) => ({ ...t }));
}

export function addTransaction(data: Omit<Transaction, "id">): Transaction {
  const t: Transaction = { ...data, id: String(nextTxId++) };
  transactions.push(t);
  return { ...t };
}

export function deleteTransaction(id: string): boolean {
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  transactions.splice(idx, 1);
  return true;
}

export function getCategories(): Category[] {
  return categories.map((c) => ({ ...c }));
}

export function addCategory(name: string): Category {
  const c: Category = { id: String(nextCatId++), name };
  categories.push(c);
  return { ...c };
}

export function deleteCategory(id: string): { success: boolean; error?: string } {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return { success: false, error: "Not found" };
  const inUse = transactions.some((t) => t.category === cat.name);
  if (inUse) return { success: false, error: "Category in use" };
  categories = categories.filter((c) => c.id !== id);
  return { success: true };
}

export function getStartingCash(): number {
  return startingCash;
}

export function __reset(): void {
  transactions = SEED_TRANSACTIONS.map((t) => ({ ...t }));
  categories = SEED_CATEGORIES.map((c) => ({ ...c }));
  startingCash = 400000;
  nextTxId = 6;
  nextCatId = 6;
}
