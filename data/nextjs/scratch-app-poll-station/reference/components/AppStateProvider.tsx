'use client';
import React, { createContext, useContext, useState } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedPollId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedPollId: null, navigate: () => {}, setSelectedPollId: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ route, selectedPollId, navigate: setRoute, setSelectedPollId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
