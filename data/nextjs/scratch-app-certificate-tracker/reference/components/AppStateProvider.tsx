'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Skill, Certificate } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  skills: Skill[];
  certificates: Certificate[];
  setSkills: (s: Skill[]) => void;
  setCertificates: (c: Certificate[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  skills: [],
  certificates: [],
  setSkills: () => {},
  setCertificates: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'JavaScript', category: 'Programming', requiredHours: 40 },
    { id: 2, name: 'Python', category: 'Programming', requiredHours: 40 },
    { id: 3, name: 'Public Speaking', category: 'Soft Skills', requiredHours: 20 },
    { id: 4, name: 'Data Analysis', category: 'Analytics', requiredHours: 60 },
  ]);
  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 1, skillId: 1, recipientName: 'Alice Johnson', issuedDate: '2024-01-10', hoursCompleted: 45 },
    { id: 2, skillId: 3, recipientName: 'Bob Martinez', issuedDate: '2024-01-12', hoursCompleted: 22 },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, skills, certificates, setSkills, setCertificates }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
