'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Application, Contact, Note, Route } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  applications: [], setApplications: () => {},
  contacts: [], setContacts: () => {},
  notes: [], setNotes: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [applications, setApplications] = useState<Application[]>([
    { id: 'a1', company: 'Acme Inc', role: 'Engineer', status: 'applied', appliedDate: '2025-10-01', url: '' },
    { id: 'a2', company: 'Globex', role: 'Designer', status: 'interview', appliedDate: '2025-10-15', url: 'https://globex.com' },
  ]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'ct1', applicationId: 'a1', name: 'John Doe', email: 'john@acme.com', role: 'Recruiter' },
  ]);
  const [notes, setNotes] = useState<Note[]>([
    { id: 'n1', applicationId: 'a1', text: 'Applied via LinkedIn', createdAt: '2025-10-01' },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, applications, setApplications, contacts, setContacts, notes, setNotes }}>
      {children}
    </AppContext.Provider>
  );
}
