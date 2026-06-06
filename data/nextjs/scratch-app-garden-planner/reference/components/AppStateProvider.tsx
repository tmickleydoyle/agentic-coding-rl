'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Plant, Bed, LogEntry, Route } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  beds: Bed[];
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
  log: LogEntry[];
  setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  plants: [], setPlants: () => {},
  beds: [], setBeds: () => {},
  log: [], setLog: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [plants, setPlants] = useState<Plant[]>([
    { id: 'pl1', name: 'Tomato', type: 'vegetable', sunlight: 'full', wateringFrequency: 'daily' },
    { id: 'pl2', name: 'Basil', type: 'herb', sunlight: 'full', wateringFrequency: 'weekly' },
    { id: 'pl3', name: 'Lavender', type: 'flower', sunlight: 'full', wateringFrequency: 'biweekly' },
  ]);
  const [beds, setBeds] = useState<Bed[]>([
    { id: 'b1', name: 'Raised Bed A', sizesqft: 16, plantIds: ['pl1', 'pl2'] },
    { id: 'b2', name: 'Border B', sizesqft: 8, plantIds: [] },
  ]);
  const [log, setLog] = useState<LogEntry[]>([
    { id: 'lg1', bedId: 'b1', action: 'Watered', date: '2025-10-05', notes: 'Soaked thoroughly' },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, plants, setPlants, beds, setBeds, log, setLog }}>
      {children}
    </AppContext.Provider>
  );
}
