'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { SubscriptionsPage } from '../app/subscriptions/page';
import { CalendarPage } from '../app/calendar/page';
import { StatsPage } from '../app/stats/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    subscriptions: <SubscriptionsPage />,
    calendar: <CalendarPage />,
    stats: <StatsPage />,
  };
  return (
    <div data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
