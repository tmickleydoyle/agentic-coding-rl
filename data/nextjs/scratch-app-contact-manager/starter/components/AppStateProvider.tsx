'use client';
import React, { createContext, useContext } from 'react';
import type { Contact, Group, Route } from '../lib/types';
interface AppState { route: Route; contacts: Contact[]; groups: Group[]; navigate: (r: Route) => void; addContact: (data: Omit<Contact, 'id'>) => string | null; deleteContact: (id: string) => void; addGroup: (data: Omit<Group, 'id'>) => Group | null; }
const AppContext = createContext<AppState>({ route: 'home', contacts: [], groups: [], navigate: () => {}, addContact: () => null, deleteContact: () => {}, addGroup: () => null });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', contacts: [], groups: [], navigate: () => {}, addContact: () => null, deleteContact: () => {}, addGroup: () => null }}>{children}</AppContext.Provider>;
}
