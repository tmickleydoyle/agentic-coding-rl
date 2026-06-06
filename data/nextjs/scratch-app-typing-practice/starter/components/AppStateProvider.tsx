'use client'
import React, { createContext, useContext } from 'react';
import { Score, Settings, Route } from '../lib/types';

interface AppState {
  route: Route;
  scores: Score[];
  settings: Settings;
  navigate: (r: Route) => void;
  addScore: (name: string, wpm: number, accuracy: number, date: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', scores: [], settings: { name: 'Anonymous', duration: 30 },
  navigate: () => {}, addScore: () => {}, updateSettings: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', scores: [], settings: { name: 'Anonymous', duration: 30 },
      navigate: () => {}, addScore: () => {}, updateSettings: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
