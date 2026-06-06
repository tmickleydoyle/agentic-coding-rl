'use client'
import React, { createContext, useContext } from 'react';
import { Subject, Session, Route } from '../lib/types';

interface AppState {
  route: Route;
  subjects: Subject[];
  sessions: Session[];
  navigate: (r: Route) => void;
  addSubject: (name: string, color: string) => boolean;
  deleteSubject: (id: string) => void;
  addSession: (subjectId: string, date: string, durationMinutes: number, notes: string) => boolean;
  deleteSession: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home',
  subjects: [],
  sessions: [],
  navigate: () => {},
  addSubject: () => false,
  deleteSubject: () => {},
  addSession: () => false,
  deleteSession: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home',
      subjects: [],
      sessions: [],
      navigate: () => {},
      addSubject: () => false,
      deleteSubject: () => {},
      addSession: () => false,
      deleteSession: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
