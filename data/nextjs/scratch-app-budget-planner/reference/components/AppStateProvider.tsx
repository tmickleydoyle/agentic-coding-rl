'use client'
import React, { createContext, useContext, useState } from 'react';
import { Category, Transaction, Route } from '../lib/types';

interface AppState {
  route: Route;
  categories: Category[];
  transactions: Transaction[];
  navigate: (r: Route) => void;
  addCategory: (name: string, type: 'income' | 'expense', budgetLimit: number) => boolean;
  deleteCategory: (id: string) => void;
  addTransaction: (description: string, amount: number, category: string, date: string) => boolean;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', categories: [], transactions: [],
  navigate: () => {}, addCategory: () => false, deleteCategory: () => {},
  addTransaction: () => false, deleteTransaction: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', name: 'Salary', type: 'income', budgetLimit: 5000 },
    { id: 'cat2', name: 'Food', type: 'expense', budgetLimit: 500 },
    { id: 'cat3', name: 'Transport', type: 'expense', budgetLimit: 200 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', description: 'Monthly salary', amount: 3000, category: 'cat1', date: '2024-01-01' },
    { id: 't2', description: 'Groceries', amount: -150, category: 'cat2', date: '2024-01-05' },
    { id: 't3', description: 'Bus pass', amount: -50, category: 'cat3', date: '2024-01-07' },
  ]);
  const [nextCatId, setNextCatId] = useState(4);
  const [nextTxId, setNextTxId] = useState(4);

  const navigate = (r: Route) => setRoute(r);

  const addCategory = (name: string, type: 'income' | 'expense', budgetLimit: number): boolean => {
    if (!name.trim()) return false;
    setCategories(prev => [...prev, { id: `cat${nextCatId}`, name: name.trim(), type, budgetLimit }]);
    setNextCatId(n => n + 1);
    return true;
  };

  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const addTransaction = (description: string, amount: number, category: string, date: string): boolean => {
    if (amount === 0 || !description.trim()) return false;
    setTransactions(prev => [...prev, { id: `t${nextTxId}`, description: description.trim(), amount, category, date }]);
    setNextTxId(n => n + 1);
    return true;
  };

  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{ route, categories, transactions, navigate, addCategory, deleteCategory, addTransaction, deleteTransaction }}>
      {children}
    </AppContext.Provider>
  );
}
