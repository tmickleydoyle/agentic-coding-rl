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
  const [student, setStudent] = useState<Student>(defaultStudent);
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'Algebra II', instructor: 'Mr. Johnson', credits: 3, enrolled: true },
    { id: 2, title: 'Biology', instructor: 'Ms. Park', credits: 4, enrolled: true },
    { id: 3, title: 'World History', instructor: 'Dr. Chen', credits: 3, enrolled: false },
    { id: 4, title: 'Art Elective', instructor: 'Ms. Torres', credits: 2, enrolled: false },
  ]);
  const [progress, setProgress] = useState<Progress[]>([
    { courseId: 1, completed: 6, total: 12, lastActivity: '2024-01-15' },
    { courseId: 2, completed: 3, total: 10, lastActivity: '2024-01-14' },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, student, courses, progress, setStudent, setCourses, setProgress }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
