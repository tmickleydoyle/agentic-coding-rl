'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { ExercisesPage } from './exercises/page';
import { RoutinesPage } from './routines/page';
import { LogPage } from './log/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    exercises: <ExercisesPage />,
    routines: <RoutinesPage />,
    log: <LogPage />,
  };
  return (
    <div data-testid="app" data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
