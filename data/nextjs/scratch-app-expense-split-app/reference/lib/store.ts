import { Group, Expense } from './types';

let groups: Group[] = [
  { id: 'g1', name: 'Trip to Paris', members: ['Alice', 'Bob', 'Carol'] },
];

let expenses: Expense[] = [
  { id: 'e1', groupId: 'g1', description: 'Hotel', amount: 300, paidBy: 'Alice', date: '2024-03-01' },
  { id: 'e2', groupId: 'g1', description: 'Dinner', amount: 90, paidBy: 'Bob', date: '2024-03-02' },
];

let nextGroupId = 2;
let nextExpenseId = 3;

export function getGroups(): Group[] { return groups; }
export function addGroup(name: string, members: string[]): Group {
  if (!name.trim() || members.length === 0) throw new Error('Name and members required');
  const group: Group = { id: `g${nextGroupId++}`, name: name.trim(), members };
  groups.push(group);
  return group;
}
export function deleteGroup(id: string): void {
  groups = groups.filter(g => g.id !== id);
  expenses = expenses.filter(e => e.groupId !== id);
}

export function getExpenses(groupId?: string): Expense[] {
  return groupId ? expenses.filter(e => e.groupId === groupId) : expenses;
}
export function addExpense(groupId: string, description: string, amount: number, paidBy: string, date: string): Expense {
  if (amount <= 0) throw new Error('Amount must be positive');
  if (!description.trim()) throw new Error('Description required');
  const exp: Expense = { id: `e${nextExpenseId++}`, groupId, description: description.trim(), amount, paidBy, date };
  expenses.push(exp);
  return exp;
}
export function deleteExpense(id: string): void {
  expenses = expenses.filter(e => e.id !== id);
}

export function __reset(): void {
  groups = [{ id: 'g1', name: 'Trip to Paris', members: ['Alice', 'Bob', 'Carol'] }];
  expenses = [
    { id: 'e1', groupId: 'g1', description: 'Hotel', amount: 300, paidBy: 'Alice', date: '2024-03-01' },
    { id: 'e2', groupId: 'g1', description: 'Dinner', amount: 90, paidBy: 'Bob', date: '2024-03-02' },
  ];
  nextGroupId = 2;
  nextExpenseId = 3;
}
