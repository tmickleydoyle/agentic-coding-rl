'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Skill, Certificate } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; skills: Skill[]; certificates: Certificate[]; setSkills: (s: Skill[]) => void; setCertificates: (c: Certificate[]) => void; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, skills: [], certificates: [], setSkills: () => {}, setCertificates: () => {} });
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [skills] = useState<Skill[]>([]);
  const [certificates] = useState<Certificate[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, skills, certificates, setSkills: () => {}, setCertificates: () => {} }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
