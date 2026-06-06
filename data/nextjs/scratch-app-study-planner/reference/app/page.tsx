'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { SubjectsPage } from './subjects/page';
import { SessionsPage } from './sessions/page';
import { StatsPage } from './stats/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    subjects: <SubjectsPage />,
    sessions: <SessionsPage />,
    stats: <StatsPage />,
  };
  return (
    <div data-testid="app" data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
