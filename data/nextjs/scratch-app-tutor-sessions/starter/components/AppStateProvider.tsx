'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Tutor, Session } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; tutors: Tutor[]; sessions: Session[]; setTutors: (t: Tutor[]) => void; setSessions: (s: Session[]) => void; selectedTutorId: number | null; setSelectedTutorId: (id: number | null) => void; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, tutors: [], sessions: [], setTutors: () => {}, setSessions: () => {}, selectedTutorId: null, setSelectedTutorId: () => {} });
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [tutors] = useState<Tutor[]>([]);
  const [sessions] = useState<Session[]>([]);
  const [selectedTutorId] = useState<number | null>(null);
  return <AppContext.Provider value={{ route, navigate: setRoute, tutors, sessions, setTutors: () => {}, setSessions: () => {}, selectedTutorId, setSelectedTutorId: () => {} }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
