'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Task, Label, Route, TaskStatus, Priority } from '../lib/types';

interface AppState {
  route: Route;
  tasks: Task[];
  labels: Label[];
  navigate: (r: Route) => void;
  addTask: (data: Omit<Task, 'id'>) => void;
  moveForward: (id: string) => void;
  reopenTask: (id: string) => void;
  addLabel: (data: Omit<Label, 'id'>) => Label | null;
}

const AppContext = createContext<AppState>({
  route: 'home', tasks: [], labels: [],
  navigate: () => {}, addTask: () => {}, moveForward: () => {}, reopenTask: () => {}, addLabel: () => null,
});

export function useApp() { return useContext(AppContext); }

const seedLabels: Label[] = [{ id: 'l1', name: 'Bug' }, { id: 'l2', name: 'Feature' }, { id: 'l3', name: 'Docs' }];
const seedTasks: Task[] = [
  { id: 't1', title: 'Fix login bug', description: "Users can't log in", status: 'todo', label: 'Bug', priority: 'high' },
  { id: 't2', title: 'Add dark mode', description: 'Theme toggle', status: 'inprogress', label: 'Feature', priority: 'medium' },
  { id: 't3', title: 'Update README', description: 'Add setup guide', status: 'done', label: 'Docs', priority: 'low' },
  { id: 't4', title: 'Write unit tests', description: 'Cover auth module', status: 'todo', label: 'Feature', priority: 'high' },
];

let tid = 5; let lid = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [tasks, setTasks] = useState<Task[]>(seedTasks.map(t => ({ ...t })));
  const [labels, setLabels] = useState<Label[]>(seedLabels.map(l => ({ ...l })));

  function navigate(r: Route) { setRoute(r); }

  function addTask(data: Omit<Task, 'id'>) {
    setTasks(prev => [...prev, { id: `t${tid++}`, ...data }]);
  }

  function moveForward(id: string) {
    const nextStatus: Record<string, TaskStatus> = { todo: 'inprogress', inprogress: 'done' };
    setTasks(prev => prev.map(t => t.id === id && nextStatus[t.status] ? { ...t, status: nextStatus[t.status] } : t));
  }

  function reopenTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id && t.status === 'done' ? { ...t, status: 'todo' } : t));
  }

  function addLabel(data: Omit<Label, 'id'>): Label | null {
    if (labels.some(l => l.name.toLowerCase() === data.name.toLowerCase())) return null;
    const l: Label = { id: `l${lid++}`, ...data };
    setLabels(prev => [...prev, l]);
    return l;
  }

  return (
    <AppContext.Provider value={{ route, tasks, labels, navigate, addTask, moveForward, reopenTask, addLabel }}>
      {children}
    </AppContext.Provider>
  );
}
