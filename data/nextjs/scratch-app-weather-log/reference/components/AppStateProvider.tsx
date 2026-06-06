'use client'
import React, { createContext, useContext, useState } from 'react';
import { WeatherEntry, Settings, Route } from '../lib/types';

interface AppState {
  route: Route;
  entries: WeatherEntry[];
  settings: Settings;
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
  const [route, setRoute] = useState<Route>('home');
  const [entries, setEntries] = useState<WeatherEntry[]>([
    { id: 'w1', date: '2024-01-01', temperature: 22, condition: 'sunny', humidity: 45, notes: 'Clear morning' },
    { id: 'w2', date: '2024-01-02', temperature: 15, condition: 'cloudy', humidity: 70, notes: 'Overcast' },
    { id: 'w3', date: '2024-01-03', temperature: 8, condition: 'rainy', humidity: 90, notes: 'Heavy rain' },
  ]);
  const [settings, setSettings] = useState<Settings>({ unit: 'celsius' });
  const [nextId, setNextId] = useState(4);

  const navigate = (r: Route) => setRoute(r);

  const addEntry = (date: string, temperature: number, condition: WeatherEntry['condition'], humidity: number, notes: string): boolean => {
    if (!date) return false;
    if (humidity < 0 || humidity > 100) return false;
    if (entries.find(e => e.date === date)) return false;
    setEntries(prev => [...prev, { id: `w${nextId}`, date, temperature, condition, humidity, notes }]);
    setNextId(n => n + 1);
    return true;
  };

  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));

  return (
    <AppContext.Provider value={{ route, entries, settings, navigate, addEntry, deleteEntry, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}
