'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Student, AttendanceRecord } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  students: Student[];
  records: AttendanceRecord[];
  setStudents: (s: Student[]) => void;
  setRecords: (r: AttendanceRecord[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  students: [],
  records: [],
  setStudents: () => {},
  setRecords: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Martinez' },
    { id: 3, name: 'Carol White' },
    { id: 4, name: 'David Lee' },
  ]);
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: 1, studentId: 1, date: '2024-01-15', status: 'present' },
    { id: 2, studentId: 2, date: '2024-01-15', status: 'absent' },
    { id: 3, studentId: 3, date: '2024-01-15', status: 'present' },
    { id: 4, studentId: 4, date: '2024-01-15', status: 'late' },
    { id: 5, studentId: 1, date: '2024-01-16', status: 'present' },
    { id: 6, studentId: 2, date: '2024-01-16', status: 'present' },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, students, records, setStudents, setRecords }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
