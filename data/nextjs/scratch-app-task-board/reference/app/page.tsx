'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { BoardPage } from '../app/board/page';
import { CompletedPage } from '../app/completed/page';
import { SettingsPage } from '../app/settings/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, board: <BoardPage />, completed: <CompletedPage />, settings: <SettingsPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
