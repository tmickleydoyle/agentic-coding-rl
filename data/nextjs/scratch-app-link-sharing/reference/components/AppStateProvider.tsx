'use client';
import React, { createContext, useContext, useState } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedUser: (user: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedUser: null, navigate: () => {}, setSelectedUser: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ route, selectedUser, navigate: setRoute, setSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
