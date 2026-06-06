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
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Martinez' },
    { id: 3, name: 'Carol White' },
  ]);
  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, studentId: 1, subject: 'Math', score: 92, maxScore: 100 },
    { id: 2, studentId: 1, subject: 'Science', score: 85, maxScore: 100 },
    { id: 3, studentId: 2, subject: 'Math', score: 78, maxScore: 100 },
    { id: 4, studentId: 3, subject: 'English', score: 95, maxScore: 100 },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, students, grades, subjects: ['Math', 'Science', 'English'], setStudents, setGrades }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
