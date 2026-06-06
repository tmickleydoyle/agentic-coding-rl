import { Transaction, Category } from "./types";

export function getTransactions(): Transaction[] { return []; }
export function addTransaction(_data: Omit<Transaction, "id">): Transaction {
  return { id: "", description: "", amount: 0, type: "Expense", category: "", date: "" };
}
export function deleteTransaction(_id: string): boolean { return false; }
export function getCategories(): Category[] { return []; }
export function addCategory(_name: string): Category { return { id: "", name: "" }; }
export function deleteCategory(_id: string): { success: boolean; error?: string } { return { success: false }; }
export function getStartingCash(): number { return 0; }
export function __reset(): void {}
