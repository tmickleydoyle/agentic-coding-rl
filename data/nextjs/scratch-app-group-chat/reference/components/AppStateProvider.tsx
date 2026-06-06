'use client';
import React, { createContext, useContext, useState } from 'react';
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
  const [route, setRoute] = useState<Route>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  return (
    <AppContext.Provider value={{ route, selectedRoomId, selectedUser, navigate: setRoute, setSelectedRoomId, setSelectedUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
