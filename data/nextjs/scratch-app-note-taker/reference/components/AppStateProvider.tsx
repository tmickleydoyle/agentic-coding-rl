'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Note, Route } from '../lib/types';

interface AppState {
  route: Route;
  notes: Note[];
  navigate: (r: Route) => void;
  addNote: (data: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
  setArchived: (id: string, archived: boolean) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', notes: [],
  navigate: () => {}, addNote: () => {}, deleteNote: () => {}, setArchived: () => {},
});

export function useApp() { return useContext(AppContext); }

const seed: Note[] = [
  { id: 'n1', title: 'Meeting notes', body: 'Discuss Q3 goals', tags: ['work', 'meeting'], archived: false, createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'n2', title: 'Recipe ideas', body: 'Try carbonara', tags: ['personal', 'food'], archived: false, createdAt: '2026-06-02T10:00:00Z', updatedAt: '2026-06-02T10:00:00Z' },
  { id: 'n3', title: 'Old diary', body: '2025 recap', tags: ['personal'], archived: true, createdAt: '2026-06-03T11:00:00Z', updatedAt: '2026-06-03T11:00:00Z' },
  { id: 'n4', title: 'Project plan', body: 'Phase 1 tasks', tags: ['work'], archived: false, createdAt: '2026-06-04T12:00:00Z', updatedAt: '2026-06-04T12:00:00Z' },
];

let nid = 5;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [notes, setNotes] = useState<Note[]>(seed.map(n => ({ ...n, tags: [...n.tags] })));

  function navigate(r: Route) { setRoute(r); }

  function addNote(data: Omit<Note, 'id'>) {
    setNotes(prev => [...prev, { id: `n${nid++}`, ...data }]);
  }

  function deleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  function setArchived(id: string, archived: boolean) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived, updatedAt: new Date().toISOString() } : n));
  }

  return (
    <AppContext.Provider value={{ route, notes, navigate, addNote, deleteNote, setArchived }}>
      {children}
    </AppContext.Provider>
  );
}
