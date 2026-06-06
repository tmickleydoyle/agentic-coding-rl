'use client';
import React, { createContext, useContext, useState } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedArticleId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  selectedArticleId: null,
  navigate: () => {},
  setSelectedArticleId: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ route, selectedArticleId, navigate: setRoute, setSelectedArticleId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
