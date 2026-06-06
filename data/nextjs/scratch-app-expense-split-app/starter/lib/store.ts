import { Group, Expense } from './types';

export function getGroups(): Group[] { return []; }
export function addGroup(_name: string, _members: string[]): Group { throw new Error('Not implemented'); }
export function deleteGroup(_id: string): void {}
export function getExpenses(_groupId?: string): Expense[] { return []; }
export function addExpense(_groupId: string, _description: string, _amount: number, _paidBy: string, _date: string): Expense { throw new Error('Not implemented'); }
export function deleteExpense(_id: string): void {}
export function __reset(): void {}
