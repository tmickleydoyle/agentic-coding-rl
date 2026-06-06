'use client'
import React, { createContext, useContext, useState } from 'react';
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
  const [route, setRoute] = useState<Route>('home');
  const [groups, setGroups] = useState<Group[]>([
    { id: 'g1', name: 'Trip to Paris', members: ['Alice', 'Bob', 'Carol'] },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'e1', groupId: 'g1', description: 'Hotel', amount: 300, paidBy: 'Alice', date: '2024-03-01' },
    { id: 'e2', groupId: 'g1', description: 'Dinner', amount: 90, paidBy: 'Bob', date: '2024-03-02' },
  ]);
  const [nextGid, setNextGid] = useState(2);
  const [nextEid, setNextEid] = useState(3);

  const navigate = (r: Route) => setRoute(r);

  const addGroup = (name: string, members: string[]): boolean => {
    if (!name.trim() || members.length === 0) return false;
    setGroups(prev => [...prev, { id: `g${nextGid}`, name: name.trim(), members }]);
    setNextGid(n => n + 1);
    return true;
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setExpenses(prev => prev.filter(e => e.groupId !== id));
  };

  const addExpense = (groupId: string, description: string, amount: number, paidBy: string, date: string): boolean => {
    if (amount <= 0 || !description.trim()) return false;
    setExpenses(prev => [...prev, { id: `e${nextEid}`, groupId, description: description.trim(), amount, paidBy, date }]);
    setNextEid(n => n + 1);
    return true;
  };

  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <AppContext.Provider value={{ route, groups, expenses, navigate, addGroup, deleteGroup, addExpense, deleteExpense }}>
      {children}
    </AppContext.Provider>
  );
}
