'use client'
import React, { createContext, useContext, useState } from 'react';
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
  const [route, setRoute] = useState<Route>('home');
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 's1', name: 'Math', color: '#4f46e5' },
    { id: 's2', name: 'History', color: '#059669' },
  ]);
  const [sessions, setSessions] = useState<Session[]>([
    { id: 'ss1', subjectId: 's1', date: '2024-01-15', durationMinutes: 45, notes: 'Chapter 3' },
    { id: 'ss2', subjectId: 's2', date: '2024-01-15', durationMinutes: 30, notes: 'WWI overview' },
  ]);
  const [nextSid, setNextSid] = useState(3);
  const [nextSsid, setNextSsid] = useState(3);

  const navigate = (r: Route) => setRoute(r);

  const addSubject = (name: string, color: string): boolean => {
    if (!name.trim()) return false;
    if (subjects.find(s => s.name.toLowerCase() === name.toLowerCase())) return false;
    const subject: Subject = { id: `s${nextSid}`, name: name.trim(), color };
    setSubjects(prev => [...prev, subject]);
    setNextSid(n => n + 1);
    return true;
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setSessions(prev => prev.filter(s => s.subjectId !== id));
  };

  const addSession = (subjectId: string, date: string, durationMinutes: number, notes: string): boolean => {
    if (durationMinutes <= 0) return false;
    const session: Session = { id: `ss${nextSsid}`, subjectId, date, durationMinutes, notes };
    setSessions(prev => [...prev, session]);
    setNextSsid(n => n + 1);
    return true;
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{ route, subjects, sessions, navigate, addSubject, deleteSubject, addSession, deleteSession }}>
      {children}
    </AppContext.Provider>
  );
}
