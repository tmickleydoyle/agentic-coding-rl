import { Category, Transaction } from './types';

let categories: Category[] = [
  { id: 'cat1', name: 'Salary', type: 'income', budgetLimit: 5000 },
  { id: 'cat2', name: 'Food', type: 'expense', budgetLimit: 500 },
  { id: 'cat3', name: 'Transport', type: 'expense', budgetLimit: 200 },
];

let transactions: Transaction[] = [
  { id: 't1', description: 'Monthly salary', amount: 3000, category: 'cat1', date: '2024-01-01' },
  { id: 't2', description: 'Groceries', amount: -150, category: 'cat2', date: '2024-01-05' },
  { id: 't3', description: 'Bus pass', amount: -50, category: 'cat3', date: '2024-01-07' },
];

let nextCatId = 4;
let nextTxId = 4;

export function getCategories(): Category[] { return categories; }
export function addCategory(name: string, type: 'income' | 'expense', budgetLimit: number): Category {
  if (!name.trim()) throw new Error('Name required');
  const cat: Category = { id: `cat${nextCatId++}`, name: name.trim(), type, budgetLimit };
  categories.push(cat);
  return cat;
}
export function deleteCategory(id: string): void {
  categories = categories.filter(c => c.id !== id);
}

export function getTransactions(): Transaction[] { return transactions; }
export function addTransaction(description: string, amount: number, category: string, date: string): Transaction {
  if (amount === 0) throw new Error('Amount cannot be zero');
  if (!description.trim()) throw new Error('Description required');
  const tx: Transaction = { id: `t${nextTxId++}`, description: description.trim(), amount, category, date };
  transactions.push(tx);
  return tx;
}
export function deleteTransaction(id: string): void {
  transactions = transactions.filter(t => t.id !== id);
}

export function __reset(): void {
  categories = [
    { id: 'cat1', name: 'Salary', type: 'income', budgetLimit: 5000 },
    { id: 'cat2', name: 'Food', type: 'expense', budgetLimit: 500 },
    { id: 'cat3', name: 'Transport', type: 'expense', budgetLimit: 200 },
  ];
  transactions = [
    { id: 't1', description: 'Monthly salary', amount: 3000, category: 'cat1', date: '2024-01-01' },
    { id: 't2', description: 'Groceries', amount: -150, category: 'cat2', date: '2024-01-05' },
    { id: 't3', description: 'Bus pass', amount: -50, category: 'cat3', date: '2024-01-07' },
  ];
  nextCatId = 4;
  nextTxId = 4;
}
