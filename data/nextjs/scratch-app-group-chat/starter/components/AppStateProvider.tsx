'use client';
import React, { createContext, useContext } from 'react';
import { Route, AppState } from '../lib/types';

interface AppContextValue extends AppState {
  navigate: (route: Route) => void;
  setSelectedRoomId: (id: string | null) => void;
  setSelectedUser: (user: string | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', selectedRoomId: null, selectedUser: null,
  navigate: () => {}, setSelectedRoomId: () => {}, setSelectedUser: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{ route: 'home', selectedRoomId: null, selectedUser: null, navigate: () => {}, setSelectedRoomId: () => {}, setSelectedUser: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
