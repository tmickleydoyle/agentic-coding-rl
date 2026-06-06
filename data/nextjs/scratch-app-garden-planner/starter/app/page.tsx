'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { PlantsPage } from '../app/plants/page';
import { BedsPage } from '../app/beds/page';
import { LogPage } from '../app/log/page';
function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = { home: <HomePage />, plants: <PlantsPage />, beds: <BedsPage />, log: <LogPage /> };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}
export default function App() { return <AppStateProvider><Shell /></AppStateProvider>; }
