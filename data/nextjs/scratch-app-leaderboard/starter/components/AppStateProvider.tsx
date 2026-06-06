'use client';
import React, { createContext, useContext } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedPlayer: (player: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedPlayer: null, navigate: () => {}, setSelectedPlayer: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: 'home', selectedPlayer: null, navigate: () => {}, setSelectedPlayer: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
