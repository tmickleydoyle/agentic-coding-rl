import type { Expense, Category } from './types';

export function __reset() {}

export function getExpenses(): Expense[] { return []; }
export function getCategories(): Category[] { return []; }
export function addExpense(_data: Omit<Expense, 'id'>): Expense { return { id: '', description: '', amount: 0, category: '', date: '' }; }
export function deleteExpense(_id: string): boolean { return false; }
export function addCategory(_data: Omit<Category, 'id'>): Category | null { return null; }
