'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Subscription, Route } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  subs: Subscription[];
  setSubs: React.Dispatch<React.SetStateAction<Subscription[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  subs: [],
  setSubs: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [subs, setSubs] = useState<Subscription[]>([
    { id: 's1', name: 'Netflix', monthlyCost: 15.99, billingDay: 1, category: 'Entertainment', status: 'active' },
    { id: 's2', name: 'Spotify', monthlyCost: 9.99, billingDay: 15, category: 'Entertainment', status: 'active' },
    { id: 's3', name: 'GitHub', monthlyCost: 4, billingDay: 20, category: 'Dev Tools', status: 'paused' },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, subs, setSubs }}>
      {children}
    </AppContext.Provider>
  );
}
