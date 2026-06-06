'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Student, AttendanceRecord } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; students: Student[]; records: AttendanceRecord[]; setStudents: (s: Student[]) => void; setRecords: (r: AttendanceRecord[]) => void; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, students: [], records: [], setStudents: () => {}, setRecords: () => {} });
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [students] = useState<Student[]>([]);
  const [records] = useState<AttendanceRecord[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, students, records, setStudents: () => {}, setRecords: () => {} }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
