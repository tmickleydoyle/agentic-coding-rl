'use client';
import React, { createContext, useContext } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedThreadId: (id: string | null) => void;
  setSelectedUser: (user: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  selectedThreadId: null,
  selectedUser: null,
  navigate: () => {},
  setSelectedThreadId: () => {},
  setSelectedUser: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: 'home', selectedThreadId: null, selectedUser: null, navigate: () => {}, setSelectedThreadId: () => {}, setSelectedUser: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
