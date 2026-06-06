'use client';
import React, { createContext, useContext } from 'react';
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

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // TODO: implement state management
  return <AppContext.Provider value={{ route: 'home', expenses: [], categories: [], navigate: () => {}, addExpense: () => {}, deleteExpense: () => {}, addCategory: () => null }}>{children}</AppContext.Provider>;
}
