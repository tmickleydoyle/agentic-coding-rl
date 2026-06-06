'use client'
import React, { createContext, useContext } from 'react';
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
  return (
    <AppContext.Provider value={{
      route: 'home', categories: [], transactions: [],
      navigate: () => {}, addCategory: () => false, deleteCategory: () => {},
      addTransaction: () => false, deleteTransaction: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
