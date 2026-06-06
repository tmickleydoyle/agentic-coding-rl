'use client';
import React, { createContext, useContext, useState } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedPlayer: (player: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedPlayer: null, navigate: () => {}, setSelectedPlayer: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ route, selectedPlayer, navigate: setRoute, setSelectedPlayer }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
