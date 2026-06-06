import { Expense, Income } from "./types";

export function getExpenses(): Expense[] { return []; }
export function getIncomes(): Income[] { return []; }
export function addExpense(_expense: Expense): void {}
export function deleteExpense(_id: string): void {}
export function addIncome(_income: Income): void {}
export function deleteIncome(_id: string): void {}
export function __reset(): void {}
