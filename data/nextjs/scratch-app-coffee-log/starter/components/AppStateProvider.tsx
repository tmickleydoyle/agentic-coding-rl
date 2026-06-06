'use client';
import React, { createContext, useContext } from 'react';
import type { Bean, Brew, Route } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; beans: Bean[]; setBeans: React.Dispatch<React.SetStateAction<Bean[]>>; brews: Brew[]; setBrews: React.Dispatch<React.SetStateAction<Brew[]>>; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, beans: [], setBeans: () => {}, brews: [], setBrews: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {}, beans: [], setBeans: () => {}, brews: [], setBrews: () => {} }}>{children}</AppContext.Provider>;
}
