'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { DecksPage } from '../app/decks/page';
import { StudyPage } from '../app/study/page';
import { StatsPage } from '../app/stats/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, decks: <DecksPage />, study: <StudyPage />, stats: <StatsPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
