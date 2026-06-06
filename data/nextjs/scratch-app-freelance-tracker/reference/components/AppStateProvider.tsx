'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
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
  const [route, setRoute] = useState<Route>('home');
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Alice Corp', email: 'alice@example.com', company: 'Alice Corp' },
    { id: 'c2', name: 'Bob LLC', email: 'bob@example.com', company: 'Bob LLC' },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', clientId: 'c1', title: 'Website Redesign', status: 'active', hourlyRate: 100, hoursLogged: 10 },
    { id: 'p2', clientId: 'c2', title: 'Logo Design', status: 'completed', hourlyRate: 80, hoursLogged: 5 },
  ]);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'i1', projectId: 'p1', amount: 1000, status: 'unpaid', dueDate: '2025-12-01' },
    { id: 'i2', projectId: 'p2', amount: 400, status: 'paid', dueDate: '2025-11-01' },
  ]);

  const navigate = useCallback((r: Route) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, clients, setClients, projects, setProjects, invoices, setInvoices }}>
      {children}
    </AppContext.Provider>
  );
}
