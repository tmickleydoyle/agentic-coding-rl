'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Tutor, Session } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  tutors: Tutor[];
  sessions: Session[];
  setTutors: (t: Tutor[]) => void;
  setSessions: (s: Session[]) => void;
  selectedTutorId: number | null;
  setSelectedTutorId: (id: number | null) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  tutors: [],
  sessions: [],
  setTutors: () => {},
  setSessions: () => {},
  selectedTutorId: null,
  setSelectedTutorId: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [tutors, setTutors] = useState<Tutor[]>([
    { id: 1, name: 'Dr. Allen', subject: 'Math', rating: 4.8, available: true },
    { id: 2, name: 'Prof. Baker', subject: 'Science', rating: 4.5, available: true },
    { id: 3, name: 'Ms. Clark', subject: 'English', rating: 4.9, available: false },
  ]);
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, tutorId: 1, studentName: 'Alice', date: '2024-02-01', time: '14:00', duration: 60, status: 'completed' },
    { id: 2, tutorId: 2, studentName: 'Bob', date: '2024-02-03', time: '10:00', duration: 45, status: 'scheduled' },
    { id: 3, tutorId: 1, studentName: 'Carol', date: '2024-02-05', time: '15:00', duration: 60, status: 'scheduled' },
  ]);
  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, tutors, sessions, setTutors, setSessions, selectedTutorId, setSelectedTutorId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
