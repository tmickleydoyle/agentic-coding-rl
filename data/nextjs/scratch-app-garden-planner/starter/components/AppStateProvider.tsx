'use client';
import React, { createContext, useContext } from 'react';
import type { Plant, Bed, LogEntry, Route } from '../lib/types';
interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  plants: Plant[]; setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  beds: Bed[]; setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
  log: LogEntry[]; setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, plants: [], setPlants: () => {}, beds: [], setBeds: () => {}, log: [], setLog: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {}, plants: [], setPlants: () => {}, beds: [], setBeds: () => {}, log: [], setLog: () => {} }}>{children}</AppContext.Provider>;
}
