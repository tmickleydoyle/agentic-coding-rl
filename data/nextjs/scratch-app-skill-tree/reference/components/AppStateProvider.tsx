'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Skill, Path, LearnerProgress } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  skills: Skill[];
  paths: Path[];
  progress: LearnerProgress[];
  setProgress: (p: LearnerProgress[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  skills: [],
  paths: [],
  progress: [],
  setProgress: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [skills] = useState<Skill[]>([
    { id: 1, name: 'HTML Basics', category: 'Frontend', level: 1, prerequisites: [] },
    { id: 2, name: 'CSS Styling', category: 'Frontend', level: 1, prerequisites: [] },
    { id: 3, name: 'JavaScript Fundamentals', category: 'Frontend', level: 2, prerequisites: [1] },
    { id: 4, name: 'React', category: 'Frontend', level: 3, prerequisites: [3] },
    { id: 5, name: 'Node.js', category: 'Backend', level: 2, prerequisites: [3] },
    { id: 6, name: 'Databases', category: 'Backend', level: 2, prerequisites: [] },
  ]);
  const [paths] = useState<Path[]>([
    { id: 1, name: 'Frontend Developer', skillIds: [1, 2, 3, 4] },
    { id: 2, name: 'Full Stack Developer', skillIds: [1, 2, 3, 4, 5, 6] },
  ]);
  const [progress, setProgress] = useState<LearnerProgress[]>([
    { skillId: 1, status: 'completed' },
    { skillId: 2, status: 'completed' },
    { skillId: 3, status: 'in_progress' },
    { skillId: 4, status: 'locked' },
    { skillId: 5, status: 'locked' },
    { skillId: 6, status: 'available' },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, skills, paths, progress, setProgress }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
