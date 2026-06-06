import { Category, Transaction } from './types';

export function getCategories(): Category[] { return []; }
export function addCategory(_name: string, _type: 'income' | 'expense', _budgetLimit: number): Category { throw new Error('Not implemented'); }
export function deleteCategory(_id: string): void {}
export function getTransactions(): Transaction[] { return []; }
export function addTransaction(_desc: string, _amount: number, _category: string, _date: string): Transaction { throw new Error('Not implemented'); }
export function deleteTransaction(_id: string): void {}
export function __reset(): void {}
