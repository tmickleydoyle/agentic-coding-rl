'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Skill, Path, LearnerProgress } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; skills: Skill[]; paths: Path[]; progress: LearnerProgress[]; setProgress: (p: LearnerProgress[]) => void; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, skills: [], paths: [], progress: [], setProgress: () => {} });
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [skills] = useState<Skill[]>([]);
  const [paths] = useState<Path[]>([]);
  const [progress] = useState<LearnerProgress[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, skills, paths, progress, setProgress: () => {} }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
