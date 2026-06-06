'use client';
import React, { createContext, useContext } from 'react';
import type { Route, Client, Project, Invoice } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  clients: [],
  setClients: () => {},
  projects: [],
  setProjects: () => {},
  invoices: [],
  setInvoices: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home',
      navigate: () => {},
      clients: [],
      setClients: () => {},
      projects: [],
      setProjects: () => {},
      invoices: [],
      setInvoices: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
