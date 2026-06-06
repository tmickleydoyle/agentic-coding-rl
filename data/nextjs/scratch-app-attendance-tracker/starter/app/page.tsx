'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { AttendancePage } from '../app/attendance/page';
import { StudentsPage } from '../app/students/page';
import { SummaryPage } from '../app/summary/page';
function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = { home: <HomePage />, attendance: <AttendancePage />, students: <StudentsPage />, summary: <SummaryPage /> };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
