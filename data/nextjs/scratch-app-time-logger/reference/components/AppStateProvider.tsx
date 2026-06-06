'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Project, TimeEntry, Route } from '../lib/types';

interface AppState {
  route: Route;
  projects: Project[];
  entries: TimeEntry[];
  navigate: (r: Route) => void;
  addEntry: (data: Omit<TimeEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  addProject: (data: Omit<Project, 'id'>) => Project | null;
}

const AppContext = createContext<AppState>({
  route: 'home', projects: [], entries: [],
  navigate: () => {}, addEntry: () => {}, deleteEntry: () => {}, addProject: () => null,
});

export function useApp() { return useContext(AppContext); }

const seedProjects: Project[] = [
  { id: 'p1', name: 'Website Redesign', color: '#3b82f6' },
  { id: 'p2', name: 'Mobile App', color: '#10b981' },
  { id: 'p3', name: 'API Integration', color: '#f59e0b' },
];
const seedEntries: TimeEntry[] = [
  { id: 'te1', projectId: 'p1', description: 'Homepage layout', hours: 3, date: '2026-06-01' },
  { id: 'te2', projectId: 'p2', description: 'Login screen', hours: 2, date: '2026-06-02' },
  { id: 'te3', projectId: 'p1', description: 'Navigation design', hours: 1.5, date: '2026-06-03' },
  { id: 'te4', projectId: 'p3', description: 'Auth endpoints', hours: 4, date: '2026-06-04' },
];

let pid = 4; let eid = 5;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [projects, setProjects] = useState<Project[]>(seedProjects.map(p => ({ ...p })));
  const [entries, setEntries] = useState<TimeEntry[]>(seedEntries.map(e => ({ ...e })));

  function navigate(r: Route) { setRoute(r); }

  function addEntry(data: Omit<TimeEntry, 'id'>) {
    setEntries(prev => [...prev, { id: `te${eid++}`, ...data }]);
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function addProject(data: Omit<Project, 'id'>): Project | null {
    if (projects.some(p => p.name.toLowerCase() === data.name.toLowerCase())) return null;
    const p: Project = { id: `p${pid++}`, ...data };
    setProjects(prev => [...prev, p]);
    return p;
  }

  return (
    <AppContext.Provider value={{ route, projects, entries, navigate, addEntry, deleteEntry, addProject }}>
      {children}
    </AppContext.Provider>
  );
}
