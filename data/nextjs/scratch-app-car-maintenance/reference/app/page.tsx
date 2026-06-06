'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { VehiclesPage } from '../app/vehicles/page';
import { ServicePage } from '../app/service/page';
import { RemindersPage } from '../app/reminders/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, vehicles: <VehiclesPage />, service: <ServicePage />, reminders: <RemindersPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
