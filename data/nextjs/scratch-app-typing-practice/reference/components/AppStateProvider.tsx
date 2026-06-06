'use client'
import React, { createContext, useContext, useState } from 'react';
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
  route: 'home',
  scores: [],
  settings: { name: 'Anonymous', duration: 30 },
  navigate: () => {},
  addScore: () => {},
  updateSettings: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [scores, setScores] = useState<Score[]>([
    { id: 'sc1', name: 'Alice', wpm: 72, accuracy: 98, date: '2024-01-10' },
    { id: 'sc2', name: 'Bob', wpm: 55, accuracy: 94, date: '2024-01-11' },
  ]);
  const [settings, setSettings] = useState<Settings>({ name: 'Anonymous', duration: 30 });
  const [nextId, setNextId] = useState(3);

  const navigate = (r: Route) => setRoute(r);

  const addScore = (name: string, wpm: number, accuracy: number, date: string) => {
    setScores(prev => [...prev, { id: `sc${nextId}`, name, wpm, accuracy, date }]);
    setNextId(n => n + 1);
  };

  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));

  return (
    <AppContext.Provider value={{ route, scores, settings, navigate, addScore, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}
