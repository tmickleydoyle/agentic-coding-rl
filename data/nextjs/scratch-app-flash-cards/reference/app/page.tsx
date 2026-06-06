'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { DecksPage } from './decks/page';
import { StudyPage } from './study/page';
import { ProgressPage } from './progress/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    decks: <DecksPage />,
    study: <StudyPage />,
    progress: <ProgressPage />,
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
