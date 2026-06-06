'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Student, Course, Progress } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  student: Student;
  courses: Course[];
  progress: Progress[];
  setStudent: (s: Student) => void;
  setCourses: (c: Course[]) => void;
  setProgress: (p: Progress[]) => void;
}

const defaultStudent: Student = { id: 1, name: 'Alex Rivera', email: 'alex@school.edu', grade: '10th' };

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  student: defaultStudent,
  courses: [],
  progress: [],
  setStudent: () => {},
  setCourses: () => {},
  setProgress: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [student] = useState<Student>(defaultStudent);
  const [courses] = useState<Course[]>([]);
  const [progress] = useState<Progress[]>([]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, student, courses, progress, setStudent: () => {}, setCourses: () => {}, setProgress: () => {} }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
