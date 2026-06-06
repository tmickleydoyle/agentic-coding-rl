'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Expense, Category, Route } from '../lib/types';

interface AppState {
  route: Route;
  expenses: Expense[];
  categories: Category[];
  navigate: (r: Route) => void;
  addExpense: (data: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (data: Omit<Category, 'id'>) => Category | null;
}

const AppContext = createContext<AppState>({
  route: 'home',
  expenses: [],
  categories: [],
  navigate: () => {},
  addExpense: () => {},
  deleteExpense: () => {},
  addCategory: () => null,
});

export function useApp() {
  return useContext(AppContext);
}

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

let expenseCounter = 5;
let categoryCounter = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses.map(e => ({ ...e })));
  const [categories, setCategories] = useState<Category[]>(seedCategories.map(c => ({ ...c })));

  function navigate(r: Route) { setRoute(r); }

  function addExpense(data: Omit<Expense, 'id'>) {
    const e: Expense = { id: `e${expenseCounter++}`, ...data };
    setExpenses(prev => [...prev, e]);
  }

  function deleteExpense(id: string) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  function addCategory(data: Omit<Category, 'id'>): Category | null {
    const exists = categories.some(c => c.name.toLowerCase() === data.name.toLowerCase());
    if (exists) return null;
    const c: Category = { id: `c${categoryCounter++}`, ...data };
    setCategories(prev => [...prev, c]);
    return c;
  }

  return (
    <AppContext.Provider value={{ route, expenses, categories, navigate, addExpense, deleteExpense, addCategory }}>
      {children}
    </AppContext.Provider>
  );
}
