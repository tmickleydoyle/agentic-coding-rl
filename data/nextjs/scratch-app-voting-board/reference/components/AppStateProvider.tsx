'use client';
import React, { createContext, useContext, useState } from 'react';
import { Route } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {} });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  return <AppContext.Provider value={{ route, navigate: setRoute }}>{children}</AppContext.Provider>;
}

export function useApp() { return useContext(AppContext); }
