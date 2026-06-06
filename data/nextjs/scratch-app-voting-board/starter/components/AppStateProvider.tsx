'use client';
import React, { createContext, useContext } from 'react';
import { Route } from '../lib/types';

interface AppContextValue { route: Route; navigate: (route: Route) => void; }

const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {} });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {} }}>{children}</AppContext.Provider>;
}

export function useApp() { return useContext(AppContext); }
