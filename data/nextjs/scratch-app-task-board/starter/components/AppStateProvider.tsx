'use client';
import React, { createContext, useContext } from 'react';
import type { Task, Label, Route } from '../lib/types';
interface AppState { route: Route; tasks: Task[]; labels: Label[]; navigate: (r: Route) => void; addTask: (d: Omit<Task, 'id'>) => void; moveForward: (id: string) => void; reopenTask: (id: string) => void; addLabel: (d: Omit<Label, 'id'>) => Label | null; }
const AppContext = createContext<AppState>({ route: 'home', tasks: [], labels: [], navigate: () => {}, addTask: () => {}, moveForward: () => {}, reopenTask: () => {}, addLabel: () => null });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', tasks: [], labels: [], navigate: () => {}, addTask: () => {}, moveForward: () => {}, reopenTask: () => {}, addLabel: () => null }}>{children}</AppContext.Provider>;
}
