'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { GroupsPage } from './groups/page';
import { ExpensesPage } from './expenses/page';
import { SettlePage } from './settle/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    groups: <GroupsPage />,
    expenses: <ExpensesPage />,
    settle: <SettlePage />,
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
