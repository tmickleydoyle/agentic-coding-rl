'use client';
import React, { createContext, useContext } from 'react';
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
  return (
    <AppContext.Provider value={{ route: 'home', navigate: () => {}, subs: [], setSubs: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
