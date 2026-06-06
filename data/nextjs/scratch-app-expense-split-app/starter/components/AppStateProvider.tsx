'use client'
import React, { createContext, useContext } from 'react';
import { Group, Expense, Route } from '../lib/types';

interface AppState {
  route: Route;
  groups: Group[];
  expenses: Expense[];
  navigate: (r: Route) => void;
  addGroup: (name: string, members: string[]) => boolean;
  deleteGroup: (id: string) => void;
  addExpense: (groupId: string, description: string, amount: number, paidBy: string, date: string) => boolean;
  deleteExpense: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', groups: [], expenses: [],
  navigate: () => {}, addGroup: () => false, deleteGroup: () => {},
  addExpense: () => false, deleteExpense: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', groups: [], expenses: [],
      navigate: () => {}, addGroup: () => false, deleteGroup: () => {},
      addExpense: () => false, deleteExpense: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
