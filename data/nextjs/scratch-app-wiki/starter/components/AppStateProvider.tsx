'use client';
import React, { createContext, useContext } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedArticleId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedArticleId: null, navigate: () => {}, setSelectedArticleId: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: 'home', selectedArticleId: null, navigate: () => {}, setSelectedArticleId: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
