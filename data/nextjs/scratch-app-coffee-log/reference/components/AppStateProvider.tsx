'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Bean, Brew, Route } from '../lib/types';

interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  beans: Bean[]; setBeans: React.Dispatch<React.SetStateAction<Bean[]>>;
  brews: Brew[]; setBrews: React.Dispatch<React.SetStateAction<Brew[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  beans: [], setBeans: () => {},
  brews: [], setBrews: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [beans, setBeans] = useState<Bean[]>([
    { id: 'b1', name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roast: 'light', price: 3.5 },
    { id: 'b2', name: 'Colombian Supremo', origin: 'Colombia', roast: 'medium', price: 2.8 },
  ]);
  const [brews, setBrews] = useState<Brew[]>([
    { id: 'br1', beanId: 'b1', method: 'pour-over', date: '2025-10-01', rating: 5, notes: 'Floral and bright' },
    { id: 'br2', beanId: 'b2', method: 'espresso', date: '2025-10-03', rating: 4, notes: 'Rich and bold' },
    { id: 'br3', beanId: 'b1', method: 'pour-over', date: '2025-10-05', rating: 4, notes: 'Slightly under-extracted' },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, beans, setBeans, brews, setBrews }}>
      {children}
    </AppContext.Provider>
  );
}
