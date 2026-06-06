'use client';
import React, { createContext, useContext } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedPollId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedPollId: null, navigate: () => {}, setSelectedPollId: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: 'home', selectedPollId: null, navigate: () => {}, setSelectedPollId: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
