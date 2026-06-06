'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { RankingsPage } from './rankings/page';
import { SubmitPage } from './submit/page';
import { HistoryPage } from './history/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, rankings: <RankingsPage />, submit: <SubmitPage />, history: <HistoryPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
