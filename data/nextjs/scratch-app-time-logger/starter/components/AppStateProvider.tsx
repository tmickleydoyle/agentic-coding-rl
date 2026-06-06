'use client';
import React, { createContext, useContext } from 'react';
import type { Project, TimeEntry, Route } from '../lib/types';
interface AppState { route: Route; projects: Project[]; entries: TimeEntry[]; navigate: (r: Route) => void; addEntry: (d: Omit<TimeEntry, 'id'>) => void; deleteEntry: (id: string) => void; addProject: (d: Omit<Project, 'id'>) => Project | null; }
const AppContext = createContext<AppState>({ route: 'home', projects: [], entries: [], navigate: () => {}, addEntry: () => {}, deleteEntry: () => {}, addProject: () => null });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', projects: [], entries: [], navigate: () => {}, addEntry: () => {}, deleteEntry: () => {}, addProject: () => null }}>{children}</AppContext.Provider>;
}
