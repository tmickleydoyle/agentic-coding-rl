'use client';
import React, { createContext, useContext } from 'react';
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
  return (
    <AppContext.Provider value={{ route: 'home', navigate: () => {}, applications: [], setApplications: () => {}, contacts: [], setContacts: () => {}, notes: [], setNotes: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}
