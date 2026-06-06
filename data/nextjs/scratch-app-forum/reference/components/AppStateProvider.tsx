'use client';
import React, { createContext, useContext, useState } from 'react';
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
  const [route, setRoute] = useState<Route>('home');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  function navigate(r: Route) {
    setRoute(r);
  }

  return (
    <AppContext.Provider value={{ route, selectedThreadId, selectedUser, navigate, setSelectedThreadId, setSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
