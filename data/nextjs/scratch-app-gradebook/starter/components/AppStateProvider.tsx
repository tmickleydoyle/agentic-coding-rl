'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Student, Grade } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  students: Student[];
  grades: Grade[];
  subjects: string[];
  setStudents: (s: Student[]) => void;
  setGrades: (g: Grade[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  students: [],
  grades: [],
  subjects: ['Math', 'Science', 'English'],
  setStudents: () => {},
  setGrades: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [students] = useState<Student[]>([]);
  const [grades] = useState<Grade[]>([]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, students, grades, subjects: ['Math', 'Science', 'English'], setStudents: () => {}, setGrades: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
