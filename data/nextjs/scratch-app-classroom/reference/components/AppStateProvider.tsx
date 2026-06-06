'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Classroom, Student, Assignment } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  classroom: Classroom;
  students: Student[];
  assignments: Assignment[];
  setStudents: (s: Student[]) => void;
  setAssignments: (a: Assignment[]) => void;
}

const defaultClassroom: Classroom = {
  name: 'Math 101',
  teacher: 'Ms. Smith',
  room: 'A204',
  period: 2,
  schedule: { days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '09:50' },
};

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  classroom: defaultClassroom,
  students: [],
  assignments: [],
  setStudents: () => {},
  setAssignments: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, classroom: defaultClassroom, students, assignments, setStudents, setAssignments }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
