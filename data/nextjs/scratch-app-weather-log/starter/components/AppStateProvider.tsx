'use client'
import React, { createContext, useContext } from 'react';
import { WeatherEntry, Settings, Route } from '../lib/types';

interface AppState {
  route: Route; entries: WeatherEntry[]; settings: Settings;
  navigate: (r: Route) => void;
  addEntry: (date: string, temperature: number, condition: WeatherEntry['condition'], humidity: number, notes: string) => boolean;
  deleteEntry: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', entries: [], settings: { unit: 'celsius' },
  navigate: () => {}, addEntry: () => false, deleteEntry: () => {}, updateSettings: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', entries: [], settings: { unit: 'celsius' },
      navigate: () => {}, addEntry: () => false, deleteEntry: () => {}, updateSettings: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
