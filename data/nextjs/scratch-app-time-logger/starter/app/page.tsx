'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { LogsPage } from '../app/logs/page';
import { ProjectsPage } from '../app/projects/page';
import { ReportPage } from '../app/report/page';
function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = { home: <HomePage />, logs: <LogsPage />, projects: <ProjectsPage />, report: <ReportPage /> };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
