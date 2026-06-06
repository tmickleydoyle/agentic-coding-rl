'use client';
import React, { createContext, useContext } from 'react';
import type { Note, Route } from '../lib/types';
interface AppState { route: Route; notes: Note[]; navigate: (r: Route) => void; addNote: (d: Omit<Note, 'id'>) => void; deleteNote: (id: string) => void; setArchived: (id: string, archived: boolean) => void; }
const AppContext = createContext<AppState>({ route: 'home', notes: [], navigate: () => {}, addNote: () => {}, deleteNote: () => {}, setArchived: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', notes: [], navigate: () => {}, addNote: () => {}, deleteNote: () => {}, setArchived: () => {} }}>{children}</AppContext.Provider>;
}
